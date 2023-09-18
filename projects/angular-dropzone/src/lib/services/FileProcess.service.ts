import { Injectable } from '@angular/core';
import { UploadedFile } from '../models/UploadedFile';
import { FileProcessingConfig } from '../models/FileProcessingConfig';
import { defaultConfig } from '../utils/DefaultConfig';
import { FilePreviewService } from './FilePreview.service';
import { GetFileExtensionService } from './GetFileExtension.service';

export { UploadedFile, FileProcessingConfig, defaultConfig };

@Injectable({
  providedIn: 'root',
})
export class FileProcessService {
  private uploadedFileNames: string[] = [];
  private uploadedFiles: UploadedFile[] = [];
  private highlightTimeouts: NodeJS.Timeout[] = [];

  constructor(
    private filePreviewService: FilePreviewService,
    private getFileExtensionService: GetFileExtensionService
  ) {}

  getFileExtension(filename: string): string {
    return this.getFileExtensionService.getFileExtension(filename);
  }

  async processFiles(
    files: FileList,
    config: FileProcessingConfig = {}
  ): Promise<UploadedFile[]> {
    const mergedConfig: FileProcessingConfig = { ...defaultConfig, ...config };

    if (!mergedConfig.display) {
      mergedConfig.display = 'grid';
    }

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
    const deletedFileNames: string[] = [];

    // Reset isHighlighted property for all uploaded files except the deleted ones
    this.uploadedFiles.forEach((uploadedFile) => {
      if (!deletedFileNames.includes(uploadedFile.name)) {
        uploadedFile.isHighlighted = false;
      }
    });

    // Clear previous highlight timeouts
    this.highlightTimeouts.forEach((timeout) => clearTimeout(timeout));
    this.highlightTimeouts = [];

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

      const uploadedFileIndex = this.uploadedFileNames.findIndex(
        (name) => name === file.name
      );

      if (uploadedFileIndex !== -1) {
        const uploadedFile = this.uploadedFiles[uploadedFileIndex];

        if (!deletedFileNames.includes(file.name)) {
          uploadedFile.isHighlighted = true; // Set isHighlighted to true for already uploaded files

          // Set a timeout to reset the isHighlighted property after 3 seconds (adjust as needed)
          const timeoutId = setTimeout(() => {
            uploadedFile.isHighlighted = false;

            const timeoutIndex = this.highlightTimeouts.indexOf(timeoutId);
            if (timeoutIndex !== -1) {
              this.highlightTimeouts.splice(timeoutIndex, 1);
            }
          }, 1500);

          this.highlightTimeouts.push(timeoutId);
        } else {
          continue; // Skip the file if it was uploaded and deleted previously
        }
      } else {
        const uploadedFile = await this.previewFile(
          file,
          mergedConfig.defaultImage
        );
        processedFiles.push(uploadedFile); // Add new file to processedFiles
        this.uploadedFileNames.push(file.name);
        this.uploadedFiles.push(uploadedFile);
      }
    }

    return processedFiles;
  }

  previewFile(file: File, defaultImage?: string): Promise<UploadedFile> {
    return this.filePreviewService.previewFile(file, defaultImage);
  }

  removeUploadedFileName(filename: string) {
    const index = this.uploadedFileNames.indexOf(filename);
    if (index !== -1) {
      this.uploadedFileNames.splice(index, 1);
      this.uploadedFiles.splice(index, 1);
    }
  }
}
