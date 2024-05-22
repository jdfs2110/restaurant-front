import { Injectable } from '@angular/core';
import Pusher from 'pusher-js';
import env from '@/app/env.json';

@Injectable({
  providedIn: 'root',
})
export class PusherService {
  private readonly key: string = env.PUSHER_KEY;

  private pusher: Pusher = {} as Pusher;

  constructor() {
    this.pusher = new Pusher(this.key, {
      cluster: 'eu',
    });
  }

  public listenTo(channel: string) {
    return this.pusher.subscribe(channel);
  }
}
