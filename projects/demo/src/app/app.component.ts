import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'demo';
  fileInputConfig: any = {
    maxFiles: '10',
    // allowedFileTypes: ['pdf', 'jpg', 'png', 'jpeg'],
    // allowedFileTypes: 'noRule',
    maxSize: '2',
    // defaultImage: 'https://cdn-icons-png.flaticon.com/512/6583/6583130.png',
  };
}
