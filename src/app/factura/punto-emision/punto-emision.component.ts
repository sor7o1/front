import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FacturaService } from '../../api/factura.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { LocalService } from '../../services/local.service';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-punto-emision',
  standalone: true,
  imports: [CommonModule, MatSlideToggleModule,MatCardModule, MatRadioModule, MatTableModule, MatButtonModule, MatInputModule, MatIconModule, MatFormFieldModule, ReactiveFormsModule, FormsModule],
  templateUrl: './punto-emision.component.html',
  styleUrl: './punto-emision.component.css'
})
export class PuntoEmisionComponent implements AfterViewInit, OnDestroy {
  displayedColumns = ['acciones', 'puntoEmision', 'descripcion', 'correlativo', 'activo']
  puntoEmisionForm: FormGroup;
  dataSource = []
  private destroy$: Subject<void> = new Subject<void>();
  constructor(private toastr: ToastrService,
    private fb: FormBuilder,
    private localStorage: LocalService,
    private puntoEmisionService: FacturaService) {
    this.puntoEmisionForm = this.fb.group({
      _id: [''],
      puntoEmision: ['', Validators.required],
      descripcion: ['', Validators.required],
      correlativo: ['', Validators.required],
      activo: [true],
    });
  }
  ngAfterViewInit(): void {
    this.getPuntosEmision();
  }
  getPuntosEmision() {
    
    
    let id = this.localStorage.getItem("idCompania")
    this.puntoEmisionService.getById(id).subscribe((resp) => {
      let _data = resp['data']
      
      this.dataSource = [..._data]

    });
  }
  onSubmit(): void {


    if (this.puntoEmisionForm.valid) {
      if (this.puntoEmisionForm.value._id) {
        this.puntoEmisionService
          .update(this.puntoEmisionForm.value._id, this.puntoEmisionForm.value)
          .subscribe((response) => {
            
            this.resetForm();
            this.toastr.success("Actualizado correctamente", 'Exitosamente')
            this.getPuntosEmision();
          });
      } else {
        this.puntoEmisionService
          .create(this.puntoEmisionForm.value)
          .subscribe((response) => {
            if(response){


              this.resetForm();
              this.toastr.success("Creado correctamente", 'Exitosamente')
              
              
              
              this.getPuntosEmision();
            }
          });
      }

    }
    else {

      
      this.toastr.warning("Rellena todos los campos", 'Warning')
    }
  }
  editPuntoEmision(puntoEmision: any): void {
    this.puntoEmisionForm.patchValue(puntoEmision);
  }

  deletePuntoEmision(id: string): void {
    Swal.fire({
      title: "Eliminar",
      text: "Seguro que deseas eliminar el  punto de emisión?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        this.puntoEmisionService.delete(id).subscribe((response) => {
          
          if(response['type']=="ok"){
            this.toastr.success("Eliminado correctamente", 'Exitosamente')
            this.getPuntosEmision();

          }

        });
      } else {
        result.dismiss === Swal.DismissReason.cancel
      }
    })

  }

  resetForm(): void {
    this.puntoEmisionForm.reset();
    this.puntoEmisionForm.patchValue({ activo: true });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
