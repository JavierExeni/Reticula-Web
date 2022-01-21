import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../shared/models/usuario';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';
import { NotificationService } from '../../services/notification.service';
import { fireNotification } from '../../../shared/models/notification';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [],
})
export class UsuariosComponent implements OnInit {
  page = 1;
  pageSize = 10;
  authUser: FormGroup = this.fb.group({
    correo: ['', Validators.required],
    nombre: ['', Validators.required],
    username: ['', Validators.required],
    spassword: ['', Validators.required],
  });

  usuarios: Usuario[] = [];
  auxusuarios: Usuario[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UsuarioService,
    private authService: AuthService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.getUsers();
  }

  saveUser() {
    const { correo, nombre, username, spassword } = this.authUser.value;
    const user: Usuario = { scorreo: correo, nombre, username, spassword };

    this.userService.insert(user).subscribe(
      (res) => {
        this.authUser.reset();
        this.registrarNotifiaction('Registró un nuevo Usuario', 1);
        Swal.fire({
          icon: 'success',
          title: 'Usuario Registrado',
          showConfirmButton: false,
          timer: 2000,
        });
        this.getUsers();
      },
      (err) => console.log
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

  getUsers() {
    this.userService.list().subscribe((res: any) => {
      this.usuarios = res;
      this.auxusuarios = res;
    });
  }

  search(event: any) {
    let termino = event.target.value;

    if (termino === '') {
      this.usuarios = this.auxusuarios;
      return;
    }
    this.usuarios = [];
    this.auxusuarios.filter((res: any) => {
      if (res.nombre.toLowerCase().includes(termino.toLowerCase().trim())) {
        this.usuarios.push(res);
      }
    });
  }
}
