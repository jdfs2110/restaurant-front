import { RolService } from "@/app/services/rol.service";
import { Response } from "@/app/types/Response";
import { Rol } from "@/app/types/Rol";
import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-admin-rol-detailed',
  standalone: true,
  imports: [],
  templateUrl: './admin-rol-detailed.component.html',
  styleUrl: './admin-rol-detailed.component.css'
})
export class AdminRolDetailedComponent implements OnInit {
  protected rol: Rol = {} as Rol;

  constructor(
    private rolService: RolService,
    private route: ActivatedRoute,
    private titleService: Title,
    private router: Router
  ) { }

  get id() {
    return this.route.snapshot.params['id']
  }

  ngOnInit(): void {
    console.log(this.id)
    this.titleService.setTitle(`Edición del rol ${this.id}`);
    this.rolService.findById(this.id).subscribe({
      next: (response: Response<Rol>) => {
        const { data } = response;
        this.rol = data;
      },
      error: (error: any) => {
        this.router.navigate(['/admin/roles']);
      }
    })
  }

}