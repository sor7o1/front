import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, take } from 'rxjs';
import { FacturaService } from '../../api/factura.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LocalService } from '../../services/local.service';
import Swal from 'sweetalert2';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { MatNativeDateModule, MatOptionSelectionChange } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-cai',
  standalone: true,
  providers: [MatDatepickerModule],
  imports: [CommonModule,
    MatSelectModule,
    MatSlideToggleModule, MatDatepickerModule, MatNativeDateModule, MatCardModule, MatRadioModule, MatTableModule, MatButtonModule, MatInputModule, MatIconModule, MatFormFieldModule, ReactiveFormsModule, FormsModule],
  templateUrl: './cai.component.html',
  styleUrl: './cai.component.css'
})
export class CaiComponent implements OnDestroy, AfterViewInit, OnInit {


  private destroy$: Subject<void> = new Subject<void>();
  dataSource = [];
  puntosEmisions = [];
  establecimientos = [];
  tiposDocumentos = [];
  caiForm: FormGroup;
  displayedColumns = [
    'actions',
    'numeroAutorizacion',
    'fechaInicio',
    'fechaFin',
    'rangoInicial',
    'rangoFinal',
    'activo'];
  numeroFac = ['', '', '', '']
  numeroFacFinal = ['', '', '', '']
  constructor(private api: FacturaService,
    private localStorage: LocalService,
    private toastr: ToastrService, private fb: FormBuilder,
    private router: Router) {
    this.caiForm = this.fb.group({
      _id: [''],
      numeroAutorizacion: ['', Validators.required],
      idCompania: [''],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      rangoInicial: ['', Validators.required],
      rangoFinal: ['', Validators.required],
      activo: [''],
      idPuntoEmision: ['', Validators.required],
      idEstablecimiento: ['', Validators.required],
      idTipoDocumento: ['', Validators.required],
      numeroFactura: [''],
    })
  }
  ngOnInit(): void {
    let date = new Date();




    this.getCai();
    this.getPuntosEmision();
    this.getEstablecimiento();
    this.getTiposFactura();


  }
  ngAfterViewInit(): void {
    let date = new Date();



  }
  getPuntosEmision() {


    let id = this.localStorage.getItem("idCompania")
    this.api.getById(id).subscribe((resp) => {
      let _data: [] = resp['data']

      this.puntosEmisions = [..._data]
      if (_data.length == 0) {
        this.toastr.warning('No se ha configurado el punto de emision\nClick aqui para configurar el punto de emision', 'Advertencia').onTap.pipe(take(1))
          .subscribe(() => this.configRoutePuntoEmision());
      }

    });
  }


  configRoutePuntoEmision() {
    this.router.navigateByUrl('puntoemision')
  }

  configRouteEstablecimiento() {
    this.router.navigateByUrl('establecimientoFactura')
  }

  configRouteTipoDocumento() {
    this.router.navigateByUrl('tipoFactura')
  }
  getEstablecimiento() {


    let id = this.localStorage.getItem("idCompania")
    this.api.getEstablecimientoById(id).subscribe((resp) => {
      let _data: [] = resp['data']
      this.establecimientos = [..._data]


      if (_data.length == 0) {
        this.toastr.warning('No se ha configurado el establecimiento', 'Advertencia');
      }

    });
  }
  getTiposFactura() {


    let id = this.localStorage.getItem("idCompania")
    this.api.getTiposDocumentosById(id).subscribe((resp) => {
      let _data: [] = resp['data']


      this.tiposDocumentos = [..._data]
      if (_data.length == 0) {
        this.toastr.warning('No se ha configurado el tipo de documento', 'Advertencia');
      }

    });
  }
  getCai() {


    let id = this.localStorage.getItem("idCompania")
    this.api.getCaiById(id).subscribe((resp) => {

      

      let _data = resp['data']

      this.dataSource = [..._data]

    });
  }
  onSubmit(): void {

    
    if (this.caiForm.valid) {
      if (this.caiForm.value._id) {
        this.api
          .updateCai(this.caiForm.value._id, this.caiForm.value)
          .subscribe((response) => {


            this.resetForm();
            this.toastr.success("Actualizado correctamente", 'Exitosamente')
            this.getCai();
          });
      } else {
        this.api
          .createCai(this.caiForm.value)
          .subscribe((response) => {

            if (response) {


              this.resetForm();
              this.toastr.success("Creado correctamente", 'Exitosamente')



              this.getCai();
            }
          });
      }

    }
    else {
      this.toastr.warning("Rellena todos los campos", 'Warning')
    }
  }
  editCai(puntoEmision: any): void {
    this.caiForm.get("numeroFactura").setValue(puntoEmision['numeroInicial'])
    
    this.caiForm.patchValue(puntoEmision);
  }

  deleteCai(id: string): void {
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
        this.api.deleteCai(id).subscribe((response) => {

          if (response['type'] == "ok") {
            this.toastr.success("Eliminado correctamente", 'Exitosamente')
            this.getCai();

          }

        });
      } else {
        result.dismiss === Swal.DismissReason.cancel
      }
    })

  }
  change($event: MatOptionSelectionChange<any>, pos) {

    
    let corr = $event.source.value['corr'];
    let final = corr + '-'
    this.numeroFac[pos] = final;
    this.numeroFacFinal[pos] = final;

    let numerFactura = this.numeroFac.toString().replaceAll(',', '')
    let numerFacturaFinal = this.numeroFacFinal.toString().replaceAll(',', '')
    let str = numerFactura + '-' + numerFacturaFinal;
    this.caiForm.get("numeroFactura").setValue(str)



  }
  changeRangeInitial($event: Event) {
    let raninit = this.caiForm.get('rangoInicial').value;
    if (!raninit) return;
    let size = raninit.toString().length;
    let after = '';
    for (let i = 0; i < 8 - size; i++) {

      after += "0"


    }
    this.numeroFac[3] = after + raninit;
    let numerFactura = this.numeroFac.toString().replaceAll(',', '')
    let numerFacturaFinal = this.numeroFacFinal.toString().replaceAll(',', '')
    let str = numerFactura + '-' + numerFacturaFinal;
    this.caiForm.get("numeroFactura").setValue(str)
  }
  changeRangeFinal($event: Event) {

    let ranfinal = this.caiForm.get('rangoFinal').value;
    let raninitial = this.caiForm.get('rangoInicial').value;

    if (ranfinal <= raninitial) this.toastr.warning("EL rango final es mayor o igual al inicial", "Advertencia");
    if (!ranfinal) return;

    let size = ranfinal.toString().length;
    let after = '';
    for (let i = 0; i < 8 - size; i++) {

      after += "0"

    }
    this.numeroFacFinal[3] = after + ranfinal;
    let numerFactura = this.numeroFac.toString().replaceAll(',', '')
    let numerFacturaFinal = this.numeroFacFinal.toString().replaceAll(',', '')
    let str = numerFactura + '-' + numerFacturaFinal;
    this.caiForm.get("numeroFactura").setValue(str)
  }
  resetForm(): void {
    this.caiForm.reset();
    this.caiForm.patchValue({ activo: true });
  }



  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


}

