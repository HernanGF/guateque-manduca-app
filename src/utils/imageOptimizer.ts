/**
 * Client-side image optimization helper.
 * Converts any uploaded image (JPEG, PNG, AVIF, WebP, etc.) to a normalized,
 * high-compatibility JPEG data URI resized to a maximum dimension.
 */
export async function optimizeImageFile(
  file: File,
  maxDimension = 1000,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Error al leer el archivo de imagen'));
    reader.onload = (loadEvt) => {
      const rawDataUrl = loadEvt.target?.result as string;
      if (!rawDataUrl) {
        return reject(new Error('No se pudo obtener el contenido de la imagen'));
      }

      const img = new Image();
      img.onerror = () => {
        // Fallback to raw data URL if canvas cannot decode (e.g. unsupported format)
        resolve(rawDataUrl);
      };
      img.onload = () => {
        try {
          let { width, height } = img;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            resolve(rawDataUrl);
            return;
          }

          // Fill white background for transparent PNGs
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          const optimizedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(optimizedDataUrl);
        } catch {
          resolve(rawDataUrl);
        }
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  });
}
