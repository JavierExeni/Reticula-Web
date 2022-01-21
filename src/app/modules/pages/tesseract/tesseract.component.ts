import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  TrabajoTaller,
  TIPO_TALLER,
  TrabajoTallerResponse,
} from '../../../shared/models/trabajotaller';
import { Cliente } from '../../../shared/models/clientes';
import { ClientesService } from '../../services/clientes.service';
import { TallerService } from '../../services/taller.service';
import { AuthService } from '../../../auth/auth.service';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ESTADOS } from 'src/app/shared/models/tareas';
import { NotificationService } from '../../services/notification.service';
import { fireNotification } from '../../../shared/models/notification';

@Component({
  selector: 'app-tesseract',
  templateUrl: './tesseract.component.html',
  styles: [],
})
export class TesseractComponent implements OnInit {
  page = 1;
  pageSize = 10;
  clientesSugerencias: Cliente[] = [];

  palabra: string = '';
  cliente!: Cliente;

  tallerSelected!: TrabajoTallerResponse;

  formularioTaller: FormGroup = this.formBuilder.group({
    referencia: ['', Validators.required],
    equipo: ['', Validators.required],
    tipo: ['', Validators.required],
    problema: ['', Validators.required],
    todo: ['', Validators.required],
    costo: ['0'],
  });

  get clientes() {
    return this.clienteService.clientes;
  }

  trabajos: TrabajoTallerResponse[] = [];
  auxtrabajos: TrabajoTallerResponse[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private clienteService: ClientesService,
    private tallerService: TallerService,
    private authService: AuthService,
    public modal: NgbModal,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.getClientes();
    this.getTrabajos();
  }

  saveTrabajoTaller(action = 0, flag = false, modal: any) {
    const { referencia, equipo, tipo, problema, todo, costo } =
      this.formularioTaller.value;

    var taller!: TrabajoTaller;

    let estado = 0;

    if (this.tallerSelected) {
      estado = this.obtenerEstado(action);
      taller = {
        codigo_id: this.tallerSelected.codigo_id,
        referencia,
        equipo: this.tallerSelected.equipo,
        tipo: this.tallerSelected.tipo,
        problema: this.tallerSelected.problema,
        todo,
        costo,
        cliente: { lpersona_id: this.cliente.lpersona_id! },
        usuario: { codigo_id: this.authService.usuario.id! },
        estado: estado,
      };
    } else {
      taller = {
        referencia,
        equipo,
        tipo,
        problema,
        todo,
        costo,
        cliente: { lpersona_id: this.cliente.lpersona_id! },
        usuario: { codigo_id: this.authService.usuario.codigo_id! },
        estado,
      };
    }

    console.log(taller);

    this.tallerService.insert(taller).subscribe(
      (res: any) => {
        console.log(res);
        this.formularioTaller.reset();
        if (action == 0) {
          this.registrarNotifiaction(flag ? 'Actualizó un Trabajo' : `R.A.T.A ${taller.codigo_id}, Se ingresó el equipo ${taller.equipo}: ${taller.cliente.nombre}`, flag ? 0 : 1);
          Swal.fire({
            icon: 'success',
            title: flag ? 'Trabajo Actualizado' : 'Trabajo Registrado',
            showConfirmButton: false,
            timer: 2000,
          });
        } else {
          this.registrarNotifiaction(`R.A.T.A ${taller.codigo_id}, El equipo ${taller.equipo} del cliente ${taller.cliente.nombre} cambio de estado a ${ESTADOS[estado]}.` , 0);
          Swal.fire({
            icon: 'success',
            title: `Estado paso a ${ESTADOS[taller.estado]}`,
            showConfirmButton: false,
            timer: 2000,
          });
        }
        this.getTrabajos();
        this.close(modal);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  registrarNotifiaction(name: string, type: number) {
    let body: fireNotification = {
      eventname: name,
      eventtype: type,
      user: this.authService.usuario,
    };
    this.notification.create(body).subscribe((res: any) => console.log);
  }

  obtenerEstado(action: number): number {
    let state = this.tallerSelected.estado;
    console.log('estado: ', state);

    if (action == 0) {
      return state;
    }

    if (action == -1) {
      console.log('Derecha');

      if (this.tallerSelected.estado == -1) {
        console.log('No hay un estado menor');
        state = -1;
        return state;
      }
      state = state - 1;
      return state;
    } else {
      console.log('Izquierda');
      if (this.tallerSelected.estado == 3) {
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

  saveClient(cliente: Cliente) {
    this.palabra = cliente.nombre;
    this.cliente = cliente;
    this.clientesSugerencias = [];
  }

  getTrabajos() {
    this.tallerService.list().subscribe((res: any) => {
      console.log(res);

      this.trabajos = res;
      this.auxtrabajos = res;
    });
  }

  getClientes() {
    this.clienteService.list().subscribe();
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

  obtenerTipo(tipo: string) {
    return TIPO_TALLER[Number(tipo)];
  }

  openModal(contenido: any, taller: TrabajoTallerResponse) {
    let { referencia, tipo, equipo, problema, todo, costo } = taller;
    this.tallerSelected = taller;
    this.palabra = taller.cliente.nombre!;
    this.cliente = taller.cliente;
    this.formularioTaller.get('referencia')?.setValue(referencia);
    this.formularioTaller.get('equipo')?.setValue(equipo);
    this.formularioTaller.get('equipo')?.disable();
    this.formularioTaller.get('tipo')?.setValue(tipo);
    this.formularioTaller.get('tipo')?.disable();
    this.formularioTaller.get('problema')?.setValue(problema);
    this.formularioTaller.get('problema')?.disable();
    this.formularioTaller.get('todo')?.setValue(todo);
    this.formularioTaller.get('costo')?.setValue(costo);
    this.modal.open(contenido, { centered: true, backdrop: 'static' });
  }

  close(modal: any) {
    console.log('cerrado');
    this.formularioTaller.reset();
    this.formularioTaller.get('problema')?.enable();
    this.formularioTaller.get('tipo')?.enable();
    this.formularioTaller.get('equipo')?.enable();
    this.palabra = '';
    modal.dismiss();
  }

  search(event: any) {
    let termino = event.target.value;

    if (termino === '') {
      this.trabajos = this.auxtrabajos;
      return;
    }
    this.trabajos = [];
    this.auxtrabajos.filter((res: any) => {
      if (res.referencia.toLowerCase().includes(termino.toLowerCase().trim())) {
        this.trabajos.push(res);
      }
    });
  }

  filter(tipo: number) {
    this.trabajos = [];
    switch (tipo) {
      case -2:
        this.trabajos = this.auxtrabajos;
        break;
      case -1:
        this.trabajos = this.auxtrabajos.filter((res) => res.estado == -1);
        break;
      case 0:
        this.trabajos = this.auxtrabajos.filter((res) => res.estado == 0);
        break;
      case 1:
        this.trabajos = this.auxtrabajos.filter((res) => res.estado == 1);
        break;
      case 2:
        this.trabajos = this.auxtrabajos.filter((res) => res.estado == 2);
        break;
      case 3:
        this.trabajos = this.auxtrabajos.filter((res) => res.estado == 3);
        break;
    }
  }
}
