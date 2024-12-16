import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatGridListModule } from '@angular/material/grid-list';
import { take } from 'rxjs';




@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatButtonModule, 
    MatTableModule, 
    MatIconModule, 
    MatButtonModule, 
    MatInputModule, 
    MatCardModule, 
    MatProgressBarModule, 
    MatRadioModule, 
    MatDividerModule, 
    MatGridListModule, 
    ReactiveFormsModule
  ],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})



export class ClientesComponent implements OnInit {
  clientForm: FormGroup;
  displayedColumns = ['acciones','nombre', 'direccion', 'username', 'password', 'idCompania', 'typeUser', 'telefono', 'correo', 'fecha'];
  dataSource =[];
  

  constructor(private fb: FormBuilder) {
    this.clientForm = this.fb.group({
      nombre: ['', Validators.required],
      direccion: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      idCompania: ['', Validators.required],
      typeUser: ['', Validators.required],
      telefono: ['', Validators.required],
      correo: ['', Validators.required],
      fecha: ['', Validators.required]
    });
  }
  saveClient() {

 
  }
  ngOnInit(): void {
    
  }
}
