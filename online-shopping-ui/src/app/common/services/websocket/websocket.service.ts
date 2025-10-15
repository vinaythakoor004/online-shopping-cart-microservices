import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import { Observable, Subject } from 'rxjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
      if (isPlatformBrowser(this.platformId)) {
        this.stompClient = new Client({
          webSocketFactory: () => new SockJS('/ws-booking'),
          reconnectDelay: 5000,
          // debug: (msg) => console.log(msg),
        });

        this.stompClient.onConnect = (frame) => {
          // console.log('Connected: ', frame);

        this.stompClient.subscribe('/topic/booking', (message) => {
            const body = message.body;
            console.log('📢 Booking notification:', body);
            this.bookingSubject.next(body);
          });
        };

        this.stompClient.activate();
      }
  }

private stompClient!: Client;
private bookingSubject = new Subject<string>();

onMessage(): Observable<string> {
  return this.bookingSubject.asObservable();
}

connect() {

  }

  disconnect() {
    this.stompClient.deactivate();
  }
}
