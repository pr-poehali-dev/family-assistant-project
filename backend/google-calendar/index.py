"""
Business: Интеграция с Google Calendar - импорт событий в семейный календарь
Args: event с httpMethod, body (access_token), headers с X-Auth-Token
Returns: JSON со списком импортированных событий
"""

import json
import os
from datetime import datetime, timedelta
from typing import Dict, Any, Optional, List
import psycopg2
from psycopg2.extras import RealDictCursor
from urllib.request import urlopen, Request
from urllib.parse import urlencode

DATABASE_URL = os.environ.get('DATABASE_URL')
SCHEMA = 't_p5815085_family_assistant_pro'
GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CALENDAR_CLIENT_ID')
GOOGLE_CLIENT_SECRET = os.environ.get('GOOGLE_CALENDAR_CLIENT_SECRET')

def get_db_connection():
    return psycopg2.connect(DATABASE_URL)

def verify_token(token: str) -> Optional[str]:
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute(
        f"""
        SELECT user_id FROM {SCHEMA}.sessions 
        WHERE token = %s AND expires_at > CURRENT_TIMESTAMP
        """,
        (token,)
    )
    session = cur.fetchone()
    cur.close()
    conn.close()
    
    return str(session['user_id']) if session else None

def get_user_family_id(user_id: str) -> Optional[str]:
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute(
        f"""
        SELECT family_id FROM {SCHEMA}.family_members 
        WHERE user_id = %s LIMIT 1
        """,
        (user_id,)
    )
    member = cur.fetchone()
    cur.close()
    conn.close()
    
    return str(member['family_id']) if member else None

def fetch_google_calendar_events(access_token: str) -> List[Dict[str, Any]]:
    try:
        time_min = datetime.utcnow().isoformat() + 'Z'
        time_max = (datetime.utcnow() + timedelta(days=30)).isoformat() + 'Z'
        
        url = f'https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin={time_min}&timeMax={time_max}&maxResults=50&singleEvents=true&orderBy=startTime'
        
        req = Request(url)
        req.add_header('Authorization', f'Bearer {access_token}')
        
        response = urlopen(req)
        data = json.loads(response.read().decode())
        
        events = []
        for item in data.get('items', []):
            start = item.get('start', {})
            end = item.get('end', {})
            
            events.append({
                'google_id': item.get('id'),
                'title': item.get('summary', 'Без названия'),
                'description': item.get('description', ''),
                'start_time': start.get('dateTime') or start.get('date'),
                'end_time': end.get('dateTime') or end.get('date'),
                'location': item.get('location', ''),
                'attendees': len(item.get('attendees', []))
            })
        
        return events
    except Exception as e:
        raise Exception(f'Ошибка получения событий: {str(e)}')

def import_events_to_db(family_id: str, events: List[Dict[str, Any]]) -> int:
    conn = get_db_connection()
    cur = conn.cursor()
    
    imported_count = 0
    
    try:
        for event in events:
            cur.execute(
                f"""
                INSERT INTO {SCHEMA}.tasks 
                (family_id, title, description, completed, category, created_at)
                VALUES (%s, %s, %s, %s, %s, %s)
                ON CONFLICT DO NOTHING
                """,
                (
                    family_id,
                    f"📅 {event['title']}",
                    f"{event['description']}\n\nВремя: {event['start_time']}\nИмпортировано из Google Calendar",
                    False,
                    'google_calendar',
                    datetime.now()
                )
            )
            if cur.rowcount > 0:
                imported_count += 1
        
        conn.commit()
        cur.close()
        conn.close()
        
        return imported_count
    except Exception as e:
        conn.rollback()
        cur.close()
        conn.close()
        raise Exception(f'Ошибка импорта: {str(e)}')

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    
    try:
        if method == 'GET':
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({
                    'client_id': GOOGLE_CLIENT_ID,
                    'redirect_uri': event.get('headers', {}).get('referer', '') + 'calendar'
                })
            }
        
        if method == 'POST':
            token = event.get('headers', {}).get('X-Auth-Token', '')
            user_id = verify_token(token)
            
            if not user_id:
                return {
                    'statusCode': 401,
                    'headers': headers,
                    'body': json.dumps({'error': 'Требуется авторизация'})
                }
            
            family_id = get_user_family_id(user_id)
            if not family_id:
                return {
                    'statusCode': 403,
                    'headers': headers,
                    'body': json.dumps({'error': 'Пользователь не состоит в семье'})
                }
            
            body = json.loads(event.get('body', '{}'))
            access_token = body.get('access_token', '')
            
            if not access_token:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'Требуется access_token'})
                }
            
            google_events = fetch_google_calendar_events(access_token)
            imported_count = import_events_to_db(family_id, google_events)
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({
                    'success': True,
                    'imported_count': imported_count,
                    'total_events': len(google_events),
                    'message': f'Импортировано {imported_count} событий из {len(google_events)}'
                })
            }
        
        return {
            'statusCode': 405,
            'headers': headers,
            'body': json.dumps({'error': 'Метод не поддерживается'})
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)})
        }
