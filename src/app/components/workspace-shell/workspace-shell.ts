import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar';

@Component({
  selector: 'app-workspace-shell',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './workspace-shell.html',
  styleUrl: './workspace-shell.css'
})
export class WorkspaceShellComponent {}
