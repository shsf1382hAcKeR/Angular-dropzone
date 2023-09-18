import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AngularDropzoneModule } from '@shsf1382/angular-dropzone';
// import { AngularDropzoneModule } from '../../../angular-dropzone/src/lib/angular-dropzone.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AngularDropzoneModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
