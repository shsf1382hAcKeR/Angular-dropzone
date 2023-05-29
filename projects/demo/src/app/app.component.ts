import { Component } from '@angular/core';
import { FileProcessingConfig } from 'file-input';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'demo';
  myFileInputConfig: FileProcessingConfig = {
    maxFiles: 5,
    allowedFileTypes: ['pdf', 'docx', 'xlsx'],
    // allowedFileTypes: 'noRule',
    maxSize: 2,
    // defaultImage: 'https://cdn-icons-png.flaticon.com/512/6583/6583130.png',
  };
}
