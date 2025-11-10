"""
Business: Управление членами семьи (получение, добавление, обновление)
Args: event с httpMethod, body, headers с X-Auth-Token
Returns: JSON со списком членов семьи или результатом операции
"""

import json
import os
from datetime import datetime
from typing import Dict, Any, Optional, List
import psycopg2
from psycopg2.extras import RealDictCursor

DATABASE_URL = os.environ.get('DATABASE_URL')
SCHEMA = 't_p5815085_family_assistant_pro'

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

def get_family_members(family_id: str) -> List[Dict[str, Any]]:
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute(
        f"""
        SELECT id, user_id, name, role, relationship, avatar, avatar_type, 
               photo_url, points, level, workload, age, created_at, updated_at
        FROM {SCHEMA}.family_members
        WHERE family_id = %s
        ORDER BY created_at ASC
        """,
        (family_id,)
    )
    members = cur.fetchall()
    cur.close()
    conn.close()
    
    return [dict(m) for m in members]

def add_family_member(family_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        cur.execute(
            f"""
            INSERT INTO {SCHEMA}.family_members
            (family_id, name, role, relationship, avatar, avatar_type, 
             photo_url, points, level, workload, age)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id, name, role, relationship, avatar, points, level, workload
            """,
            (
                family_id,
                data.get('name', ''),
                data.get('role', 'Член семьи'),
                data.get('relationship', ''),
                data.get('avatar', '👤'),
                data.get('avatar_type', 'emoji'),
                data.get('photo_url'),
                data.get('points', 0),
                data.get('level', 1),
                data.get('workload', 0),
                data.get('age')
            )
        )
        member = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'success': True,
            'member': dict(member)
        }
    except Exception as e:
        conn.rollback()
        cur.close()
        conn.close()
        return {'error': str(e)}

def update_family_member(member_id: str, family_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        cur.execute(
            f"SELECT id FROM {SCHEMA}.family_members WHERE id = %s AND family_id = %s",
            (member_id, family_id)
        )
        if not cur.fetchone():
            cur.close()
            conn.close()
            return {'error': 'Член семьи не найден'}
        
        fields = []
        values = []
        
        for field in ['name', 'role', 'relationship', 'avatar', 'avatar_type', 
                      'photo_url', 'points', 'level', 'workload', 'age']:
            if field in data:
                fields.append(f"{field} = %s")
                values.append(data[field])
        
        if not fields:
            cur.close()
            conn.close()
            return {'error': 'Нет данных для обновления'}
        
        fields.append("updated_at = CURRENT_TIMESTAMP")
        values.extend([member_id, family_id])
        
        query = f"""
            UPDATE {SCHEMA}.family_members 
            SET {', '.join(fields)}
            WHERE id = %s AND family_id = %s
            RETURNING id, name, role, relationship, avatar, points, level, workload
        """
        
        cur.execute(query, tuple(values))
        member = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'success': True,
            'member': dict(member)
        }
    except Exception as e:
        conn.rollback()
        cur.close()
        conn.close()
        return {'error': str(e)}

def delete_family_member(member_id: str, family_id: str) -> Dict[str, Any]:
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        cur.execute(
            f"SELECT user_id FROM {SCHEMA}.family_members WHERE id = %s AND family_id = %s",
            (member_id, family_id)
        )
        member = cur.fetchone()
        
        if not member:
            cur.close()
            conn.close()
            return {'error': 'Член семьи не найден'}
        
        if member['user_id']:
            cur.close()
            conn.close()
            return {'error': 'Нельзя удалить члена семьи с привязанным аккаунтом'}
        
        cur.execute(
            f"UPDATE {SCHEMA}.family_members SET family_id = NULL WHERE id = %s",
            (member_id,)
        )
        conn.commit()
        cur.close()
        conn.close()
        
        return {'success': True}
    except Exception as e:
        conn.rollback()
        cur.close()
        conn.close()
        return {'error': str(e)}

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
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
        
        if method == 'GET':
            members = get_family_members(family_id)
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'members': members}, default=str)
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            result = add_family_member(family_id, body)
            
            if 'error' in result:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps(result)
                }
            
            return {
                'statusCode': 201,
                'headers': headers,
                'body': json.dumps(result, default=str)
            }
        
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            member_id = body.get('id')
            
            if not member_id:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'Требуется ID члена семьи'})
                }
            
            result = update_family_member(member_id, family_id, body)
            
            if 'error' in result:
                return {
                    'statusCode': 404 if 'не найден' in result['error'] else 400,
                    'headers': headers,
                    'body': json.dumps(result)
                }
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps(result, default=str)
            }
        
        elif method == 'DELETE':
            params = event.get('queryStringParameters', {})
            member_id = params.get('id')
            
            if not member_id:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'Требуется ID члена семьи'})
                }
            
            result = delete_family_member(member_id, family_id)
            
            if 'error' in result:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps(result)
                }
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps(result)
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
