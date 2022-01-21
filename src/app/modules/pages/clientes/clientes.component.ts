import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cliente } from '../../../shared/models/clientes';
import { ClientesService } from '../../services/clientes.service';
import { AuthService } from '../../../auth/auth.service';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from '../../services/notification.service';
import { fireNotification } from '../../../shared/models/notification';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styles: [],
})
export class ClientesComponent implements OnInit {
  page = 1;
  pageSize = 10;

  formularioClientes: FormGroup = this.formBuilder.group({
    nombre: ['', Validators.required],
  });

  selectedCliente!: Cliente;

  clientes: Cliente[] = [];
  auxclientes: Cliente[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private clienteService: ClientesService,
    private authService: AuthService,
    public modal: NgbModal,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.getClientes();
  }

  saveCliente() {
    const { nombre } = this.formularioClientes.value;
    const cliente: Cliente = {
      nombre,
      usuario: { codigo_id: this.authService.usuario.codigo_id! },
    };

    this.clienteService.insert(cliente).subscribe((res: any) => {
      console.log(res);
      if (res.res === 'success') {
        this.formularioClientes.reset();
        this.registrarNotifiaction('Registró un nuevo Cliente', 1);
        Swal.fire({
          icon: 'success',
          title: 'Cliente Registrado',
          showConfirmButton: false,
          timer: 2000,
        });
        this.getClientes();
      }
    });
  }

  registrarNotifiaction(name: string, type: number) {
    let body: fireNotification = {
      eventname: name,
      eventtype: type,
      user: this.authService.usuario,
    };
    this.notification.create(body).subscribe((res: any) => console.log);
  }

  getClientes() {
    this.clienteService.list().subscribe((res: any) => {
      this.clientes = res;
      this.auxclientes = res;
    });
  }

  openModal(contenido: any, cliente: Cliente) {
    this.selectedCliente = cliente;
    this.modal.open(contenido, { centered: true, size: 'lg' });
  }

  search(event: any) {
    let termino = event.target.value;

    if (termino === '') {
      this.clientes = this.auxclientes;
      return;
    }
    this.clientes = [];
    this.auxclientes.filter((res: any) => {
      if (res.nombre.toLowerCase().includes(termino.toLowerCase().trim())) {
        this.clientes.push(res);
      }
    });
  }
}
