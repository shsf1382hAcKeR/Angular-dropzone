import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'demo';
  fileInputConfig: any = {
    maxFiles: '5',
    allowedFileTypes: ['pdf'],
    // allowedFileTypes: 'noRule',
    maxSize: '5',
  };
}
