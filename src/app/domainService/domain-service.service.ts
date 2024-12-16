import { Platform } from '@angular/cdk/platform';
import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DomainServiceService {

  constructor(private cookieS: CookieService, @Inject(PLATFORM_ID) private platformId: any) { }
  isAvailable() {
    let pass = isPlatformBrowser(this.platformId) ? true : false;
    if (!pass) return of(false);


    return of(this.cookieS.get("token") ? true : false).pipe(tap((v) => console.log('')
    ))
  }
}
