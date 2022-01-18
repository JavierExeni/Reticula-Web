import { Component, Input, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { TareasResponse } from '../../models/tareas';
import { CarpetaService } from '../../../modules/services/carpeta.service';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styles: [],
})
export class UploadFileComponent implements OnInit {
  @Input() tareas: TareasResponse[] = [];
  @Input() palabra_tarea: string = '';
  @Input() tarea!: TareasResponse;
  @Input() showBtn: boolean = true;
  @Input() modal: any;
  carpeta_id: number = 0;
  tareasSugerencias: TareasResponse[] = [];

  fileToUpload!: File;

  constructor(private carpetaService: CarpetaService) {}

  ngOnInit(): void {}

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

  saveTarea(tarea: TareasResponse) {
    this.palabra_tarea = tarea.nombre;
    this.tarea = tarea;
    this.tareasSugerencias = [];
  }

  handleFileInput(files: any) {
    this.fileToUpload = files.files.item(0)!;
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
          if (this.modal) {
            this.modal.close();
          }
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
          Swal.fire('Cargado!', 'El Documento ha sido subido.', 'success');
          console.log(res);
          if (this.modal) {
            this.modal.close();
          }
        },
        (err) => {
          console.log(err);
          Swal.fire('Ups!', 'Hubo un error en la carga.', 'error');
          if (this.modal) {
            this.modal.close();
          }
        }
      );
  }
}
