import { Component, OnInit } from '@angular/core';
import { StationService } from '../services/station.service';
import { Router, ActivatedRouteSnapshot } from '@angular/router';

@Component({
  selector: 'app-stationdir',
  templateUrl: './stationdir.component.html',
  styleUrls: ['./stationdir.component.css']
})
export class StationdirComponent implements OnInit {

  constructor(private stnSvc: StationService, private router: Router) { }

  ngOnInit() {

    // const obj = {};
    // this.stnSvc.getFare(obj)
    // .then((result)=>{
    //   console.log('getFares: ',result);
    // })
    // .catch((err)=>{
    //   console.log('getFares: ',err);
    // })
  }

  goToHome(){
    this.router.navigate(['/']);
  }

}
