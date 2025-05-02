
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from './ui/tabs';
import { Eye, EyeOff, LogIn, UserPlus, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { LoginForm } from './auth/LoginForm';
import { RegisterForm } from './auth/RegisterForm';

export const AuthenticationForm: React.FC = () => {
  const { isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          {activeTab === 'login' ? 'Вход в систему' : 'Регистрация'}
        </CardTitle>
        <CardDescription className="text-center">
          {activeTab === 'login' 
            ? 'Введите свои учетные данные для входа в систему'
            : 'Создайте новую учетную запись для доступа к системе'
          }
        </CardDescription>
      </CardHeader>
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'register')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Вход</TabsTrigger>
          <TabsTrigger value="register">Регистрация</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <LoginForm />
        </TabsContent>
        
        <TabsContent value="register">
          <RegisterForm />
        </TabsContent>
      </Tabs>
      
      <div className="px-6 pb-4 text-center">
        <p className="text-sm text-slate-500">
          {activeTab === 'login' 
            ? 'У вас ещё нет аккаунта? '
            : 'Уже есть аккаунт? '
          }
          <Button 
            variant="link" 
            className="p-0 h-auto text-blue-500"
            onClick={() => setActiveTab(activeTab === 'login' ? 'register' : 'login')}
            disabled={isLoading}
          >
            {activeTab === 'login' ? 'Зарегистрироваться' : 'Войти'}
          </Button>
        </p>
      </div>
    </Card>
  );
};
