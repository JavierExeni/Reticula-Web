import { Usuario } from './usuario';
export interface fireNotification {
  eventname: string;
  eventtype: number;
  user: Usuario;
}

export enum NotificationType {
  UPDATE,
  CREATE,
}
