# Angular DropZone

_Note: Previous versions of this package were published within a different [NPM registry](https://www.npmjs.com/package/@shsf1382/file-input). The current version is the most up-to-date and actively maintained._

## _Version 1.4.4_

Click [here](/projects/angular-dropzone/.changeset/CHANGELOG.md) to see the Changelog.

## Getting Started

### Installation

Install the package using NPM.

```bash
npm i @shsf1382/angular-dropzone
```

## Usage / Examples

### Adding the module

Import the Module in your `app.module.ts` file:

```javascript
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AngularDropzoneModule } from "@shsf1382/angular-dropzone";
// Import the module

import { AppComponent } from "./app.component";

@NgModule({
  declarations: [AppComponent],

  imports: [BrowserModule, AngularDropzoneModule],
  // Import the module in "imports" as well

  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

### Adding the component

Add the Component in your `app.component.html` file:

```html
<angular-dropzone [config]="myFileInputConfig"><angular-dropzone></angular-dropzone></angular-dropzone>
```

_Note: You can add the attribute binding of `[config]` to configure the component's behavior through the `myFileInputConfig` object. You can name this object as you wish._

### Configuring the options of the component

Configure the options in your `app.component.ts`:

```javascript
import { Component } from "@angular/core";
import { FileProcessingConfig } from "@shsf1382/angular-dropzone";
// Import the config interface

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  myFileInputConfig: FileProcessingConfig = {
    maxFiles: 5,
    // Max files to be uploaded | Set to '10' by default

    allowedFileTypes: ["pdf", "docx", "xlsx"],
    // Allowed file types | Set to ['jpg', 'jpeg', 'png'] by default

    maxSize: 2,
    // Max size for upload in MB | Set to '2' by default

    defaultImage: "https://example-url.com/example.png",
    // Image to be dispalyed for non-image file types | Set to a default image

    display: "inline",
    // Controls file display method in the dropzone | Set to 'grid' by default
  };
}
```

_Note: You can set the value of `maxFiles`, `allowedFileTypes` & `maxSize` to `'noRule'`. This will remove the default rulesets of the component._
