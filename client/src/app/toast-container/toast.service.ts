import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: number;
  type: 'error' | 'info' | 'success';
  message: string;
  title?: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly messages = signal<readonly ToastMessage[]>([]);
  private nextId = 0;

  error(message: string, title?: string): void {
    this.add('error', message, title);
  }

  info(message: string, title?: string): void {
    this.add('info', message, title);
  }

  success(message: string, title?: string): void {
    this.add('success', message, title);
  }

  dismiss(id: number): void {
    this.messages.update(messages => messages.filter(message => message.id !== id));
  }

  private add(type: ToastMessage['type'], message: string, title?: string): void {
    const id = this.nextId++;
    this.messages.update(messages => [...messages, { id, type, message, title }]);
    setTimeout(() => this.dismiss(id), 5000);
  }
}
