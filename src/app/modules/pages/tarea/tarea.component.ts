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

@Component({
  selector: 'app-tarea',
  templateUrl: './tarea.component.html',
})
export class TareaComponent implements OnInit {
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

  get tareas() {
    return this.tareaService.tareas;
  }

  get clientes() {
    return this.clienteService.clientes;
  }

  constructor(
    private formBuilder: FormBuilder,
    private tareaService: TareaService,
    private authService: AuthService,
    private clienteService: ClientesService,
    public modal: NgbModal
  ) {}

  ngOnInit(): void {
    this.getTareas();
    this.getClientes();
  }

  saveTarea(action = 0, flag = false) {
    const { nombre, tipo, fecha_limite, descripcion } =
      this.formularioTareas.value;

    let estado = 0;

    console.log(estado);

    var tarea!: Tareas;

    if (this.tareaSelected) {
      estado = this.obtenerEstado(action);
      tarea = {
        id: this.tareaSelected.id,
        cliente: { id: this.cliente.id! },
        nombre,
        tipo,
        fecha_limite,
        descripcion,
        usuario: { id: this.authService.usuario.id! },
        estado,
        carpeta: null,
      };
    } else {
      tarea = {
        cliente: { id: this.cliente.id! },
        nombre,
        tipo,
        fecha_limite,
        descripcion,
        usuario: { id: this.authService.usuario.id! },
        estado,
        carpeta: null,
      };
    }

    this.tareaService.insert(tarea).subscribe(
      (res) => {
        console.log(res);
        this.formularioTareas.reset();

        if (action == 0) {
          Swal.fire({
            icon: 'success',
            title: flag ? 'Tarea Actualizada' : 'Tarea Registrada',
            showConfirmButton: false,
            timer: 2000,
          });
        } else {
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
    console.log('estado: ', state);

    if (action == 0) {
      return state;
    }

    if (action == -1) {
      console.log('Derecha');

      if (this.tareaSelected.estado == -1) {
        console.log('No hay un estado menor');
        state = -1;
        return state;
      }
      state = state - 1;
      return state;
    } else {
      console.log('Izquierda');
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
      console.log(res);
      console.log(termino);

      if (res.nombre.toLowerCase().includes(termino.toLowerCase().trim())) {
        this.clientesSugerencias.push(res);
      }
    });
  }

  getTareas() {
    this.tareaService.list().subscribe();
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

  obtenerTipo(tipo: string) {
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
}
