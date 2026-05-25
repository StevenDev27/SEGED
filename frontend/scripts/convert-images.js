const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const publicDir = path.join(__dirname, '..', 'public');
const images = [
  { src: 'logoGrande.jpeg', dest: 'logoGrande.webp' },
  { src: 'logoPequeño.jpeg', dest: 'logoPequeño.webp' }
];

(async () => {
  try {
    for (const img of images) {
      const srcPath = path.join(publicDir, img.src);
      const destPath = path.join(publicDir, img.dest);
      if (!fs.existsSync(srcPath)) {
        console.warn(`Imagen fuente no encontrada: ${srcPath}`);
        continue;
      }
      await sharp(srcPath)
        .webp({ quality: 80 })
        .toFile(destPath);
      console.log(`Convertido: ${img.src} -> ${img.dest}`);
    }
    console.log('Conversión completada.');
  } catch (err) {
    console.error('Error al convertir imágenes:', err);
    process.exit(1);
  }
})();
