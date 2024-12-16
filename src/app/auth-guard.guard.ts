import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpResponse } from '@angular/common/http'
import { ApiService } from './api/api.service';
import { DomainServiceService } from './domainService/domain-service.service';
import { tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';


@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  couter = 0;
  constructor(private router: Router, private cookie: CookieService, private domainService: DomainServiceService,@Inject(PLATFORM_ID) private platformId: any) { }
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let token = this.cookie.get("token")
    // this.isAuthorized();
    
    
    if(!token && !isPlatformBrowser(this.platformId)){
    
    return true;
    };
    return this.domainService.isAvailable().pipe(
      tap((value) => {
        this.couter++
        !value ? (this.router.navigate(['/login'])) : false;

        return value

      }
      ))

  }
}