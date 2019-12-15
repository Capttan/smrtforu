import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// copy components from app.modules.ts
import { AutocompComponent } from './components/autocomp.component';
import { LandingComponent } from './components/landing.component';
import { CurrstationComponent } from './components/currstation.component';
import { StationdirComponent } from './components/stationdir.component';
import { NeareststnComponent } from './components/neareststn.component';
import { WalletComponent } from './components/wallet.component';
import { LoginComponent } from './components/login.component';
import { AllstationsComponent } from './components/allstations.component';
import { FareComponent } from './components/fare.component';
import { NewsComponent } from './components/news.component';

import { UserService } from './services/user.service';



const routes: Routes = [
  { path: '', component: LoginComponent },
  { path:'autocomp', component: AutocompComponent, canActivate: [ UserService ]  },
  { path:'login', component: LoginComponent },
  { path: 'allstn', component: AllstationsComponent, canActivate: [ UserService ]  },
  { path: 'curstn/:id', component: CurrstationComponent, canActivate: [ UserService ]  },
  { path: 'stndir', component: StationdirComponent, canActivate: [ UserService ]  },
  { path: 'nearest', component: NeareststnComponent, canActivate: [ UserService ]  },
  { path: 'userwallet', component: WalletComponent, canActivate: [ UserService ]  },
  { path: 'userfare', component: FareComponent, canActivate: [ UserService ]  },
  { path: 'news', component: NewsComponent, canActivate: [ UserService ]  },
  { path: '**', redirectTo: '/', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
