import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Subject, take } from 'rxjs';
import { FacturaService } from '../api/factura.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-impuesto',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    FormsModule, MatTableModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatCardModule
  ],
  templateUrl: './impuesto.component.html',
  styleUrl: './impuesto.component.css'
})
export class ImpuestoComponent implements OnInit, OnDestroy {

  editCai(element) {
    this.impuestoForm.patchValue(element);
  }
  private destroy$: Subject<void> = new Subject<void>();
  impuestoForm = new FormGroup({
    _id: new FormControl(''),
    nombre: new FormControl('', [Validators.required]),
    correlativo: new FormControl('', [Validators.required]),
    valor: new FormControl('', [Validators.required]),
  });

  displayedColumns = ['actions', 'nombre', 'correlativo', 'valor'];
  dataSource = new MatTableDataSource();


  constructor(private fb: FormBuilder, private api: FacturaService, private toastr: ToastrService,
    @Inject(PLATFORM_ID) private platformId: any
  ) { }
  ngOnInit(): void {

this.checkBrowser();
  }

  saveImpuestos() {
    if (this.impuestoForm.valid) {
      if (this.impuestoForm.value['_id']) {
        this.api.updateImpuesto(this.impuestoForm.value['_id'], this.impuestoForm.value).pipe(take(1)).subscribe((res) => {
          

          if (res['type'] == "ok" && res['data'].length > 0) {

            this.toastr.warning('Actualizado exitosamente', 'Exitosamente');
          }
        }, error => {
          this.toastr.error('Ha ocurrido un error comunicate con el administador', 'Error');
        })

      } else {
        this.api.createImpuesto(this.impuestoForm.value).pipe(take(1)).subscribe((res) => {
          
          if (res['type'] == "ok" && res['data'].length > 0) {

            this.toastr.warning('Creado exitosamente', 'Exitosamente');
          }
        }, error => {
          this.toastr.error('Ha ocurrido un error comunicate con el administador', 'Error');
        })
      }
      this.getImpuestos();
    }
  }
  getImpuestos() {
    this.api.getImpuestos().pipe(take(1)).subscribe((response) => {
      

      if (response['type'] == "ok" && response['data'].length > 0) {
        this.toastr.success('Cargando datos', 'Exitosamente');
        const dataSource = [...response['data']]
        this.dataSource = new MatTableDataSource(dataSource);

      }

    }, error => {
      

      this.toastr.error('Ha ocurrido un error comunicate con el administrador\nError al cargar los datos', 'Error');
    })
  }
  deleteImpuesto(id) {
    
    
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
        this.api.deleteImpuesto(id).pipe(take(1)).subscribe((res) => {
          
          
          if (res['type'] == "ok") {
            this.toastr.success('Eliminado exitosamente', 'Exitosamente');
            this.getImpuestos();

          }
        }, error => {
          this.toastr.error('Ha ocurrido un error comunicate con el administrador', 'Error');
        })
      } else {
        result.dismiss === Swal.DismissReason.cancel;
      }
    })
  }
  checkBrowser(){
    if(!isPlatformBrowser(this.platformId))return;
    this.getImpuestos();

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


}
