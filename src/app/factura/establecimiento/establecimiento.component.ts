import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {MatSlideToggleModule} from "@angular/material/slide-toggle"
import { LocalService } from '../../services/local.service';
import { FacturaService } from '../../api/factura.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-establecimiento',
  standalone: true,
  imports: [
    MatCardModule, ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule,
    MatTableModule,
    MatSlideToggleModule,
    MatIconModule],
  templateUrl: './establecimiento.component.html',
  styleUrl: './establecimiento.component.css'
})
export class EstablecimientoComponent implements OnDestroy,OnInit,AfterViewInit{
dataSource=[];
private destroy$: Subject<void> = new Subject<void>();
  establecimientoForm: FormGroup;
displayedColumns=['acciones','establecimiento','descripcion','correlativo','activo'];
  constructor(private fb: FormBuilder,
    private localStorage:LocalService,
    private apiFac:FacturaService,
    private toastr:ToastrService
    ) {
    this.establecimientoForm = this.fb.group({
      _id:[''],
      establecimiento: ['', Validators.required],
      descripcion: ['', Validators.required],
      correlativo: ['', Validators.required,Validators.minLength(3), Validators.maxLength(3)],
      idCompania: [''],
      activo: [false, Validators.required]
    });
  }
  ngOnInit(): void {

    
  }

  ngAfterViewInit(): void {
    this.getEstablecimiento();
  }
  getEstablecimiento() {
    
    
    let id = this.localStorage.getItem("idCompania")
    this.apiFac.getEstablecimientoById(id).subscribe((resp) => {
      let _data = resp['data']
      
      this.dataSource = [..._data]

    });
  }
  onSubmit(): void {


    if (this.establecimientoForm.valid) {
      if (this.establecimientoForm.value._id) {
        this.apiFac
          .updatEstablecimiento(this.establecimientoForm.value._id, this.establecimientoForm.value)
          .subscribe((response) => {
            
            this.resetForm();
            this.toastr.success("Actualizado correctamente", 'Exitosamente')
            this.getEstablecimiento();
          });
      } else {
        this.apiFac
          .createEstablecimiento(this.establecimientoForm.value)
          .subscribe((response) => {
            if(response){


              this.resetForm();
              this.toastr.success("Creado correctamente", 'Exitosamente')
              
              
              
              this.getEstablecimiento();
            }
          });
      }

    }
    else {
      this.toastr.warning("Rellena todos los campos", 'Warning')
    }
  }
  editEstablecimiento(establecimiento: any): void {
    this.establecimientoForm.patchValue(establecimiento);
  }

  deleteEstablecimiento(id: string): void {
    Swal.fire({
      title: "Eliminar",
      text: "Seguro que deseas eliminar el  establecimiento?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiFac.deleteEstablecimiento(id).subscribe((response) => {
          
          if(response['type']=="ok"){
            this.toastr.success("Eliminado correctamente", 'Exitosamente')
            this.getEstablecimiento();

          }

        });
      } else {
        result.dismiss === Swal.DismissReason.cancel
      }
    })

  }

  resetForm(): void {
    this.establecimientoForm.reset();
    this.establecimientoForm.patchValue({ activo: true });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}