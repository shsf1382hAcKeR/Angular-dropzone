import {
  Component,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  FileProcessService,
  UploadedFile,
  FileProcessingConfig,
} from '../services/FileProcess.service';

@Component({
  selector: 'angular-dropzone',
  templateUrl: './angular-dropzone.component.html',
  styleUrls: ['./angular-dropzone.component.css'],
})
export class AngularDropzoneComponent {
  @Input() config: FileProcessingConfig = {};
  @Output() onChangeFiles: EventEmitter<UploadedFile[]> = new EventEmitter<
    UploadedFile[]
  >();
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  fileInputVisible = false;
  uploadedFiles: UploadedFile[] = [];
  hasError = false;
  errorMessage = '';

  constructor(private fileProcessService: FileProcessService) {}

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
      const processedFiles = await this.fileProcessService.processFiles(
        files,
        this.config
      );
      this.uploadedFiles = [...this.uploadedFiles, ...processedFiles];
      this.hideError();
      this.onChangeFiles.emit(processedFiles);
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
      this.fileProcessService.removeUploadedFileName(file.name);

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
