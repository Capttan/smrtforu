import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './services/user.service';
import { SwPush } from '@angular/service-worker';
import { PushNotificationService } from './services/push-notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client';

  PUBLIC_VAPID =
    'BNOJyTgwrEwK9lbetRcougxkRgLpPs1DX0YCfA5ZzXu4z9p_Et5EnvMja7MGfCqyFCY4FnFnJVICM4bMUcnrxWg';

  constructor(private router: Router, public userSvc: UserService,
    private swPush: SwPush, private pushService: PushNotificationService){

      if(swPush.isEnabled){

        console.log('swPush enabled');
        
        this.swPush.requestSubscription({
          serverPublicKey: this.PUBLIC_VAPID
        })
        .then(subscription=>{
          //send subscription to the server
          console.log('sub: ', subscription);
          this.pushService.sendSubscriptionToTheServer(subscription).subscribe(change=>{
            console.log('change: ', change);
          });
        })
        .catch(console.error);
      }


    }
//   <button type="button" (click)="goToHome()">Landing Page</button><br>
// <button type="button" (click)="goToStnDir()">Single Station</button><br>
// <button type="button" (click)="goToCurStn()">Station Directions</button><br>

  goToHome(){
    this.router.navigate(['/']);
  }

  goToAutocomp(){
    this.router.navigate(['/autocomp']);
  }

  goToLogin(){
    this.router.navigate(['/login']);
  }

  goToStnDir(){
    this.router.navigate(['/stndir']);
  }

  goToAllStn(){
    this.router.navigate(['/allstn']);
  }

  goToCurStn(){
    this.router.navigate(['/curstn/0']);
  }

  goToNearest(){
    this.router.navigate(['/nearest']);
  }

  goToWallet(){
    this.router.navigate(['/userwallet']);
  }

  goToFare(){
    this.router.navigate(['/userfare']);
  }

  goToNews(){
    this.router.navigate(['/news']);
  }

  logout(){
    this.userSvc.logout()
    .then((result)=>{
      console.log('logout: ',result);
    })
    .catch((err)=>{
      console.log('logout: ',err);
    })
    .finally(()=>{
      this.userSvc.login = false;
      this.router.navigate(['/']);
    })
  }
  

}
