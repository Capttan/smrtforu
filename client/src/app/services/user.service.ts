import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService implements CanActivate {

  // login details

  login: false;

  constructor(private http: HttpClient, private router: Router) { }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.login)
      this.router.navigate(['/login']);
    return (this.login)
  }

    // user sign in

    signIn(formObj): Promise<any>{
      const url = '/authenticate';
  
      const dataObj = {
        message: 'ok'
      }; 
  
      const options = {
      };

      const bodyObj = {
        username: formObj.username,
        password: formObj.password
      }
  
  
      return this.http.post(url,bodyObj).toPromise();
    }

    logout(): Promise<any>{
      const url = '/logout';
  
      const dataObj = {
        message: 'ok'
      }; 
  
      const options = {
      };

      const bodyObj = {
        username: 'test',
        password: 'test'
      }
  
  
      return this.http.get(url,options).toPromise();
    }

    secureCheck(): Promise<any>{
      const url = '/securecheck';
  
      const dataObj = {
        message: 'ok'
      }; 
  
      const options = {
      };

      const bodyObj = {
        username: 'test',
        password: 'test'
      }
  
  
      return this.http.get(url,options).toPromise();
    }

    // get user wallet
    getWallet(): Promise<any>{

      const url = '/wallet';
  
      const dataObj = {
        message: 'ok'
      }; 
  
      const options = {
      };
  
  
      return this.http.get(url,options).toPromise();
    }
  
    // top-up user wallet
    topUp(value): Promise<any>{
      const url = '/wallet/topup';
  
      const dataObj = {
        value: value
      }; 
  
      const options = {
      };
  
  
      return this.http.post(url,dataObj).toPromise();
    }

    getNews(): Promise<any>{

      const url = '/tweets';
  
      const dataObj = {
        message: 'ok'
      }; 
  
      const options = {
      };
  
  
      return this.http.get(url,options).toPromise();
    }

}
