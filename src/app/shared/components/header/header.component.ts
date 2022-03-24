import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { NotificationService } from '../../../modules/services/notification.service';
import { fireNotification } from '../../models/notification';
import { AuthService } from '../../../auth/auth.service';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  notifications: fireNotification[] = [];
  usuarioLog!: string;

  constructor(
    private router: Router,
    private notification: NotificationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getNotifications();
    this.showUserOption();
  }

  getNotifications() {
    this.notification.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe((data:any) => {
      console.log(data);

      this.notifications = data.filter((res: any) => res.user.codigo_id != this.authService.usuario.codigo_id).slice(data.length-5);
    });
  }

  logout() {
    this.router.navigate(['/auth']);
    sessionStorage.clear();
  }

  showUserOption(): string{
    let user = sessionStorage.getItem('user');
    if(user?.includes('admin')){
      return '';
    }
    return 'display: none';
  }
}
