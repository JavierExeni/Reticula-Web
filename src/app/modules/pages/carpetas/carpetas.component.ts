import { Component, OnInit } from '@angular/core';
import { Carpeta } from '../../../shared/models/carpeta';
import { ClientesService } from '../../services/clientes.service';
import { Cliente } from '../../../shared/models/clientes';
import { CarpetaService } from '../../services/carpeta.service';
import Swal from 'sweetalert2';
import { TareasResponse } from '../../../shared/models/tareas';
import { TareaService } from '../../services/tarea.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Documento } from '../../../shared/models/documento';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../../auth/auth.service';
import { fireNotification } from '../../../shared/models/notification';

@Component({
  selector: 'app-carpetas',
  templateUrl: './carpetas.component.html',
})
export class CarpetasComponent implements OnInit {
  clientesSugerencias: Cliente[] = [];
  tareasSugerencias: TareasResponse[] = [];

  palabra: string = '';
  cliente!: Cliente;

  palabra_tarea: string = '';
  tarea!: TareasResponse;

  documentos: Documento[] = [];

  get clientes() {
    return this.clienteService.clientes;
  }

  get carpetas() {
    return this.carpetaService.carpetas;
  }

  tareas: TareasResponse[] = [];

  fileToUpload!: File;

  carpeta_id: number = 0;

  constructor(
    private clienteService: ClientesService,
    private carpetaService: CarpetaService,
    private tareaService: TareaService,
    public modal: NgbModal,
    private authService: AuthService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.getClientes();
    this.getCarpetas();
    this.getTareas();
  }

  getDocuemntos(id: number) {
    this.carpetaService.documentoByCliente(id).subscribe(
      (res: any) => {
        this.documentos = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  saveCarpeta() {
    const carpeta: Carpeta = {
      nombre: this.palabra,
      cliente: {
        id: this.cliente.id!,
      },
    };

    this.carpetaService.insert(carpeta).subscribe(
      (res) => {
        this.palabra = '';
        this.clientesSugerencias = [];
        this.registrarNotifiaction('Registró un nueva Carpeta', 1);
        Swal.fire({
          icon: 'success',
          title: 'Cliente Registrado',
          showConfirmButton: false,
          timer: 2000,
        });
        this.getCarpetas();
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

  saveClient(cliente: Cliente) {
    this.palabra = cliente.nombre;
    this.cliente = cliente;
  }

  saveTarea(tarea: TareasResponse) {
    this.palabra_tarea = tarea.nombre;
    this.tarea = tarea;
    this.tareasSugerencias = [];
  }

  handleFileInput(files: any) {
    this.fileToUpload = files.files.item(0)!;
    console.log(this.fileToUpload);
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

  sugerencias_tarea(termino: string) {
    this.tareasSugerencias = [];
    if (termino === '') {
      return;
    }
    this.tareas.filter((res: any) => {
      if (res.nombre.toLowerCase().includes(termino.toLowerCase().trim())) {
        console.log(res);
        this.tareasSugerencias.push(res);
      }
    });
  }

  getTareas() {
    this.tareaService.list().subscribe(
      (res: any) => {
        console.log(res);
        this.tareas = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getClientes() {
    this.clienteService.list().subscribe();
  }

  getCarpetas() {
    this.carpetaService.list().subscribe();
  }

  validar(): boolean {
    if (this.fileToUpload && this.tarea) {
      return false;
    }
    return true;
  }

  validarClienteCarpeta() {
    this.carpetaService.validarCarpeta(this.tarea.cliente.id!).subscribe(
      (res: any) => {
        console.log(res);
        if (res.res == 'success') {
          this.carpeta_id = res.data.id;
          this.upload();
        } else {
          Swal.fire('Ups!', res.data, 'error');
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  upload() {
    this.carpetaService
      .subirDocumento(this.tarea.id!, this.carpeta_id, this.fileToUpload)
      .subscribe(
        (res: any) => {
          this.registrarNotifiaction('Subió un nuevo Documento', 1);
          Swal.fire('Cargado!', 'El Documento ha sido subido.', 'success');
          console.log(res);
        },
        (err) => {
          console.log(err);
          Swal.fire('Ups!', 'Hubo un error en la carga.', 'error');
        }
      );
  }

  openModal(upload: any, carpeta: Carpeta) {
    //this.tareaSelected = tarea;
    this.getDocuemntos(carpeta.id!);
    this.modal.open(upload, { centered: true, backdrop: 'static', size: 'xl' });
  }

  close(modal: any) {
    modal.dismiss();
  }
}
