import { Component, ViewChild, ElementRef } from '@angular/core';

interface UploadedFile {
  imageUrl: string;
  size: string;
  name: string;
}

@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.css'],
})
export class FileInputComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  fileInputVisible: boolean = false;
  uploadedFiles: UploadedFile[] = [];
  hasError: boolean = false;
  errorMessage: string = '';

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
  processFiles(files: FileList) {
    if (files.length > 10) {
      this.showError('تنها 10 فایل می توانید آپلود کنید.');
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file: File = files[i];
      const fileType = file.type;

      if (!fileType.match(/image\/(jpeg|jpg|png)/)) {
        this.showError(`فایل "${file.name}" آپلود نشد: فرمت فایل معتبر نیست.`);
        continue;
      }

      if (file.size > 2 * 1024 * 1024) {
        this.showError(
          `فایل "${file.name}" آپلود نشد: حجم فایل بیشتر از دو مگابایت است.`
        );
        continue;
      }

      this.previewFile(file);
    }

    if (this.hasError) {
      return;
    }

    this.clearError();
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

  previewFile(file: File) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      const size =
        file.size > 1024 * 1024
          ? (file.size / 1024 / 1024).toFixed(2) + ' MB'
          : (file.size / 1024).toFixed(2) + ' KB';

      const uploadedFile: UploadedFile = {
        imageUrl,
        size,
        name: file.name,
      };
      this.clearError();
      this.uploadedFiles.push(uploadedFile);
    };

    reader.readAsDataURL(file);
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
