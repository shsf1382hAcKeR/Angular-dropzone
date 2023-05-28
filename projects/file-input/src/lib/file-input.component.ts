import { Component, ViewChild, ElementRef, Input } from '@angular/core';
import { FileProcessingService, UploadedFile } from './file-input.service';

@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.css'],
})
export class FileInputComponent {
  @Input() config: any = {}; // Configuration object for options
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  fileInputVisible: boolean = false;
  uploadedFiles: UploadedFile[] = [];
  hasError: boolean = false;
  errorMessage: string = '';

  constructor(private fileProcessingService: FileProcessingService) {}

  // Helper methods for error handling
  showError(message: string) {
    this.hasError = true;
    this.errorMessage = message;
  }

  clearError() {
    this.hasError = false;
    this.errorMessage = '';
  }

  // Public methods
  async processFiles(files: FileList) {
    try {
      const processedFiles = await this.fileProcessingService.processFiles(
        files,
        this.config
      );
      this.uploadedFiles = [];
      this.clearError();

      this.uploadedFiles = processedFiles;
    } catch (error: any) {
      this.showError(error.message);
    }
  }

  getFileExtension(filename: string): string {
    const extensionIndex = filename.lastIndexOf('.');
    if (extensionIndex !== -1) {
      return filename.slice(extensionIndex + 1);
    }
    return '';
  }

  getFileTypeText(allowedFileTypes: string[]): string {
    if (allowedFileTypes && allowedFileTypes.length > 0) {
      return allowedFileTypes.join(', ').toUpperCase();
    } else {
      return 'JPG, JPEG, PNG'; // Default extensions
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
    }
    this.resetFileInput();
  }

  resetFileInput() {
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
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
    // Check if the mouse pointer is outside the element boundaries
    if (
      event.clientX < rect.left ||
      event.clientX >= rect.right ||
      event.clientY < rect.top ||
      event.clientY >= rect.bottom
    ) {
      this.fileInputVisible = false;
    }
  }

  // Event handler for the drop event
  onDrop(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.fileInputVisible = false;

    const files: FileList = event.dataTransfer.files;
    this.processFiles(files);
  }
}
