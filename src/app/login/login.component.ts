import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatCardModule } from "@angular/material/card"
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../api/api.service';
import { MatInputModule } from "@angular/material/input"
import { MatFormFieldModule } from "@angular/material/form-field"
import { CommonModule } from '@angular/common';
import { MatButtonModule } from "@angular/material/button"
import { BehaviorSubject, Observable, take } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { CookieService } from "ngx-cookie-service";
import { ToastrService } from 'ngx-toastr';
import { LocalService } from '../services/local.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatCardModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule, CommonModule, MatButtonModule,
  MatProgressBarModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  @Output() loginSuccess = new EventEmitter<boolean>();


  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.minLength(1)]),
    password: new FormControl('', [Validators.required, Validators.minLength(1)]),
  });
  login = false;
  logged=false;
  constructor(
    private toastr: ToastrService,
    private api: ApiService, private router: Router, private cookie: CookieService, private lst: LocalService) {


  }

  onSubmit() {



    if (this.loginForm.valid) {
      this.login=true;
      this.toastr.info("Espera un momento","Informacion")
      try {

        const { email, password } = this.loginForm.value;
        this.api.login(email, password).pipe(take(1)).subscribe((response) => {
          


          if (response['message'] == 'Logged in') {
            this.api.isLoggedInSubject.next(true)


            var sdate = new Date();

            sdate.setDate(sdate.getDate() + 1)
            this.api.token=response["token"];

            this.cookie.set("token", response["token"], { expires: sdate });
            this.lst.setItem('typeUser', response['typeUser'])
            this.lst.setItem('idUser', response['idUser'])
            this.lst.setItem('idCompania', response['idCompania'])
            this.toastr.success("Iniciado sesion", "Exitosamente")
            this.login=false;
            this.loginSuccess.emit(true)
            this.router.navigate(['/dashboard']);
            this.logged=true;
            
            
            setTimeout(() => {
              window.location.reload();
            }, 500);
            return;
          }

          this.toastr.warning(response['message'], "Warning")
          this.login=false;
          


        }, error => {

          this.toastr.error(error['statusText'], "Error")
          console.log(error)

        });
      } catch (e) {


        this.toastr.error("Ha ocurrido u", "Error")
        this.login=false;
      }

    }
  }
  ngOnInit(): void {
    this.login = false;



  }
}
