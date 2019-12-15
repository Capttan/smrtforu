import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router, ActivatedRouteSnapshot } from '@angular/router';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  newsArray = [];

  constructor(private userSvc: UserService, private router: Router) { }

  ngOnInit() {
    this.userSvc.getNews()
    .then((result)=>{
      console.log(result);
      this.newsArray = result.message;
    })
    .catch((err)=>{
      console.log(err);
    })
  }

  goToHome(){
    this.router.navigate(['/']);
  }

}
