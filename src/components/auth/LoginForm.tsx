import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface LoginFormProps {
  loginData: {
    phone: string;
    password: string;
  };
  setLoginData: React.Dispatch<React.SetStateAction<{
    phone: string;
    password: string;
  }>>;
  error: string;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onForgotPassword: () => void;
}

export default function LoginForm({
  loginData,
  setLoginData,
  error,
  isLoading,
  onSubmit,
  onForgotPassword
}: LoginFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="phone">Телефон</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+79991234567"
          value={loginData.phone}
          onChange={(e) => setLoginData({ ...loginData, phone: e.target.value })}
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

      <Button 
        type="button" 
        variant="link" 
        className="w-full text-sm text-blue-600 hover:text-blue-700"
        onClick={onForgotPassword}
      >
        Забыли пароль?
      </Button>
    </form>
  );
}
