/**
 * Image compressor utility to prevent browser localStorage quota exceeded errors.
 * Compresses uploaded images to a lightweight data URL (typically 40KB - 150KB).
 */

export interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeKB?: number;
  mimeType?: 'image/jpeg' | 'image/webp';
}

export const compressImageFile = (
  file: File,
  options: CompressOptions = {}
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const {
      maxWidth = 1000,
      maxHeight = 1000,
      quality = 0.78,
      maxSizeKB = 250,
      mimeType = 'image/jpeg',
    } = options;

    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error('Gagal membaca file gambar dari perangkat.'));
    };

    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) {
        reject(new Error('Data gambar kosong.'));
        return;
      }

      const img = new Image();
      img.onerror = () => {
        // Fallback: resolve original dataUrl if decoding fails
        resolve(dataUrl);
      };

      img.onload = () => {
        try {
          let { width, height } = img;

          // Calculate scaled dimensions maintaining aspect ratio
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          const canvas = document.createElement('canvas');
          canvas.width = Math.max(width, 1);
          canvas.height = Math.max(height, 1);

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(dataUrl);
            return;
          }

          // Use high quality image smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // Initial compression
          let currentQuality = quality;
          let compressedResult = canvas.toDataURL(mimeType, currentQuality);

          // Check size in KB (approx: base64 length * 3/4 / 1024)
          let currentSizeKB = Math.round((compressedResult.length * 3) / 4 / 1024);

          // If still over maxSizeKB, iteratively scale down quality & dimension
          let attempts = 0;
          while (currentSizeKB > maxSizeKB && attempts < 4 && currentQuality > 0.4) {
            currentQuality -= 0.15;
            compressedResult = canvas.toDataURL(mimeType, currentQuality);
            currentSizeKB = Math.round((compressedResult.length * 3) / 4 / 1024);
            attempts++;
          }

          // If still too big, scale canvas dimension down by 50%
          if (currentSizeKB > maxSizeKB) {
            const halfCanvas = document.createElement('canvas');
            halfCanvas.width = Math.max(Math.round(canvas.width * 0.7), 1);
            halfCanvas.height = Math.max(Math.round(canvas.height * 0.7), 1);
            const halfCtx = halfCanvas.getContext('2d');
            if (halfCtx) {
              halfCtx.imageSmoothingEnabled = true;
              halfCtx.imageSmoothingQuality = 'high';
              halfCtx.drawImage(canvas, 0, 0, halfCanvas.width, halfCanvas.height);
              compressedResult = halfCanvas.toDataURL(mimeType, 0.65);
            }
          }

          resolve(compressedResult);
        } catch (err) {
          console.error('Error during canvas compression:', err);
          // Fallback to dataUrl
          resolve(dataUrl);
        }
      };

      img.src = dataUrl;
    };

    reader.readAsDataURL(file);
  });
};
