import { Injectable } from '@angular/core';

export interface UploadedFile {
  imageUrl: string;
  size: string;
  name: string;
}

export interface FileProcessingConfig {
  maxFiles?: number | 'noRule';
  allowedFileTypes?: string[] | 'noRule';
  maxSize?: number | 'noRule';
  defaultImage?: string | undefined;
}

const defaultConfig: FileProcessingConfig = {
  maxFiles: 10,
  allowedFileTypes: undefined,
  maxSize: 2,
  defaultImage: undefined,
};

@Injectable({
  providedIn: 'root',
})
export class FileProcessingService {
  private uploadedFileNames: string[] = [];

  constructor() {}

  async processFiles(
    files: FileList,
    config: FileProcessingConfig = {}
  ): Promise<UploadedFile[]> {
    const mergedConfig: FileProcessingConfig = { ...defaultConfig, ...config };

    const maxFiles =
      mergedConfig.maxFiles === 'noRule'
        ? Infinity
        : mergedConfig.maxFiles || 10;
    const allowedFileTypes =
      mergedConfig.allowedFileTypes === 'noRule'
        ? []
        : mergedConfig.allowedFileTypes || ['jpg', 'jpeg', 'png'];
    const maxSize =
      mergedConfig.maxSize === 'noRule' ? Infinity : mergedConfig.maxSize || 2; // Default max size: 2MB

    if (files.length > maxFiles) {
      throw new Error(`Only ${maxFiles} files can be uploaded.`);
    }

    if (this.uploadedFileNames.length + files.length > maxFiles) {
      throw new Error(
        `Total number of files exceeds the maximum limit of ${maxFiles}.`
      );
    }

    const processedFiles: UploadedFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const file: File = files[i];
      const fileType = this.getFileExtension(file.name);

      if (
        allowedFileTypes.length > 0 &&
        !allowedFileTypes.includes(fileType.toLowerCase())
      ) {
        throw new Error(`Skipped the file "${file.name}": Invalid file type.`);
      }

      if (file.size > maxSize * 1024 * 1024) {
        throw new Error(
          `Skipped the file "${file.name}": File size exceeds the maximum limit of ${maxSize}MB.`
        );
      }

      if (this.isUploadedFile(file.name)) {
        throw new Error(`The file "${file.name}" is already uploaded.`);
      }

      const uploadedFile = await this.previewFile(
        file,
        mergedConfig.defaultImage
      );
      processedFiles.push(uploadedFile);
      this.uploadedFileNames.push(file.name);
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

  removeUploadedFileName(filename: string) {
    const index = this.uploadedFileNames.indexOf(filename);
    if (index !== -1) {
      this.uploadedFileNames.splice(index, 1);
    }
  }

  private isUploadedFile(filename: string): boolean {
    return this.uploadedFileNames.includes(filename);
  }
}
