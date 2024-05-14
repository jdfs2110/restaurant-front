import { UserService } from "@/app/services/user.service";
import { Response } from "@/app/types/Response";
import { User } from "@/app/types/User";
import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-admin-usuario-detailed',
  standalone: true,
  imports: [],
  templateUrl: './admin-usuario-detailed.component.html',
  styleUrl: './admin-usuario-detailed.component.css'
})
export class AdminUsuarioDetailedComponent implements OnInit {
  protected user: User = {} as User;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private titleService: Title,
    private router: Router
  ) { }

  get id() {
    return this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    console.log(this.id);
    this.titleService.setTitle(`Edición del usuario ${this.id}`);
    this.userService.findById(this.id).subscribe({
      next: (response: Response<User>) => {
        const { data } = response;
        this.user = data;
      },
      error: (error: any) => {
        this.router.navigate(['/admin/usuarios']);
      }
    })
  }
}