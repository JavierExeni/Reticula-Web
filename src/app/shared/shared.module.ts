import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { RouterModule } from '@angular/router';
import { ValidationlistComponent } from './components/validationlist/validationlist.component';
import { AutocompleteComponent } from './components/autocomplete/autocomplete.component';
import { FormsModule } from '@angular/forms';
import { UploadFileComponent } from './components/upload-file/upload-file.component';

@NgModule({
  declarations: [
    HeaderComponent,
    ValidationlistComponent,
    AutocompleteComponent,
    UploadFileComponent,
  ],
  imports: [CommonModule, RouterModule, FormsModule],
  exports: [
    HeaderComponent,
    ValidationlistComponent,
    AutocompleteComponent,
    UploadFileComponent,
  ],
})
export class SharedModule {}
