import { Injectable } from '@angular/core';
import { UploadedFile } from '../models/UploadedFile';
import { GetFileTypeService } from './GetFileType.service';

@Injectable({
  providedIn: 'root',
})
export class FilePreviewService {
  constructor(private readonly getFileTypeService: GetFileTypeService) {}
  // Method for File Preview
  previewFile(file: File, defaultImage?: string): Promise<UploadedFile> {
    return new Promise<UploadedFile>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        const size =
          file.size > 1024 * 1024
            ? (file.size / 1024 / 1024).toFixed(2) + ' MB'
            : (file.size / 1024).toFixed(2) + ' KB';

        const fileType = this.getFileType(file);

        const uploadedFile: UploadedFile = {
          imageUrl:
            fileType === 'image'
              ? imageUrl
              : defaultImage
              ? defaultImage
              : 'https://i.pinimg.com/736x/04/54/7c/04547c2b354abb70a85ed8a2d1b33e5f.jpg',
          size,
          name: file.name,
        };
        resolve(uploadedFile);
      };
      reader.onerror = (event) => reject(event.target?.error);
      reader.readAsDataURL(file);
    });
  }
  getFileType(file: File) {
    return this.getFileTypeService.getFileType(file);
  }
}
