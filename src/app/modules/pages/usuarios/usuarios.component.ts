import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../shared/models/usuario';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [],
})
export class UsuariosComponent implements OnInit {
  authUser: FormGroup = this.fb.group({
    correo: ['', Validators.required],
    nombre: ['', Validators.required],
    username: ['', Validators.required],
    spassword: ['', Validators.required],
  });

  get usuarios() {
    return this.userService.usuarios;
  }

  constructor(private fb: FormBuilder, private userService: UsuarioService) {}

  ngOnInit(): void {
    if (this.usuarios.length === 0) this.getUsers();
  }

  saveUser() {
    const { correo, nombre, username, spassword } = this.authUser.value;
    const user: Usuario = { correo, nombre, username, spassword };

    this.userService.insert(user).subscribe(
      (res) => {
        console.log(res);
        this.authUser.reset();
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

  getUsers() {
    this.userService.list().subscribe();
  }
}
