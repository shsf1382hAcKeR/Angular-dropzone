import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GetFileExtensionService {
  // Retrieve File Extensions
  getFileExtension(filename: string): string {
    const extensionIndex = filename.lastIndexOf('.');
    if (extensionIndex !== -1) {
      return filename.slice(extensionIndex + 1);
    }
    return '';
  }
}
