import { Component } from '@angular/core';
import { FileProcessingConfig } from '@shsf1382/angular-dropzone';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'demo';
  myFileInputConfig: FileProcessingConfig = {
    maxFiles: 5,
    // allowedFileTypes: ['pdf', 'docx', 'xlsx'],
    allowedFileTypes: 'noRule',
    maxSize: 2,
    defaultImage: 'https://example-url.com/example.png',
  };
}
