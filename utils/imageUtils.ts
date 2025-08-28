
/**
 * Parses an aspect ratio string (e.g., "16:9") into a numeric value.
 */
const parseAspectRatio = (ratioStr: string): number => {
  const [width, height] = ratioStr.split(':').map(Number);
  if (!height || !width) {
    return 1; // Default to 1:1 if parsing fails
  }
  return width / height;
};

/**
 * Takes an image as a base64 string, pads it with transparency to fit a target
 * aspect ratio, and returns the new image as a base64 string.
 * @param base64Src The source image in base64 format.
 * @param mimeType The MIME type of the source image.
 * @param targetRatioStr The target aspect ratio as a string (e.g., "16:9").
 * @returns A promise that resolves to the new base64 string and its mime type.
 */
export const padImageToAspectRatio = (
  base64Src: string,
  mimeType: string,
  targetRatioStr: string
): Promise<{ base64: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const targetRatio = parseAspectRatio(targetRatioStr);
      const originalWidth = img.width;
      const originalHeight = img.height;

      let canvasWidth = originalWidth;
      let canvasHeight = originalHeight;

      const currentRatio = originalWidth / originalHeight;

      if (currentRatio < targetRatio) {
        // Image is taller than target, so we need to add width
        canvasWidth = originalHeight * targetRatio;
      } else if (currentRatio > targetRatio) {
        // Image is wider than target, so we need to add height
        canvasHeight = originalWidth / targetRatio;
      }

      const canvas = document.createElement('canvas');
      canvas.width = Math.round(canvasWidth);
      canvas.height = Math.round(canvasHeight);
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('Could not get canvas context'));
      }

      // The background will be transparent by default
      
      // Calculate position to center the image
      const x = (canvasWidth - originalWidth) / 2;
      const y = (canvasHeight - originalHeight) / 2;

      ctx.drawImage(img, x, y, originalWidth, originalHeight);

      // We always export as PNG to preserve transparency
      const newMimeType = 'image/png';
      const newBase64 = canvas.toDataURL(newMimeType).split(',')[1];
      
      resolve({ base64: newBase64, mimeType: newMimeType });
    };
    img.onerror = (err) => {
      reject(err);
    };
    img.src = `data:${mimeType};base64,${base64Src}`;
  });
};
