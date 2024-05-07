import { AudioService } from '@/app/lib/audio.service';
import { LineaService } from '@/app/services/linea.service';
import { PusherService } from '@/app/services/pusher.service';
import { DeletionEvent } from '@/app/types/DeletionEvent';
import { Linea } from '@/app/types/Linea';
import { NewLineaEvent } from '@/app/types/NewLineaEvent';
import { Response } from '@/app/types/Response';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-lineas',
  standalone: true,
  imports: [
  ],
  templateUrl: './lineas.component.html',
  styleUrl: './lineas.component.css'
})
export class LineasComponent implements OnInit {
  lineas: Linea[] = [];
  @Input() channel: string;

  constructor(
    private pusher: PusherService,
    private lineaService: LineaService,
    private audioService: AudioService,

  ) { }

  ngOnInit(): void {
    if (this.channel === 'lineas-cocina') {
      this.lineaService.getLineasOfCocina().subscribe((response: Response<Linea[]>) => {
        const { data } = response;
        this.lineas = data;
      })
    } else if (this.channel === 'lineas-barra') {
      this.lineaService.getLineasOfBarra().subscribe((response: Response<Linea[]>) => {
        const { data } = response;
        this.lineas = data;
      })
    }

    const channel = this.pusher.listenTo(this.channel);

    channel.bind('linea-created', (event: NewLineaEvent) => {
      const { data, ocurredOn } = event;
      console.log('nueva linea', data);
      console.log(ocurredOn);

      this.audioService.notification();
      this.lineas = [...this.lineas, data];
    });

    channel.bind('linea-edited', (event: Response<Linea>) => {
      const { data } = event;
      console.log('una línea ha sido editada', data);
      this.lineas = this.lineas.map((linea: Linea) => {
        if (linea.id === data.id) {
          return data;
        }

        return linea;
      });
    });

    channel.bind('linea-deleted', (event: DeletionEvent) => {
      const { id } = event;
      console.log('una linea ha sido eliminada', id);
      this.lineas.find((linea: Linea, index: number) => {
        if (linea.id === id) {
          this.lineas.splice(index, 1);

          return true;
        }

        return false;
      });
    });
  }
}