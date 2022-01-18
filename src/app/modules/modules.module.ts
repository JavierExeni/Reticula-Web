import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModulesRoutingModule } from './modules-routing.module';
import { PrincipalComponent } from './principal.component';
import { SharedModule } from '../shared/shared.module';
import { TareaComponent } from './pages/tarea/tarea.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TesseractComponent } from './pages/tesseract/tesseract.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { CarpetasComponent } from './pages/carpetas/carpetas.component';
import { ModalClienteComponent } from './modals/modal-cliente/modal-cliente.component';

@NgModule({
  declarations: [
    PrincipalComponent,
    TareaComponent,
    TesseractComponent,
    ClientesComponent,
    UsuariosComponent,
    CarpetasComponent,
    ModalClienteComponent,
  ],
  imports: [
    CommonModule,
    ModulesRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    NgbModule,
  ],
})
export class ModulesModule {}
