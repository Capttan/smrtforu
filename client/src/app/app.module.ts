import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { MaterialModule } from './material.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

// components
import { AutocompComponent } from './components/autocomp.component';
import { LandingComponent } from './components/landing.component';
import { LoginComponent } from './components/login.component';
import { CurrstationComponent } from './components/currstation.component';
import { StationdirComponent } from './components/stationdir.component';
import { NeareststnComponent } from './components/neareststn.component';
import { WalletComponent } from './components/wallet.component';
import { AllstationsComponent } from './components/allstations.component';
import { FareComponent } from './components/fare.component';
import { NewsComponent } from './components/news.component';

// services
import { StationService } from './services/station.service';
import { UserService } from './services/user.service';
import { PushNotificationService } from './services/push-notification.service';



// directives

@NgModule({
  declarations: [
    AppComponent,
    AutocompComponent,
    LandingComponent,
    LoginComponent,
    CurrstationComponent,
    StationdirComponent,
    NeareststnComponent,
    WalletComponent,
    AllstationsComponent,
    FareComponent,
    NewsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    StationService,
    UserService,
    PushNotificationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
