
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Настройки</CardTitle>
            <CardDescription>Персонализируйте РУКОД AI Command Center под себя</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <Tabs defaultValue="general" className="flex-1 overflow-hidden">
          <div className="p-4 border-b">
            <TabsList>
              <TabsTrigger value="general">Общие</TabsTrigger>
              <TabsTrigger value="appearance">Внешний вид</TabsTrigger>
              <TabsTrigger value="ai">ИИ</TabsTrigger>
              <TabsTrigger value="modules">Модули</TabsTrigger>
              <TabsTrigger value="account">Аккаунт</TabsTrigger>
            </TabsList>
          </div>
          
          <div className="overflow-y-auto flex-1 p-6">
            <TabsContent value="general" className="mt-0 space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autorun">Автозапуск команд</Label>
                    <p className="text-sm text-muted-foreground">
                      Автоматически выполнять команды после ввода
                    </p>
                  </div>
                  <Switch id="autorun" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="logging">Логирование</Label>
                    <p className="text-sm text-muted-foreground">
                      Сохранять историю команд и ошибок
                    </p>
                  </div>
                  <Switch id="logging" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-updates">Автоматические обновления</Label>
                    <p className="text-sm text-muted-foreground">
                      Автоматически проверять и устанавливать обновления
                    </p>
                  </div>
                  <Switch id="auto-updates" defaultChecked />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="appearance" className="mt-0">
              <p className="text-muted-foreground">Настройки внешнего вида будут доступны в следующих версиях</p>
            </TabsContent>
            
            <TabsContent value="ai" className="mt-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="ai-enabled">ИИ включен</Label>
                    <p className="text-sm text-muted-foreground">
                      Использовать возможности искусственного интеллекта
                    </p>
                  </div>
                  <Switch id="ai-enabled" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="offline-mode">Офлайн режим</Label>
                    <p className="text-sm text-muted-foreground">
                      Использовать локальную модель ИИ без подключения к интернету
                    </p>
                  </div>
                  <Switch id="offline-mode" />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="modules" className="mt-0">
              <p className="text-muted-foreground">Модули будут доступны в следующих версиях</p>
            </TabsContent>
            
            <TabsContent value="account" className="mt-0">
              <p className="text-muted-foreground">Настройки аккаунта будут доступны после авторизации</p>
            </TabsContent>
          </div>
        </Tabs>
        
        <CardFooter className="border-t flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Версия: 0.1.0</p>
          <Button onClick={onClose}>Готово</Button>
        </CardFooter>
      </Card>
    </div>
  );
};
