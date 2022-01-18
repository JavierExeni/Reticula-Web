import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TareaComponent } from './pages/tarea/tarea.component';
import { PrincipalComponent } from './principal.component';
import { TesseractComponent } from './pages/tesseract/tesseract.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { CarpetasComponent } from './pages/carpetas/carpetas.component';

const routes: Routes = [
  {
    path: '',
    component: PrincipalComponent,
    children: [
      {
        path: 'tareas',
        component: TareaComponent,
      },
      {
        path: 'taller',
        component: TesseractComponent,
      },
      {
        path: 'clientes',
        component: ClientesComponent,
      },
      {
        path: 'usuarios',
        component: UsuariosComponent,
      },
      {
        path: 'carpetas',
        component: CarpetasComponent,
      },
      { path: '**', redirectTo: 'tareas' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModulesRoutingModule {}
