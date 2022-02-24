import { Component, Input, OnInit } from '@angular/core';
import { TareaService } from '../../services/tarea.service';
import { TIPO_TAREA, Tareas } from '../../../shared/models/tareas';
import { Cliente } from '../../../shared/models/clientes';
import { TallerService } from '../../services/taller.service';
import { TrabajoTallerResponse } from '../../../shared/models/trabajotaller';
import { CarpetaService } from '../../services/carpeta.service';
import { Documento } from '../../../shared/models/documento';

@Component({
  selector: 'app-modal-cliente',
  templateUrl: './modal-cliente.component.html',
  styleUrls: ['./modal-cliente.component.scss'],
})
export class ModalClienteComponent implements OnInit {
  @Input() cliente!: Cliente;

  page = 1;
  pageSize = 10;

  mantenimientos: Tareas[] = [];
  tareas: Tareas[] = [];
  equipos: TrabajoTallerResponse[] = [];

  documentos: Documento[] = [];

  constructor(
    private tareaService: TareaService,
    private tallerService: TallerService,
    private carpetaService: CarpetaService
  ) {}

  ngOnInit(): void {
    this.getMantenimiento();
    this.getEquipos();
    this.getTareas();
    this.getDocuemntos();
  }

  obtenerTipo(tipo: string) {
    return TIPO_TAREA[Number(tipo)];
  }

  getMantenimiento() {
    this.tareaService
      .listByClienteMantenimiento(this.cliente.lpersona_id!)
      .subscribe(
        (res: any) => {
          console.log(res);
          this.mantenimientos = res;
        },
        (err) => {
          console.log(err);
        }
      );
  }

  getTareas() {
    this.tareaService
      .listByClienteTareasAsistencias(this.cliente.lpersona_id!)
      .subscribe(
        (res: any) => {
          console.log(res);
          this.tareas = res;
        },
        (err) => {
          console.log(err);
        }
      );
  }

  getEquipos() {
    this.tallerService.listByCliente(this.cliente.lpersona_id!).subscribe(
      (res: any) => {
        this.equipos = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getDocuemntos() {
    this.carpetaService.documentoByCliente(this.cliente.lpersona_id!).subscribe(
      (res: any) => {
        this.documentos = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getColorState(estado: number): string {
    let color = 'red';
    switch (estado) {
      case 0:
        color = '#1dae6d;';
        break;
      case 1:
        color = '#1fb5e8;';
        break;
      case 2:
        color = '#0080bd;';
        break;
      case 3:
        color = '#888888;';
        break;
      case -1:
        color = '#ff5639;';
        break;
    }

    return `background-color:  ${color}`;
  }
}
