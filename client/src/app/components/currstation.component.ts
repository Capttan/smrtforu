import { Component, OnInit } from '@angular/core';
import { StationService } from '../services/station.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SwPush } from '@angular/service-worker';
import { PushNotificationService } from '../services/push-notification.service';

@Component({
  selector: 'app-currstation',
  templateUrl: './currstation.component.html',
  styleUrls: ['./currstation.component.css']
})
export class CurrstationComponent implements OnInit {


  dataObj = [];
  numTable:number=0;
  numRowElements:number=0;
  picURL = 'assets/stn_pics/AMK.jpg';
  



  constructor(private stnSvc: StationService, private router: Router, 
    private actRoute: ActivatedRoute) {}

  // Load the station details upon launch
  ngOnInit() {

    let id = 'AMK';
    if(this.actRoute.snapshot.params.id != '0'){
      id = this.actRoute.snapshot.params.id;
      this.picURL = `assets/stn_pics/${id}.jpg`;
    }

    console.log(this.actRoute.snapshot.params.id);
    this.stnSvc.getTiming(id)
    .then((result)=>{
      console.log('getTiming: ',result);
      // process timetable

      // {
      //   header: [
      //     '&nbsp; NSL in the direction of Jurong East<br><br>',
      //     '<a href="http://journey.smrt.com.sg/journey/station_info/ang mo kio/map/" target="_blank"><b>Click here</b></a> for first train/last train timings.',
      //     '&nbsp; NSL in the direction of Marina South Pier<br><br>',
      //     '<a href="http://journey.smrt.com.sg/journey/station_info/ang mo kio/map/" target="_blank"><b>Click here</b></a> for first train/last train timings.'
      //   ],
      //   ths: [ 'Next MRT', 'Subsequent MRT', 'Next MRT', 'Subsequent MRT' ],
      //   tds: [
      //     '3 min(s)',
      //     '5 min(s)',
      //     'Jurong East',
      //     'Jurong East',
      //     '2 min(s)',
      //     '6 min(s)',
      //     'Marina South Pier',
      //     'Marina South Pier'
      //   ]
      // }

      

      const localObj = result.message.tds;
      // this.dataObj.push(localObj);
      this.dataObj = localObj;

    })
    .catch((err)=>{
      console.log('getTiming: ',err);
    })
  }


  refreshPage(){
    let id = this.actRoute.snapshot.params.id;
    console.log(this.actRoute.snapshot.params.id);
    this.stnSvc.getTiming(id)
    .then((result)=>{
      console.log('getTiming: ',result);
     
      const localObj = result.message.tds;
      // this.dataObj.push(localObj);
      this.dataObj = localObj;

    })
    .catch((err)=>{
      console.log('getTiming: ',err);
    })
  }



  goToHome(){
    this.router.navigate(['/allstn']);
  }

  backgroundImage() {
    if (this.picURL) {
      // return `url("${this.picURL}")`;
      return `url(${this.picURL})`;
      // return `[url(${this.picURL}), linear-gradient(rgba(255,255,255,.5), rgba(255,255,255,.5))]`;
   }
 
   return null
 }

}
