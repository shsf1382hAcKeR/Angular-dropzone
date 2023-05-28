import { Injectable } from '@angular/core';

export interface UploadedFile {
  imageUrl: string;
  size: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class FileProcessingService {
  constructor() {}

  async processFiles(files: FileList, config: any): Promise<UploadedFile[]> {
    const maxFiles =
      config.maxFiles === 'noRule' ? Infinity : config.maxFiles || 10;
    const allowedFileTypes =
      config.allowedFileTypes === null
        ? ['jpg', 'jpeg', 'png'] // Default file types
        : config.allowedFileTypes === 'noRule'
        ? [] // Empty array to allow all file types
        : config.allowedFileTypes || [];
    const maxSize =
      config.maxSize === 'noRule' ? Infinity : config.maxSize || '2'; // Default max size: 2MB

    if (files.length > maxFiles) {
      throw new Error(`Only ${maxFiles} files can be uploaded.`);
    }

    const defaultFileTypes = ['jpg', 'jpeg', 'png']; // Default file types
    const processedFiles: UploadedFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const file: File = files[i];
      const fileType = this.getFileExtension(file.name);

      if (
        allowedFileTypes.length > 0 &&
        !allowedFileTypes.includes(fileType.toLowerCase())
      ) {
        if (
          config.allowedFileTypes === null &&
          !defaultFileTypes.includes(fileType.toLowerCase())
        ) {
          throw new Error(
            `Skipped the file "${file.name}": Invalid file type.`
          );
        } else {
          throw new Error(
            `Skipped the file "${file.name}": Invalid file type.`
          );
        }
      }

      if (file.size > +maxSize * 1024 * 1024) {
        throw new Error(
          `Skipped the file "${file.name}": File size exceeds the maximum limit of ${maxSize}MB.`
        );
      }

      const uploadedFile = await this.previewFile(file, config.defaultImage);
      processedFiles.push(uploadedFile);
    }

    return processedFiles;
  }

  getFileExtension(filename: string): string {
    const extensionIndex = filename.lastIndexOf('.');
    if (extensionIndex !== -1) {
      return filename.slice(extensionIndex + 1);
    }
    return '';
  }

  getFileType(file: File): 'image' | 'non-image' {
    const fileType = this.getFileExtension(file.name).toLowerCase();
    return fileType === 'png' || fileType === 'jpg' || fileType === 'jpeg'
      ? 'image'
      : 'non-image';
  }

  previewFile(file: File, defaultImage: string): Promise<UploadedFile> {
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
          imageUrl: fileType === 'image' ? imageUrl : defaultImage,
          size,
          name: file.name,
        };
        resolve(uploadedFile);
      };
      reader.onerror = (event) => {
        reject(new Error('Error occurred while reading the file.'));
      };
      reader.readAsDataURL(file);
    });
  }
}
