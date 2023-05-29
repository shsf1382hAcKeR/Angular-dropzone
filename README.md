# Angular DropZone

### Installation

_Install the package using NPM._
```sh
   npm i @shsf1382/file-input
   ```
   
_Import the Module_
```sh 
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FileInputModule } from 'file-input'; // Import the module
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, FileInputModule], // Import the module
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

_Add the Component_
<br>
Note: You can add the `[config]` as an attribute binding to configure its behavior through the `myFileInputConfig` object.You can name the object as you wish.
```sh 
<app-file-input [config]="myFileInputConfig"></app-file-input>
```

_Configure the options in your `app.component.ts`_
```sh 
import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'demo';
  fileInputConfig: any = {
    maxFiles: '10', // Max files to be uploaded
    allowedFileTypes: ['pdf', 'jpg', 'png', 'jpeg'], // Allowed file types
    maxSize: '10', // Max size for upload
    defaultImage: 'https://cdn-icons-png.flaticon.com/512/6583/6583130.png', // Image to be dispalyed for non-image file types
  };
}
```

Document Coming Soon...
