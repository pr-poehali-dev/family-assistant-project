import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface AuthFormProps {
  onAuthSuccess: (token: string, user: any) => void;
}

export default function AuthForm({ onAuthSuccess }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [registerMethod, setRegisterMethod] = useState<'email' | 'phone'>('email');
  
  const [registerData, setRegisterData] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    familyName: ''
  });
  
  const [loginData, setLoginData] = useState({
    login: '',
    password: ''
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (registerData.password !== registerData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    
    const credential = registerMethod === 'email' ? registerData.email : registerData.phone;
    if (!credential) {
      setError(`Укажите ${registerMethod === 'email' ? 'email' : 'телефон'}`);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const requestBody = {
        email: registerMethod === 'email' ? registerData.email : undefined,
        phone: registerMethod === 'phone' ? registerData.phone : undefined,
        password: registerData.password,
        family_name: registerData.familyName || undefined
      };
      
      console.log('Попытка регистрации:', { method: registerMethod, credential });
      
      const response = await fetch('https://functions.poehali.dev/b9b956c8-e2a6-4c20-aef8-b8422e8cb3b0?action=register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      console.log('Статус регистрации:', response.status);
      
      const data = await response.json();
      console.log('Данные регистрации:', data);
      
      if (data.error) {
        setError(data.error);
        console.error('Ошибка регистрации:', data.error);
      } else {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log('Успешная регистрация, переход к настройке');
        onAuthSuccess(data.token, data.user);
      }
    } catch (err) {
      console.error('Исключение при регистрации:', err);
      setError('Ошибка при регистрации: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      console.log('Попытка входа с данными:', { login: loginData.login });
      
      const response = await fetch('https://functions.poehali.dev/b9b956c8-e2a6-4c20-aef8-b8422e8cb3b0?action=login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      });
      
      console.log('Статус ответа:', response.status);
      
      const data = await response.json();
      console.log('Данные ответа:', data);
      
      if (data.error) {
        setError(data.error);
        console.error('Ошибка входа:', data.error);
      } else {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log('Успешный вход, токен сохранён');
        onAuthSuccess(data.token, data.user);
      }
    } catch (err) {
      console.error('Исключение при входе:', err);
      setError('Ошибка при входе: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <Card className="w-full max-w-md border-2 border-blue-200">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Icon name="Users" className="text-white" size={32} />
            </div>
          </div>
          <CardTitle className="text-3xl text-center">Семейный Органайзер</CardTitle>
          <CardDescription className="text-center">
            Войдите или зарегистрируйтесь для доступа к функциям
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Вход</TabsTrigger>
              <TabsTrigger value="register">Регистрация</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login">Email или телефон</Label>
                  <Input
                    id="login"
                    placeholder="example@mail.com или +79991234567"
                    value={loginData.login}
                    onChange={(e) => setLoginData({ ...loginData, login: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Пароль</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Минимум 6 символов"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                </div>
                
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Icon name="Loader" className="mr-2 animate-spin" size={16} />
                      Вход...
                    </>
                  ) : (
                    <>
                      <Icon name="LogIn" className="mr-2" size={16} />
                      Войти
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="flex gap-2 mb-4">
                  <Button
                    type="button"
                    variant={registerMethod === 'email' ? 'default' : 'outline'}
                    onClick={() => setRegisterMethod('email')}
                    className="flex-1"
                  >
                    Email
                  </Button>
                  <Button
                    type="button"
                    variant={registerMethod === 'phone' ? 'default' : 'outline'}
                    onClick={() => setRegisterMethod('phone')}
                    className="flex-1"
                  >
                    Телефон
                  </Button>
                </div>
                
                {registerMethod === 'email' ? (
                  <div className="space-y-2">
                    <Label htmlFor="reg-email">Email</Label>
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="example@mail.com"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      required
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="reg-phone">Телефон</Label>
                    <Input
                      id="reg-phone"
                      type="tel"
                      placeholder="+79991234567"
                      value={registerData.phone}
                      onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                      required
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="reg-family">Название семьи (необязательно)</Label>
                  <Input
                    id="reg-family"
                    type="text"
                    placeholder="Семья Ивановых"
                    value={registerData.familyName}
                    onChange={(e) => setRegisterData({ ...registerData, familyName: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Пароль</Label>
                  <Input
                    id="reg-password"
                    type="password"
                    placeholder="Минимум 6 символов"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reg-confirm">Подтвердите пароль</Label>
                  <Input
                    id="reg-confirm"
                    type="password"
                    placeholder="Повторите пароль"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
                
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Icon name="Loader" className="mr-2 animate-spin" size={16} />
                      Регистрация...
                    </>
                  ) : (
                    <>
                      <Icon name="UserPlus" className="mr-2" size={16} />
                      Зарегистрироваться
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Регистрируясь, вы соглашаетесь с условиями использования</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}