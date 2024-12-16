import { ApplicationConfig, importProvidersFrom } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet, provideRouter, withInMemoryScrolling } from "@angular/router";

import { routes } from "./app.routes";
import { BrowserModule, provideClientHydration } from "@angular/platform-browser";
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {MatTabsModule} from "@angular/material/tabs";
import {MatDrawerContent, MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatInputModule} from "@angular/material/input";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatDialogModule} from "@angular/material/dialog";
import {MatSelectModule} from "@angular/material/select";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {ReactiveFormsModule} from "@angular/forms";

import {provideAnimations} from "@angular/platform-browser/animations";
import {provideHttpClient, withFetch, withInterceptorsFromDi} from "@angular/common/http";
import { provideToastr } from "ngx-toastr";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatBadgeModule } from "@angular/material/badge";
import { CommonModule } from "@angular/common";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import {NativeDateAdapter} from '@angular/material/core';

export const appConfig: ApplicationConfig = {

  // required animations providers
  providers: [
  importProvidersFrom(MatProgressSpinnerModule),
    // provideClientHydration(),

    provideToastr({
      timeOut: 10000,
      positionClass: "toast-bottom-right",
      preventDuplicates: true,
    }),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: "enabled",
        anchorScrolling: "enabled",
      }),
    ),
    provideAnimations(),
    provideHttpClient(),
    provideClientHydration(),
    
  ],
};
