
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
import { Eye, EyeOff, LogIn, UserPlus, Lock, Mail, User } from 'lucide-react';
import { toast } from 'sonner';

export const AuthenticationForm: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  
  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock login logic - in a real app, this would call an authentication API
    if (loginEmail && loginPassword) {
      toast.success('Вход выполнен успешно!');
    } else {
      toast.error('Пожалуйста, заполните все поля');
    }
  };
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!registerName || !registerEmail || !registerPassword) {
      toast.error('Пожалуйста, заполните все обязательные поля');
      return;
    }
    
    if (registerPassword !== registerConfirmPassword) {
      toast.error('Пароли не совпадают');
      return;
    }
    
    // Mock registration logic - in a real app, this would call an API
    toast.success('Регистрация прошла успешно!');
  };
  
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
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    placeholder="your.email@example.com"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="password">Пароль</Label>
                  <a href="#" className="text-xs text-blue-500 hover:underline">
                    Забыли пароль?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="pl-10"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button type="submit" className="w-full">
                <LogIn className="mr-2 h-4 w-4" />
                Войти
              </Button>
            </CardFooter>
          </form>
        </TabsContent>
        
        <TabsContent value="register">
          <form onSubmit={handleRegister}>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Имя</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="name"
                    placeholder="Ваше имя"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reg-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="reg-email"
                    placeholder="your.email@example.com"
                    type="email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reg-password">Пароль</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    className="pl-10"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Подтвердите пароль</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    value={registerConfirmPassword}
                    onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button type="submit" className="w-full">
                <UserPlus className="mr-2 h-4 w-4" />
                Зарегистрироваться
              </Button>
            </CardFooter>
          </form>
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
          >
            {activeTab === 'login' ? 'Зарегистрироваться' : 'Войти'}
          </Button>
        </p>
      </div>
    </Card>
  );
};
