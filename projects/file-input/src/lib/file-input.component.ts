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
  fileInputVisible = false;
  uploadedFiles: UploadedFile[] = [];
  hasError = false;
  errorMessage = '';

  constructor(private fileProcessingService: FileProcessingService) {}

  // Helper method for error handling
  showError(message: string) {
    this.hasError = true;
    this.errorMessage = message;
  }

  // Public method
  async processFiles(files: FileList) {
    try {
      const processedFiles = await this.fileProcessingService.processFiles(
        files,
        this.config
      );
      this.uploadedFiles = [...this.uploadedFiles, ...processedFiles];
      this.hasError = false; // Clear the error flag
      this.errorMessage = ''; // Clear the error message
    } catch (error: any) {
      this.showError(error.message);
    }
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
