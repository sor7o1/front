import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FacturaService } from '../../api/factura.service';
import { ToastrService } from 'ngx-toastr';
import { LocalService } from '../../services/local.service';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-tipos-factura',
  standalone: true,
  imports: [CommonModule, MatSlideToggleModule, MatCardModule, MatRadioModule, MatTableModule, MatButtonModule, MatInputModule, MatIconModule, MatFormFieldModule, ReactiveFormsModule, FormsModule],
  templateUrl: './tipos-factura.component.html',
  styleUrl: './tipos-factura.component.css'
})
export class TiposFacturaComponent {
  tiposFacturaForm: FormGroup;
  dataSource = [];
  private destroy$: Subject<void> = new Subject<void>();

  displayedColumns = ['actions', 'tipoFactura', 'descripcion', 'correlativo', 'activo'];

  constructor(private formBuilder: FormBuilder, private apiService: FacturaService,
    private toastr: ToastrService, private localStorage: LocalService) {
    this.tiposFacturaForm = this.formBuilder.group({
      _id: [''],
      tipoFactura: ['', Validators.required],
      descripcion: ['', Validators.required],
      correlativo: ['', Validators.required, Validators.minLength(2), Validators.maxLength(2)],
      idCompania: [''],
      activo: [true, Validators.required]
    });
  }

  ngAfterViewInit(): void {
    this.getTiposFactura();
  }
  getTiposFactura() {


    let id = this.localStorage.getItem("idCompania")
    this.apiService.getTiposDocumentosById(id).subscribe((resp) => {
      let _data = resp['data']

      this.dataSource = [..._data]

    });
  }
  onSubmit(): void {


    if (this.tiposFacturaForm.valid) {
      if (this.tiposFacturaForm.value._id) {
        this.apiService
          .updateTipoDocumento(this.tiposFacturaForm.value._id, this.tiposFacturaForm.value)
          .subscribe((response) => {
            

            this.resetForm();
            this.toastr.success("Actualizado correctamente", 'Exitosamente')
            this.getTiposFactura();
          });
      } else {
        this.apiService
          .createTipoDocumento(this.tiposFacturaForm.value)
          .subscribe((response) => {
            
            if (response) {


              this.resetForm();
              this.toastr.success("Creado correctamente", 'Exitosamente')



              this.getTiposFactura();
            }
          });
      }

    }
    else {
      this.toastr.warning("Rellena todos los campos", 'Warning')
    }
  }
  editTipoFactura(puntoEmision: any): void {
    this.tiposFacturaForm.patchValue(puntoEmision);
  }

  deleteTipoFactura(id: string): void {
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
        this.apiService.deleteTipoDocumento(id).subscribe((response) => {

          if (response['type'] == "ok") {
            this.toastr.success("Eliminado correctamente", 'Exitosamente')
            this.getTiposFactura();

          }

        });
      } else {
        result.dismiss === Swal.DismissReason.cancel
      }
    })

  }

  resetForm(): void {
    this.tiposFacturaForm.reset();
    this.tiposFacturaForm.patchValue({ activo: true });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
