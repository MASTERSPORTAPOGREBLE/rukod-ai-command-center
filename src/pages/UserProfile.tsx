
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User, Lock, Save, RefreshCw } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const UserProfile = () => {
  const { user, logout, updateProfile, isLoading } = useAuth();
  const { currentTheme } = useTheme();
  
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '');
  const [isEditing, setIsEditing] = useState(false);
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isEditing) {
      setIsEditing(true);
      return;
    }
    
    const success = await updateProfile({
      displayName,
      avatar: avatarUrl
    });
    
    if (success) {
      setIsEditing(false);
    }
  };
  
  if (!user) {
    return <div>Вы не авторизованы</div>;
  }
  
  return (
    <div className="max-w-4xl mx-auto p-4 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Профиль пользователя</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Информация</CardTitle>
              <CardDescription>Ваши личные данные</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Avatar className="w-32 h-32 mb-4">
                <AvatarImage src={user.avatar} alt={user.displayName} />
                <AvatarFallback className="text-2xl bg-rukod-purple text-white">
                  {user.displayName?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold">{user.displayName}</h2>
              <p className="text-muted-foreground">{user.email}</p>
              
              <div className="mt-3 px-3 py-1 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: currentTheme.primaryColor }}>
                {user.role === 'admin' ? 'Администратор' : 
                 user.role === 'developer' ? 'Разработчик' : 'Пользователь'}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="destructive" className="w-full" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Выйти
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Редактировать профиль</CardTitle>
              <CardDescription>Обновите свою персональную информацию</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Имя пользователя</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="displayName"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      disabled={!isEditing || isLoading}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      value={user.email}
                      disabled
                      className="pl-10 bg-slate-100 dark:bg-slate-800 text-slate-400"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Email нельзя изменить</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="avatarUrl">URL аватара</Label>
                  <Input
                    id="avatarUrl"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    disabled={!isEditing || isLoading}
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Загрузка...
                    </>
                  ) : isEditing ? (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Сохранить изменения
                    </>
                  ) : (
                    <>
                      <User className="mr-2 h-4 w-4" />
                      Редактировать профиль
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Активность</CardTitle>
                <CardDescription>История ваших действий</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: "Вход в систему", time: "Сегодня, 10:23", icon: "🟢" },
                    { action: "Запуск проекта", time: "Вчера, 15:45", icon: "🚀" },
                    { action: "Установка библиотеки numpy", time: "2 дня назад", icon: "📦" },
                  ].map((activity, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && <Separator />}
                      <div className="flex justify-between items-center py-2">
                        <div className="flex items-center">
                          <span className="mr-2">{activity.icon}</span>
                          <span>{activity.action}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{activity.time}</span>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
