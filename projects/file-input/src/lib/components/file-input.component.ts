import { Component, ViewChild, ElementRef, Input } from '@angular/core';
import {
  FileProcessingService,
  UploadedFile,
  FileProcessingConfig,
} from '../services/file-input.service';

@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.css'],
})
export class FileInputComponent {
  @Input() config: FileProcessingConfig = {};
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  fileInputVisible = false;
  uploadedFiles: UploadedFile[] = [];
  hasError = false;
  errorMessage = '';

  constructor(private fileProcessingService: FileProcessingService) {}

  showError(message: string) {
    this.hasError = true;
    this.errorMessage = message;
  }

  hideError() {
    this.hasError = false;
    this.errorMessage = '';
  }

  async processFiles(files: FileList) {
    try {
      const processedFiles = await this.fileProcessingService.processFiles(
        files,
        this.config
      );
      this.uploadedFiles = [...this.uploadedFiles, ...processedFiles];
      this.hideError(); // Hide error message after successful upload
    } catch (error: any) {
      this.showError(error.message);
    }
  }

  getFileTypeText(allowedFileTypes: string[] | undefined): string {
    if (allowedFileTypes && allowedFileTypes.length > 0) {
      return allowedFileTypes.join(', ').toUpperCase();
    } else {
      return 'JPG, JPEG, PNG';
    }
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    this.processFiles(files);
  }

  openFileInput() {
    this.fileInputVisible = true;
    setTimeout(() => {
      this.fileInput.nativeElement.click();
    }, 0);
  }

  deleteFile(file: UploadedFile) {
    const index = this.uploadedFiles.indexOf(file);
    if (index !== -1) {
      this.uploadedFiles.splice(index, 1);
      this.fileProcessingService.removeUploadedFileName(file.name);

      // Hide error message if no uploaded files remaining
      if (this.uploadedFiles.length === 0) {
        this.hideError();
      }
    }
  }

  onDragOver(event: any) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragEnter(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.fileInputVisible = true;
  }

  onDragLeave(event: any) {
    event.preventDefault();
    event.stopPropagation();
    const rect = event.target.getBoundingClientRect();

    if (
      event.clientX < rect.left ||
      event.clientX >= rect.right ||
      event.clientY < rect.top ||
      event.clientY >= rect.bottom
    ) {
      this.fileInputVisible = false;
    }
  }

  onDrop(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.fileInputVisible = false;

    const files: FileList = event.dataTransfer.files;
    this.processFiles(files);
  }
}
