# 📱 Мобильное приложение - React Native

## Структура проекта для React Native версии

Ваш текущий проект готов к переносу на React Native! Все backend функции уже работают через API и доступны из мобильного приложения.

## 🚀 Быстрый старт

### 1. Создание React Native проекта

```bash
npx react-native init FamilyOrganizerMobile
cd FamilyOrganizerMobile
```

### 2. Установка зависимостей

```bash
npm install @react-navigation/native @react-navigation/stack
npm install react-native-screens react-native-safe-area-context
npm install axios
npm install @react-native-async-storage/async-storage
npm install react-native-vector-icons
```

### 3. Переиспользование компонентов

Большинство React компонентов можно переиспользовать с минимальными изменениями:

**Что работает без изменений:**
- ✅ Вся бизнес-логика (hooks, utils)
- ✅ API интеграции (fetch запросы)
- ✅ Типы TypeScript
- ✅ Состояние приложения

**Что нужно адаптировать:**
- 🔄 UI компоненты (вместо HTML → React Native компоненты)
- 🔄 Навигация (React Router → React Navigation)
- 🔄 Стили (CSS → StyleSheet)

## 📂 Рекомендуемая структура

```
FamilyOrganizerMobile/
├── src/
│   ├── screens/          # Экраны приложения
│   │   ├── AuthScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── TasksScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── components/       # Переиспользуемые компоненты
│   │   ├── TaskCard.tsx
│   │   ├── MemberCard.tsx
│   │   └── Button.tsx
│   ├── hooks/           # Хуки (копируются из веба)
│   │   ├── useTasks.ts
│   │   └── useAuth.ts
│   ├── api/             # API клиенты
│   │   ├── auth.ts
│   │   ├── tasks.ts
│   │   └── config.ts
│   ├── types/           # TypeScript типы
│   │   └── index.ts
│   └── navigation/      # Навигация
│       └── AppNavigator.tsx
├── android/
├── ios/
└── package.json
```

## 🔗 API Endpoints (уже готовы!)

Все backend функции доступны по URL:

```typescript
const API_BASE = 'https://functions.poehali.dev';

const ENDPOINTS = {
  auth: `${API_BASE}/b9b956c8-e2a6-4c20-aef8-b8422e8cb3b0`,
  tasks: `${API_BASE}/638290a3-bc43-46ef-9ca1-1e80b72544bf`,
  invites: `${API_BASE}/c30902b1-40c9-48c1-9d81-b0fab5788b9d`,
  userManagement: `${API_BASE}/db70be67-64af-4e9d-ab90-8485ed49c99f`,
  calendar: `${API_BASE}/[GOOGLE_CALENDAR_URL]`,
  export: `${API_BASE}/[EXPORT_URL]`,
  payments: `${API_BASE}/[PAYMENTS_URL]`
};
```

## 📝 Пример адаптации компонента

### Веб версия (React):
```tsx
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function TaskCard({ task }) {
  return (
    <Card className="p-4">
      <CardContent>
        <h3>{task.title}</h3>
        <Button onClick={handleComplete}>Завершить</Button>
      </CardContent>
    </Card>
  );
}
```

### Мобильная версия (React Native):
```tsx
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function TaskCard({ task }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{task.title}</Text>
      <TouchableOpacity style={styles.button} onPress={handleComplete}>
        <Text style={styles.buttonText}>Завершить</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, backgroundColor: '#fff', borderRadius: 8 },
  title: { fontSize: 18, fontWeight: 'bold' },
  button: { marginTop: 12, padding: 12, backgroundColor: '#3b82f6' },
  buttonText: { color: '#fff', textAlign: 'center' }
});
```

## 🎨 UI библиотеки для React Native

Рекомендую использовать:

1. **React Native Paper** - Material Design компоненты
```bash
npm install react-native-paper
```

2. **React Native Elements** - красивые UI компоненты
```bash
npm install react-native-elements
```

3. **NativeBase** - готовые компоненты
```bash
npm install native-base
```

## 🔐 Авторизация в мобильном приложении

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Сохранение токена
await AsyncStorage.setItem('authToken', token);

// Получение токена
const token = await AsyncStorage.getItem('authToken');

// Запрос с авторизацией
fetch(ENDPOINTS.tasks, {
  headers: {
    'X-Auth-Token': token
  }
});
```

## 📱 Особенности мобильной версии

### Push-уведомления
Добавьте уведомления о задачах:
```bash
npm install @react-native-firebase/messaging
```

### Локальные уведомления
```bash
npm install @notifee/react-native
```

### Календарь
```bash
npm install react-native-calendars
```

### Камера (для фото профиля)
```bash
npm install react-native-image-picker
```

## 🚢 Деплой мобильного приложения

### iOS (App Store):
1. Настройте Xcode
2. Создайте Apple Developer аккаунт ($99/год)
3. Соберите релиз: `cd ios && pod install && cd ..`
4. Откройте `.xcworkspace` в Xcode
5. Archive → Upload to App Store

### Android (Google Play):
1. Настройте подпись приложения
2. Соберите APK: `cd android && ./gradlew assembleRelease`
3. Загрузите в Google Play Console

## 📊 Преимущества React Native версии

✅ **Единая кодовая база** - 90% кода общий для iOS и Android  
✅ **Нативная производительность** - быстрее PWA  
✅ **Push-уведомления** - настоящие системные уведомления  
✅ **Оффлайн режим** - работа без интернета  
✅ **Доступ к камере, GPS, контактам**  
✅ **Публикация в App Store и Google Play**  

## 🎯 Roadmap мобильного приложения

**Фаза 1 (1-2 недели):**
- ✅ Настройка проекта
- ✅ Экран авторизации
- ✅ Список задач
- ✅ Базовая навигация

**Фаза 2 (2-3 недели):**
- ✅ Создание/редактирование задач
- ✅ Профиль пользователя
- ✅ Календарь событий
- ✅ Push-уведомления

**Фаза 3 (3-4 недели):**
- ✅ Оффлайн режим
- ✅ Синхронизация данных
- ✅ Камера для фото
- ✅ Полировка UI

**Фаза 4 (4-5 недель):**
- ✅ Тестирование
- ✅ Подготовка к релизу
- ✅ Публикация в сторах

## 💡 Полезные ресурсы

- **React Native документация**: https://reactnative.dev
- **React Navigation**: https://reactnavigation.org
- **Expo** (альтернатива): https://expo.dev
- **Awesome React Native**: https://github.com/jondot/awesome-react-native

## 🔧 Автоматизация

Используйте **Expo** для быстрого старта:
```bash
npx create-expo-app FamilyOrganizerMobile
cd FamilyOrganizerMobile
npx expo start
```

Expo предоставляет:
- 🚀 Быстрый старт без настройки
- 📱 Тестирование на реальных устройствах через QR код
- 🔄 Hot reload
- 📦 Over-the-air updates

---

## ✨ Итог

Все готово для создания мобильного приложения! Backend уже работает, API доступны, осталось только адаптировать UI компоненты для React Native.

**Время разработки:** 4-6 недель  
**Сложность:** Средняя (если есть опыт с React)  
**Результат:** Нативное приложение для iOS и Android

Хотите помощь в настройке проекта или миграции компонентов? 🚀
