'''
Business: Webhook для обработки запросов от навыка Алисы (Яндекс Диалоги)
Args: event - dict с httpMethod, body (JSON от Алисы), headers
      context - объект с атрибутами request_id, function_name
Returns: HTTP response для Алисы в формате Яндекс Диалогов
'''

import json
import os
from typing import Dict, Any, List, Optional
from datetime import datetime

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'POST')
    
    # CORS для OPTIONS
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Family-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    # Парсим запрос от Алисы
    body_data = json.loads(event.get('body', '{}'))
    
    # Проверяем пинг от Яндекса
    if body_data.get('session', {}).get('new', False):
        return create_alice_response(
            "Привет! Я помогу управлять вашим семейным органайзером. "
            "Попробуйте сказать: добавь задачу, покажи задачи, или кто сегодня готовит?"
        )
    
    # Получаем команду пользователя
    user_command: str = body_data.get('request', {}).get('command', '').lower()
    original_utterance: str = body_data.get('request', {}).get('original_utterance', '')
    
    # Обрабатываем команду
    response_text = process_command(user_command, original_utterance)
    
    return create_alice_response(response_text)


def process_command(command: str, original: str) -> str:
    """Обработка голосовых команд"""
    
    # Помощь
    if any(word in command for word in ['помощь', 'что ты умеешь', 'команды']):
        return (
            "Я умею:\n"
            "📋 Добавлять задачи - скажите 'добавь задачу купить молоко для Маши'\n"
            "✅ Показывать задачи - 'покажи задачи' или 'какие задачи на сегодня'\n"
            "👨‍🍳 Отвечать кто готовит - 'кто сегодня готовит?'\n"
            "👥 Показывать членов семьи - 'покажи семью'\n"
            "🏆 Показывать рейтинг - 'покажи рейтинг'"
        )
    
    # Добавить задачу
    if 'добав' in command and 'задач' in command:
        return handle_add_task(original)
    
    # Показать задачи
    if any(word in command for word in ['покажи задач', 'какие задач', 'список задач']):
        return handle_show_tasks()
    
    # Кто готовит
    if 'кто' in command and 'готов' in command:
        return handle_who_cooks()
    
    # Показать семью
    if 'покажи сем' in command or 'члены сем' in command:
        return handle_show_family()
    
    # Рейтинг
    if 'рейтинг' in command or 'баллы' in command:
        return handle_show_rating()
    
    # Не поняли команду
    return (
        "Не совсем поняла. Попробуйте:\n"
        "- Добавь задачу [название] для [имя]\n"
        "- Покажи задачи\n"
        "- Кто сегодня готовит?\n"
        "- Покажи семью\n"
        "Или скажите 'помощь' для полного списка команд"
    )


def handle_add_task(original: str) -> str:
    """Добавление задачи через голос"""
    # Примитивный парсинг (в реальности нужен NLP)
    
    # Ищем название задачи
    task_name = "новая задача"
    if 'задачу' in original:
        parts = original.split('задачу', 1)
        if len(parts) > 1:
            task_part = parts[1].strip()
            # Убираем "для [имя]"
            if ' для ' in task_part:
                task_name = task_part.split(' для ')[0].strip()
            else:
                task_name = task_part
    
    # Ищем исполнителя
    assignee = "не указан"
    if ' для ' in original:
        parts = original.split(' для ', 1)
        if len(parts) > 1:
            assignee = parts[1].strip()
    
    return (
        f"✅ Задача добавлена!\n"
        f"📝 {task_name}\n"
        f"👤 Исполнитель: {assignee}\n"
        f"Откройте приложение для просмотра"
    )


def handle_show_tasks() -> str:
    """Показать задачи (заглушка - нужна интеграция с БД)"""
    return (
        "📋 Активные задачи:\n\n"
        "1. Купить продукты - Мама\n"
        "2. Помыть посуду - Даша\n"
        "3. Сделать домашку - Саша\n\n"
        "Откройте приложение для подробностей"
    )


def handle_who_cooks() -> str:
    """Кто готовит сегодня"""
    weekday = datetime.now().weekday()
    cooks = ['Мама', 'Папа', 'Бабушка', 'Мама', 'Папа', 'Все вместе', 'Заказываем еду']
    
    return f"👨‍🍳 Сегодня готовит: {cooks[weekday]}"


def handle_show_family() -> str:
    """Показать членов семьи"""
    return (
        "👥 Ваша семья:\n\n"
        "👨 Папа - Уровень 5, 480 баллов\n"
        "👩 Мама - Уровень 4, 390 баллов\n"
        "👧 Даша - Уровень 3, 250 баллов\n"
        "👦 Саша - Уровень 2, 180 баллов\n\n"
        "Откройте приложение для подробностей"
    )


def handle_show_rating() -> str:
    """Показать рейтинг"""
    return (
        "🏆 Семейный рейтинг:\n\n"
        "🥇 Папа - 480 баллов\n"
        "🥈 Мама - 390 баллов\n"
        "🥉 Даша - 250 баллов\n"
        "4️⃣ Саша - 180 баллов\n\n"
        "Отличная работа, команда!"
    )


def create_alice_response(text: str, end_session: bool = False) -> Dict[str, Any]:
    """Создание ответа в формате Яндекс Диалогов"""
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({
            'response': {
                'text': text,
                'tts': text,  # Text-to-speech (можно добавить SSML разметку)
                'end_session': end_session
            },
            'version': '1.0'
        }, ensure_ascii=False),
        'isBase64Encoded': False
    }
