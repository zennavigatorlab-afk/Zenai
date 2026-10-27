import JSZip from 'jszip';
import { ANDROID_PROJECT_FILES } from '../android/projectFiles';

export async function exportAndroidStudioProjectZip(): Promise<Blob> {
  const zip = new JSZip();

  // Add all Android Studio Gradle and Kotlin files into the zip structure
  for (const file of ANDROID_PROJECT_FILES) {
    zip.file(file.path, file.content);
  }

  // Generate standard zip blob
  const content = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  return content;
}

export function triggerDownload(blob: Blob, filename = 'zen-ai-android-project.zip') {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
