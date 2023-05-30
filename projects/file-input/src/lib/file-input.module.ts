import { NgModule } from '@angular/core';
import { FileInputComponent } from './components/file-input.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [FileInputComponent],
  imports: [CommonModule],
  exports: [FileInputComponent],
})
export class FileInputModule {}
