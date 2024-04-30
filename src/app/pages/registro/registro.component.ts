import { PusherService } from '@/app/services/pusher.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent implements OnInit {
  constructor(
    private pusher: PusherService
  ) { }

  ngOnInit(): void {
    const channel = this.pusher.listenTo('pedido-created');
    channel.bind('pedido-created', (data: any) => {
      const { pedido } = data;
      console.log('nuevo pedido:', pedido);
    })
  }
}
