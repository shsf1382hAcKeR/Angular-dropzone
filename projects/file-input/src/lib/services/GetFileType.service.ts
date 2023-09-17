import { Injectable } from '@angular/core';
import { GetFileExtensionService } from './GetFileExtension.service';

@Injectable({
  providedIn: 'root',
})
export class GetFileTypeService {
  constructor(private getFileExtensionService: GetFileExtensionService) {}
  // Identify Image and Non-image File Formats
  getFileType(file: File): 'image' | 'non-image' {
    const fileType = this.getFileExtension(file.name).toLowerCase();
    return fileType === 'png' || fileType === 'jpg' || fileType === 'jpeg'
      ? 'image'
      : 'non-image';
  }
  getFileExtension(filename: string): string {
    return this.getFileExtensionService.getFileExtension(filename);
  }
}
