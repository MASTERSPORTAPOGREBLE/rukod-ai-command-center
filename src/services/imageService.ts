import { SecureStorage, getEnvApiKey } from '../utils/security';

export interface ImageGenerationOptions {
  size: '256x256' | '512x512' | '1024x1024';
  style: 'realistic' | 'cartoon' | 'pixel-art' | 'concept-art' | 'texture';
  format: 'png' | 'jpg' | 'webp';
  quality: 'draft' | 'standard' | 'high';
}

export interface PhotoEditOptions {
  operation: 'remove-background' | 'layer-blend' | 'resize' | 'crop';
  blendMode?: 'normal' | 'multiply' | 'overlay' | 'screen';
  opacity?: number;
  dimensions?: { width: number; height: number };
}

export class ImageService {
  
  // Бесплатные альтернативы для генерации изображений
  static async generateImage(prompt: string, options: Partial<ImageGenerationOptions> = {}): Promise<string> {
    const huggingFaceKey = getEnvApiKey('huggingface') || SecureStorage.getApiKey('huggingface');
    
    if (huggingFaceKey) {
      return await this.generateWithHuggingFace(prompt, options, huggingFaceKey);
    }
    
    // Если нет API ключей, используем бесплатную альтернативу
    return await this.generateWithFallback(prompt, options);
  }

  // Генерация через Hugging Face (бесплатно с ограничениями)
  private static async generateWithHuggingFace(
    prompt: string, 
    options: Partial<ImageGenerationOptions>,
    apiKey: string
  ): Promise<string> {
    const enhancedPrompt = this.enhancePromptForGameAssets(prompt, options.style);
    
    const response = await fetch(
      'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: enhancedPrompt,
          parameters: {
            negative_prompt: 'blurry, low quality, distorted, watermark',
            num_inference_steps: 20,
            guidance_scale: 7.5,
            width: parseInt(options.size?.split('x')[0] || '512'),
            height: parseInt(options.size?.split('x')[1] || '512')
          },
          options: {
            wait_for_model: true,
            use_cache: false
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Ошибка генерации изображения: ${response.statusText}`);
    }

    const blob = await response.blob();
    return this.blobToDataURL(blob);
  }

  // Бесплатная альтернатива без API ключей
  private static async generateWithFallback(
    prompt: string,
    options: Partial<ImageGenerationOptions>
  ): Promise<string> {
    // Используем Pollinations.ai (полностью бесплатно, без ключей)
    const size = options.size || '512x512';
    const [width, height] = size.split('x').map(Number);
    
    const enhancedPrompt = this.enhancePromptForGameAssets(prompt, options.style);
    const encodedPrompt = encodeURIComponent(enhancedPrompt);
    
    const imageUrl = `https://pollinations.ai/p/${encodedPrompt}?width=${width}&height=${height}&nologo=true&enhance=true`;
    
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error('Ошибка генерации изображения');
      }
      
      const blob = await response.blob();
      return this.blobToDataURL(blob);
    } catch (error) {
      console.error('Ошибка генерации изображения:', error);
      // Возвращаем placeholder изображение
      return this.generatePlaceholder(width, height, prompt);
    }
  }

  // Удаление фона (Background Eraser)
  static async removeBackground(imageDataUrl: string): Promise<string> {
    const removeBgKey = getEnvApiKey('remove_bg') || SecureStorage.getApiKey('remove_bg');
    
    if (removeBgKey) {
      return await this.removeBackgroundWithAPI(imageDataUrl, removeBgKey);
    }
    
    // Бесплатная альтернатива с помощью Canvas API
    return await this.removeBackgroundLocal(imageDataUrl);
  }

