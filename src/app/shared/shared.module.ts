import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { UploadFileComponent } from './components/upload-file/upload-file.component';
import { FiltersComponent } from './components/filters/filters.component';
import { ValidationlistComponent } from './components/validationlist/validationlist.component';
import { HeaderComponent } from './components/header/header.component';
import { AutocompleteComponent } from './components/autocomplete/autocomplete.component';
@NgModule({
  declarations: [
    HeaderComponent,
    ValidationlistComponent,
    AutocompleteComponent,
    UploadFileComponent,
    FiltersComponent,
  ],
  imports: [CommonModule, RouterModule, FormsModule, NgbModule],
  exports: [
    HeaderComponent,
    ValidationlistComponent,
    AutocompleteComponent,
    UploadFileComponent,
  ],
})
export class SharedModule {}
