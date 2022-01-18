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

@Component({
  selector: 'app-tesseract',
  templateUrl: './tesseract.component.html',
  styles: [],
})
export class TesseractComponent implements OnInit {
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

  get trabajos() {
    return this.tallerService.trabajos;
  }

  constructor(
    private formBuilder: FormBuilder,
    private clienteService: ClientesService,
    private tallerService: TallerService,
    private authService: AuthService,
    public modal: NgbModal
  ) {}

  ngOnInit(): void {
    this.getClientes();
    this.getTrabajos();
  }

  saveTrabajoTaller(action = 0, flag = false) {
    const { referencia, equipo, tipo, problema, todo, costo } =
      this.formularioTaller.value;

    var taller!: TrabajoTaller;

    let estado = 0;

    if (this.tallerSelected) {
      estado = this.obtenerEstado(action);
      taller = {
        id: this.tallerSelected.id,
        referencia,
        equipo: this.tallerSelected.equipo,
        tipo: this.tallerSelected.tipo,
        problema: this.tallerSelected.problema,
        todo,
        costo,
        cliente: { id: this.cliente.id! },
        usuario: { id: this.authService.usuario.id! },
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
        cliente: { id: this.cliente.id! },
        usuario: { id: this.authService.usuario.id! },
        estado,
      };
    }

    console.log(taller);

    this.tallerService.insert(taller).subscribe(
      (res: any) => {
        console.log(res);
        this.formularioTaller.reset();
        if (action == 0) {
          Swal.fire({
            icon: 'success',
            title: flag ? 'Trabajo Actualizado' : 'Trabajo Registrado',
            showConfirmButton: false,
            timer: 2000,
          });
        } else {
          Swal.fire({
            icon: 'success',
            title: `Estado paso a ${ESTADOS[taller.estado]}`,
            showConfirmButton: false,
            timer: 2000,
          });
        }
        this.getTrabajos();
      },
      (err) => {
        console.log(err);
      }
    );
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
      console.log(res);
      console.log(termino);

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
    this.tallerService.list().subscribe();
  }

  getClientes() {
    this.clienteService.list().subscribe();
  }

  getColorState(estado: number): string {
    let color = 'red';
    switch (estado) {
      case 0:
        color = 'rgb(29, 14, 109);';
        break;
      case 1:
        color = 'rgb(31, 101, 232);';
        break;
      case 2:
        color = 'rgb(0, 128, 189);';
        break;
      case 3:
        color = 'gray;';
        break;
      case -1:
        color = 'rgb(255, 86, 57);';
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
}
