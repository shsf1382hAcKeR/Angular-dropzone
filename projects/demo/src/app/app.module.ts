import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FileInputModule } from 'file-input';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, FileInputModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
