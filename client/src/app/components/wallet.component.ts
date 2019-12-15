import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { NgForm, NgModel, FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {

  constructor(private userSvc: UserService, private router: Router) { }

  topUpFlag = false;
  walletValue: number = -1.0;

  topupForm = new FormGroup({
    topupValue: new FormControl('',[Validators.required,Validators.min(0)]),
  });
  
  ngOnInit() {
    this.getWallet();
  }

  getWallet(){
    this.userSvc.getWallet()
    .then((result)=>{
      console.log('wallet: ',result);
      console.log(result.output[0].walletvalue)
      this.walletValue = result.output[0].walletvalue;
    })
    .catch((err)=>{
      console.log('wallet: ',err);
      this.walletValue = -1.0;
    })
  }

  topUp(){
    const value = this.topupForm.controls.topupValue.value;
    this.userSvc.topUp(value)
    .then((result)=>{
      console.log('topup: ',result);
    })
    .catch((err)=>{
      console.log('topup: ',err);
    })
    .finally(()=>{
      this.topUpFlag = false;
      this.topupForm.reset();
    })
  }


  initTopUp(){
    // this.topUpFlag = true;
    this.topUpFlag = !(this.topUpFlag);
  }

  goToHome(){
    this.router.navigate(['/']);
  }

}
