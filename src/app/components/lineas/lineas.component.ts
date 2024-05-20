import { AudioService } from '@/app/lib/audio.service';
import { LineaService } from '@/app/services/linea.service';
import { PusherService } from '@/app/services/pusher.service';
import { DeletionEvent } from '@/app/types/DeletionEvent';
import { Linea } from '@/app/types/Linea';
import { NewLineaEvent } from '@/app/types/NewLineaEvent';
import { Response } from '@/app/types/Response';
import { Component, Input, OnInit } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { PanelModule } from 'primeng/panel';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-lineas',
  standalone: true,
  imports: [
    HeaderComponent,
    PanelModule,
    AvatarModule,
    ButtonModule,
    DataViewModule,
    CommonModule
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
      this.lineaService.getLineasOfCocina().subscribe({
        next: (response: Response<Linea[]>) => {
          if (response === null) return;

          const { data } = response;
          this.lineas = data;
        },
        error: (error: any) => { console.log(error) }
      });
    } else if (this.channel === 'lineas-barra') {
      this.lineaService.getLineasOfBarra().subscribe({
        next: (response: Response<Linea[]>) => {
          if (response === null) return;

          const { data } = response;
          this.lineas = data;
        },
        error: (error: any) => { console.log(error) }
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

  completarLinea(id: number): void {
    this.lineaService.completarLinea(id).subscribe({
      next: (response: Response<any>) => {
        console.log(response.message);
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
}
