import { NgModule } from '@angular/core';
import { AngularDropzoneComponent } from './components/angular-dropzone.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [AngularDropzoneComponent],
  imports: [CommonModule],
  exports: [AngularDropzoneComponent],
})
export class AngularDropzoneModule {}
