import { Injectable } from "@angular/core";
import Pusher from "pusher-js";

@Injectable({
  providedIn: 'root'
})
export class PusherService {
  private readonly key: string = '';

  private pusher: Pusher = {} as Pusher;

  constructor() {
    this.pusher = new Pusher(this.key, {
      cluster: 'eu'
    })
  }

  public listenTo(channel: string) {
    return this.pusher.subscribe(channel);
  }
}