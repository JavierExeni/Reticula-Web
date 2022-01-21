import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { NotificationService } from '../../../modules/services/notification.service';
import { fireNotification } from '../../models/notification';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  notifications: fireNotification[] = [];

  constructor(
    private router: Router,
    private notification: NotificationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getNotifications();
  }

  getNotifications() {
    this.notification.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe((data:any) => {
      this.notifications = data.filter((res: any) => res.user.id != this.authService.usuario.id);
      console.log(this.notifications);

    });
  }

  logout() {
    this.router.navigate(['/auth']);
    localStorage.clear();
  }
}
