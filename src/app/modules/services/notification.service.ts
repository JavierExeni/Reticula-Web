import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { fireNotification } from '../../shared/models/notification';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private dbPath = '/eventos';

  private base_url =
      'https://reticulaapp-default-rtdb.firebaseio.com/eventos.json';

  notificationRef: AngularFireList<fireNotification>;

  constructor(private db: AngularFireDatabase, private http: HttpClient) {
    this.notificationRef = db.list(this.dbPath);
  }

  getAll(): AngularFireList<fireNotification> {
    return this.notificationRef;
  }

  get() {
    return this.http.get(this.base_url);
  }

  create(notification: fireNotification): Observable<fireNotification> {
    //return this.notificationRef.push(notification);
    return this.http.post<fireNotification>(this.base_url, notification);
  }

  update(key: string, value: any): Promise<void> {
    return this.notificationRef.update(key, value);
  }

  delete(key: string): Promise<void> {
    return this.notificationRef.remove(key);
  }

  deleteAll(): Promise<void> {
    return this.notificationRef.remove();
  }
}
