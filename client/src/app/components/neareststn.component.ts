import { Component, OnInit } from '@angular/core';
import { StationService } from '../services/station.service';
import { Router, ActivatedRouteSnapshot } from '@angular/router';

@Component({
  selector: 'app-neareststn',
  templateUrl: './neareststn.component.html',
  styleUrls: ['./neareststn.component.css']
})
export class NeareststnComponent implements OnInit {

  isTracking = false;
  imgBuffer: Buffer = null;
  distStr: string = '';
  durStr: string = '';

  currentLat: any;
  currentLong: any;

  constructor(private stnSvc: StationService, private router: Router) { }

  ngOnInit() {
    // this.stnSvc.getStation()
    // .then((result)=>{
    //   console.log('getStation: ',result);
    // })
    // .catch((err)=>{
    //   console.log('getStation: ',err);
    // })

    // this.findMe();
    this.findNearest();
  }


  findMe() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.showPosition(position);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  showPosition(position) {
    this.currentLat = position.coords.latitude;
    this.currentLong = position.coords.longitude;
  }

  trackMe() {
    if (navigator.geolocation) {
      this.isTracking = true;
      navigator.geolocation.watchPosition((position) => {
        this.showTrackingPosition(position);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  showTrackingPosition(position) {
    console.log(`tracking postion:  ${position.coords.latitude} - ${position.coords.longitude}`);
    this.currentLat = position.coords.latitude;
    this.currentLong = position.coords.longitude;
  }


  findNearest() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        // this.showPosition(position);
        const posObj = {
          lat: position.coords.latitude,
          lon: position.coords.longitude
        };

        console.log(posObj);

        this.stnSvc.getStation(posObj)
        .then((result)=>{
          console.log(result);
          // this.imgBuffer = result.message.data;
          this.imgBuffer = result.message.img;
          this.distStr = result.message.distance;
          this.durStr = result.message.duration;
          // console.log(this.imgBuffer);
        })
        .catch((err)=>{
          console.log(err);
        })
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }



  goToHome(){
    this.router.navigate(['/']);
  }

}
