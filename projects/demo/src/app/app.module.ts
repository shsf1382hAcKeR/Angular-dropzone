import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularDropzoneModule } from 'file-input';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AngularDropzoneModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
