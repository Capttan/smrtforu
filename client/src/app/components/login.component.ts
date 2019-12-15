import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { NgForm, NgModel, FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    username: new FormControl('',Validators.required),
    password: new FormControl('',Validators.required)
  });

  constructor(private userSvc: UserService, private router: Router) { }

  ngOnInit() {
    if(this.userSvc.login){
      this.router.navigate(['/allstn']);
    }
  }

  signIn(){
    const formObj = {
      username: this.loginForm.controls.username.value,
      password: this.loginForm.controls.password.value
    }
    
    this.userSvc.signIn(formObj)
    .then((result)=>{
      console.log('signIn: ',result);
      this.userSvc.login = result.login;
      if(result.login){
        this.router.navigate(['/allstn']);
      }
    })
    .catch((err)=>{
      console.log('signIn: ',err);
      this.userSvc.login = false;
    })
  }

  // logout(){
  //   this.userSvc.logout()
  //   .then((result)=>{
  //     console.log('logout: ',result);
  //   })
  //   .catch((err)=>{
  //     console.log('logout: ',err);
  //   })
  //   .finally(()=>{this.userSvc.login = false;})
  // }

  testSecure(){
    this.userSvc.secureCheck()
    .then((result)=>{
      console.log('secure: ',result);
    })
    .catch((err)=>{
      console.log('secure: ',err);
    })
  }

  goToHome(){
    this.router.navigate(['/']);
  }

}
