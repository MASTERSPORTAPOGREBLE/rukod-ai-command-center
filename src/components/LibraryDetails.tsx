import React from 'react';
import { Library } from '../models/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Button } from './ui/button';
import { Download, ExternalLink, Info } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

export interface LibraryDetailsProps {
  library: Library;
  onInstall: () => Promise<void>;
  onClose?: () => void;  // Make onClose optional
}

export const LibraryDetails: React.FC<LibraryDetailsProps> = ({ library, onInstall, onClose }) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{library.name}</CardTitle>
        <CardDescription>{library.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="h-[calc(100vh-350px)]">
          <div className="space-y-2">
            <p className="text-sm font-medium">Автор: {library.author}</p>
            <p className="text-sm">Язык: {library.language}</p>
            <p className="text-sm">Версия: {library.version}</p>
            <p className="text-sm">Лицензия: {library.license}</p>
            {library.size && <p className="text-sm">Размер: {library.size}</p>}
            <p className="text-sm">
              Стабильная версия:{' '}
              {library.isStable ? 'Да' : 'Нет'}
            </p>
            <p className="text-sm">
              Последнее обновление: {library.lastUpdated}
            </p>
            <p className="text-sm">
              Загрузок: {library.downloadCount}
            </p>
            {library.documentation && (
              <Button variant="link" asChild>
                <a href={library.documentation} target="_blank" rel="noopener noreferrer" className="text-sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Документация
                </a>
              </Button>
            )}
            {library.repository && (
              <Button variant="link" asChild>
                <a href={library.repository} target="_blank" rel="noopener noreferrer" className="text-sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Репозиторий
                </a>
              </Button>
            )}
            {library.dependencies && library.dependencies.length > 0 && (
              <div className="space-y-1">
                <p className="text-sm font-medium">Зависимости:</p>
                <ul className="list-disc pl-5">
                  {library.dependencies.map((dep, index) => (
                    <li key={index} className="text-sm">{dep}</li>
                  ))}
                </ul>
              </div>
            )}
            {library.tags && library.tags.length > 0 && (
              <div className="space-y-1">
                <p className="text-sm font-medium">Тэги:</p>
                <div className="flex flex-wrap gap-2">
                  {library.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-700 rounded-full text-xs">{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="justify-between">
        <Button onClick={onInstall}>
          <Download className="h-4 w-4 mr-2" />
          Установить
        </Button>
        <Button variant="outline">
          <Info className="h-4 w-4 mr-2" />
          Подробнее
        </Button>
      </CardFooter>
    </Card>
  );
};
