import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cliente } from '../../../shared/models/clientes';
import { ClientesService } from '../../services/clientes.service';
import { AuthService } from '../../../auth/auth.service';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styles: [],
})
export class ClientesComponent implements OnInit {
  formularioClientes: FormGroup = this.formBuilder.group({
    nombre: ['', Validators.required],
  });

  get clientes() {
    return this.clienteService.clientes;
  }

  selectedCliente!: Cliente;

  constructor(
    private formBuilder: FormBuilder,
    private clienteService: ClientesService,
    private authService: AuthService,
    public modal: NgbModal
  ) {}

  ngOnInit(): void {
    console.log(this.authService.usuario);

    if (this.clientes.length === 0) this.getClientes();
  }

  saveCliente() {
    const { nombre } = this.formularioClientes.value;
    const cliente: Cliente = {
      nombre,
      usuario: { id: this.authService.usuario.id! },
    };

    this.clienteService.insert(cliente).subscribe((res: any) => {
      console.log(res);
      if (res.res === 'success') {
        this.formularioClientes.reset();
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

  getClientes() {
    this.clienteService.list().subscribe();
  }

  openModal(contenido: any, cliente: Cliente) {
    this.selectedCliente = cliente;
    this.modal.open(contenido, { centered: true, size: 'lg' });
  }
}