  // Удаление фона через Remove.bg API
  private static async removeBackgroundWithAPI(imageDataUrl: string, apiKey: string): Promise<string> {
    const blob = await this.dataURLToBlob(imageDataUrl);
    const formData = new FormData();
    formData.append('image_file', blob);
    formData.append('size', 'auto');

    try {
      const response = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: {
          'X-Api-Key': apiKey
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Ошибка удаления фона: ${response.statusText}`);
      }

      const resultBlob = await response.blob();
      return this.blobToDataURL(resultBlob);
    } catch (error) {
      console.error('Ошибка удаления фона:', error);
      // Fallback к локальному методу
      return await this.removeBackgroundLocal(imageDataUrl);
    }
  }

  // Локальное удаление фона (простой алгоритм)
  private static async removeBackgroundLocal(imageDataUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Не удалось создать canvas context'));
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Простой алгоритм удаления фона по цвету углов
        const cornerColors = [
          [data[0], data[1], data[2]], // Верхний левый
          [data[(canvas.width - 1) * 4], data[(canvas.width - 1) * 4 + 1], data[(canvas.width - 1) * 4 + 2]], // Верхний правый
        ];
        
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          // Проверяем схожесть с цветами углов
          for (const cornerColor of cornerColors) {
            const colorDiff = Math.abs(r - cornerColor[0]) + Math.abs(g - cornerColor[1]) + Math.abs(b - cornerColor[2]);
            if (colorDiff < 50) { // Порог схожести
              data[i + 3] = 0; // Делаем пиксель прозрачным
              break;
            }
          }
        }
        
        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = reject;
      img.src = imageDataUrl;
    });
  }

  // Наложение слоев (PhotoLayers)
  static async blendImages(
    baseImage: string,
    overlayImage: string,
    options: PhotoEditOptions
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Не удалось создать canvas context'));
        return;
      }

      const baseImg = new Image();
      const overlayImg = new Image();
      let loadedImages = 0;

      const onImageLoad = () => {
        loadedImages++;
        if (loadedImages === 2) {
          canvas.width = baseImg.width;
          canvas.height = baseImg.height;
          
          // Рисуем базовое изображение
          ctx.drawImage(baseImg, 0, 0);
          
          // Устанавливаем режим наложения
          ctx.globalCompositeOperation = options.blendMode || 'normal';
          ctx.globalAlpha = options.opacity || 1;
          
          // Рисуем накладываемое изображение
          ctx.drawImage(overlayImg, 0, 0, canvas.width, canvas.height);
          
          resolve(canvas.toDataURL('image/png'));
        }
      };

      baseImg.onload = onImageLoad;
      overlayImg.onload = onImageLoad;
      
      baseImg.onerror = reject;
      overlayImg.onerror = reject;
      
      baseImg.src = baseImage;
      overlayImg.src = overlayImage;
    });
  }

  // Изменение размера изображения
  static async resizeImage(
    imageDataUrl: string,
    newWidth: number,
    newHeight: number,
    maintainAspectRatio = true
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Не удалось создать canvas context'));
          return;
        }

        let targetWidth = newWidth;
        let targetHeight = newHeight;

        if (maintainAspectRatio) {
          const aspectRatio = img.width / img.height;
          if (newWidth / newHeight > aspectRatio) {
            targetWidth = newHeight * aspectRatio;
          } else {
            targetHeight = newWidth / aspectRatio;
          }
        }

        canvas.width = targetWidth;
        canvas.height = targetHeight;
        
        // Включаем сглаживание для лучшего качества
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = reject;
      img.src = imageDataUrl;
    });
  }

  // Генерация текстур для игр
  static async generateGameTexture(
    type: 'stone' | 'wood' | 'metal' | 'fabric' | 'ground' | 'water',
    size: '256x256' | '512x512' | '1024x1024' = '512x512'
  ): Promise<string> {
    const texturePrompts = {
      stone: 'seamless stone texture, realistic rock surface, high detail, tileable',
      wood: 'seamless wood texture, natural wood grain, realistic timber surface, tileable',
      metal: 'seamless metal texture, brushed steel surface, industrial material, tileable',
      fabric: 'seamless fabric texture, cotton material, soft textile surface, tileable',
      ground: 'seamless ground texture, dirt and grass, natural terrain, tileable',
      water: 'seamless water texture, ocean surface, wave patterns, tileable'
    };

    const prompt = texturePrompts[type];
    
    return await this.generateImage(prompt, {
      size,
      style: 'texture',
      quality: 'high'
    });
  }

  // Вспомогательные методы
  private static enhancePromptForGameAssets(prompt: string, style?: string): string {
    let enhancedPrompt = prompt;
    
    // Добавляем стиль
    switch (style) {
      case 'pixel-art':
        enhancedPrompt += ', pixel art style, 8-bit, retro gaming';
        break;
      case 'cartoon':
        enhancedPrompt += ', cartoon style, colorful, stylized';
        break;
      case 'concept-art':
        enhancedPrompt += ', concept art style, digital painting, professional';
        break;
      case 'texture':
        enhancedPrompt += ', seamless texture, tileable, high resolution, material';
        break;
      default:
        enhancedPrompt += ', high quality, detailed, professional';
    }

    // Добавляем общие модификаторы качества
    enhancedPrompt += ', clean, sharp, no watermark, game asset';
    
    return enhancedPrompt;
  }

  private static async blobToDataURL(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  private static async dataURLToBlob(dataURL: string): Promise<Blob> {
    const response = await fetch(dataURL);
    return response.blob();
  }

  // Генерация placeholder изображения
  private static generatePlaceholder(width: number, height: number, text: string): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas не поддерживается');

    canvas.width = width;
    canvas.height = height;

    // Градиентный фон
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Текст
    ctx.fillStyle = 'white';
    ctx.font = `${Math.min(width, height) / 10}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const lines = text.split(' ');
    const lineHeight = Math.min(width, height) / 8;
    const startY = height / 2 - (lines.length - 1) * lineHeight / 2;
    
    lines.forEach((line, index) => {
      ctx.fillText(line, width / 2, startY + index * lineHeight);
    });

    return canvas.toDataURL('image/png');
  }

  // Автоматическая оптимизация изображений для веба
  static async optimizeForWeb(imageDataUrl: string, quality = 0.8): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Не удалось создать canvas context'));
          return;
        }

        // Оптимальный размер для веба
        const maxSize = 1200;
        let { width, height } = img;
        
        if (width > maxSize || height > maxSize) {
          const scale = Math.min(maxSize / width, maxSize / height);
          width *= scale;
          height *= scale;
        }

        canvas.width = width;
        canvas.height = height;
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Возвращаем в JPEG с заданным качеством для лучшего сжатия
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = imageDataUrl;
    });
  }
}