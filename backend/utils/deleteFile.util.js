import fs from 'fs';
import path from 'path';

export const deleteFile = (filePath) => {
  if (!filePath || filePath.includes('seed-assets')) return; // skip seed files

  const fullPath = filePath.startsWith('public')
    ? filePath
    : path.join('public', filePath);

  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
};
