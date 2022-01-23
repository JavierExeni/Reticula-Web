import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Tareas,
  TIPO_TAREA,
  TareasResponse,
} from '../../../shared/models/tareas';
import { TareaService } from '../../services/tarea.service';
import { AuthService } from '../../../auth/auth.service';
import Swal from 'sweetalert2';
import { Cliente } from '../../../shared/models/clientes';
import { ClientesService } from '../../services/clientes.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ESTADOS } from '../../../shared/models/tareas';
import * as moment from 'moment';
import { NotificationService } from '../../services/notification.service';
import { fireNotification } from '../../../shared/models/notification';

@Component({
  selector: 'app-tarea',
  templateUrl: './tarea.component.html',
})
export class TareaComponent implements OnInit {
  page = 1;
  pageSize = 10;

  clientesSugerencias: Cliente[] = [];

  palabra: string = '';
  cliente!: Cliente;

  tareaSelected!: TareasResponse;

  formularioTareas: FormGroup = this.formBuilder.group({
    nombre: ['', Validators.required],
    tipo: ['', Validators.required],
    fecha_limite: [''],
    descripcion: ['', Validators.required],
  });

  tareas: TareasResponse[] = [];
  auxtareas: TareasResponse[] = [];

  get clientes() {
    return this.clienteService.clientes;
  }

  constructor(
    private formBuilder: FormBuilder,
    private tareaService: TareaService,
    private authService: AuthService,
    private clienteService: ClientesService,
    private notification: NotificationService,
    public modal: NgbModal
  ) {}

  tutorial!: fireNotification;

  ngOnInit(): void {
    this.getTareas();
    this.getClientes();
  }

  saveTarea(action = 0, flag = false) {
    const { nombre, tipo, fecha_limite, descripcion } =
      this.formularioTareas.value;

    let estado = 0;

    var tarea!: Tareas;

    if (this.tareaSelected) {
      estado = this.obtenerEstado(action);
      tarea = {
        id: this.tareaSelected.id,
        cliente: { lpersona_id: this.cliente.lpersona_id! },
        nombre,
        tipo,
        fecha_limite: this.tareaSelected.fecha_limite,
        descripcion,
        usuario: { codigo_id: this.authService.usuario.codigo_id! },
        estado,
        carpeta: null,
      };
    } else {
      tarea = {
        cliente: { lpersona_id: this.cliente.lpersona_id! },
        nombre,
        tipo,
        fecha_limite,
        descripcion,
        usuario: { codigo_id: this.authService.usuario.codigo_id! },
        estado,
        carpeta: null,
      };
    }
    this.tareaService.insert(tarea).subscribe(
      (res) => {
        this.formularioTareas.reset();

        if (action == 0) {
          this.registrarNotifiaction(
            flag
              ? 'Actualizó una Tarea'
              : `Se registró la tarea '${tarea.nombre}' para el cliente: '${tarea.cliente.nombre}' `,
            flag ? 0 : 1
          );
          if (tarea.estado == 0) {
            this.registrarNotifiaction(
              `NUEVA ASISTENCIA - se registró una asistencia para el cliente: ${tarea.cliente.nombre} `,
              0
            );
          }
          if (tarea.estado == 1) {
            this.registrarNotifiaction(
              `NUEVA ASISTENCIA - se registró un mantenimiento para el ${tarea.fecha_limite} para el cliente: '${tarea.cliente.nombre}' `,
              0
            );
          }

          Swal.fire({
            icon: 'success',
            title: flag ? 'Tarea Actualizada' : 'Tarea Registrada',
            showConfirmButton: false,
            timer: 2000,
          });
        } else {
          this.registrarNotifiaction(
            `Paso de Estado ${tarea.nombre} tarea.`,
            0
          );
          Swal.fire({
            icon: 'success',
            title: `Estado paso a ${ESTADOS[tarea.estado]}`,
            showConfirmButton: false,
            timer: 2000,
          });
        }
        this.getTareas();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  obtenerEstado(action: number): number {
    let state = this.tareaSelected.estado;

    if (action == 0) {
      return state;
    }

    if (action == -1) {
      if (this.tareaSelected.estado == -1) {
        console.log('No hay un estado menor');
        state = -1;
        return state;
      }
      state = state - 1;
      return state;
    } else {
      if (this.tareaSelected.estado == 3) {
        console.log('No puedes subir más estados');
        return 3;
      }
      state = state + 1;
      return state;
    }
  }

  sugerencias(termino: string) {
    this.clientesSugerencias = [];
    if (termino === '') {
      return;
    }
    this.clientes.filter((res: any) => {
      if (res.nombre.toLowerCase().includes(termino.toLowerCase().trim())) {
        this.clientesSugerencias.push(res);
      }
    });
  }

  getTareas() {
    this.tareaService.list().subscribe((res: any) => {
      this.tareas = res;
      this.auxtareas = res;
    });
  }

  getClientes() {
    this.clienteService.list().subscribe();
  }

  verTipo(): boolean {
    return this.formularioTareas.get('tipo')?.value == 1 ? true : false;
  }

  saveClient(cliente: Cliente) {
    this.palabra = cliente.nombre;
    this.cliente = cliente;
    this.clientesSugerencias = [];
  }

  obtenerTipo(tipo: number) {
    return TIPO_TAREA[Number(tipo)];
  }

  openModal(contenido: any, tarea: TareasResponse) {
    let { nombre, tipo, fecha_limite, descripcion } = tarea;
    this.tareaSelected = tarea;
    this.palabra = tarea.cliente.nombre!;
    this.cliente = tarea.cliente;

    let fecha_limite_fr = moment(fecha_limite).format('YYYY-MM-DD');

    this.formularioTareas.get('nombre')?.setValue(nombre);
    this.formularioTareas.get('tipo')?.setValue(tipo);
    this.formularioTareas.get('fecha_limite')?.setValue(fecha_limite_fr);
    this.formularioTareas.get('descripcion')?.setValue(descripcion);
    this.modal.open(contenido, { centered: true, backdrop: 'static' });
  }

  openModalUpload(upload: any, tarea: TareasResponse) {
    this.tareaSelected = tarea;
    this.modal.open(upload, { centered: true, backdrop: 'static' });
  }

  elminar(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir este paso!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.tareaService.delete(id).subscribe((res) => {
          Swal.fire('Deleted!', 'La Tarea ha sido eliminada.', 'success');
          this.getTareas();
        });
      }
    });
  }

  close(modal: any) {
    this.formularioTareas.reset();
    modal.dismiss();
  }

  search(event: any) {
    let termino = event.target.value;

    if (termino === '') {
      this.tareas = this.auxtareas;
      return;
    }
    this.tareas = [];
    this.auxtareas.filter((res: any) => {
      if (res.nombre.toLowerCase().includes(termino.toLowerCase().trim())) {
        this.tareas.push(res);
      }
    });
  }

  filter(tipo: number) {
    this.tareas = [];
    switch (tipo) {
      case -1:
        this.tareas = this.auxtareas;
        break;
      case 0:
        this.tareas = this.auxtareas.filter((res) => res.tipo == 0);
        break;
      case 1:
        this.tareas = this.auxtareas.filter((res) => res.tipo == 1);
        break;
      case 2:
        this.tareas = this.auxtareas.filter((res) => res.tipo == 2);
        break;
    }
  }

  registrarNotifiaction(name: string, type: number) {
    let body: fireNotification = {
      eventname: name,
      eventtype: type,
      user: this.authService.usuario,
    };
    this.notification.create(body).subscribe((res: any) => console.log);
  }
}
