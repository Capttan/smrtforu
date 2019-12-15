import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StationService {
 

  constructor(private http: HttpClient) {}

  // get train timings for current station
  getTiming(id:string): Promise<any>{

    const url = '/timing';

    const dataObj = {
      message: 'ok'
    }; 

    const options = {
      params: {
        stn: id
      }
    };


    return this.http.get(url,options).toPromise();
  }

  // get train fares to/from current station
  getFare(formObj): Promise<any>{
    const url = '/fare';

    const dataObj = formObj;

    const options = {
    };


    // return this.http.get(url,options).toPromise();
    return this.http.post(url,dataObj).toPromise();
    // return this.http.post(url,options,dataObj).toPromise();
  }

  // get nearest station and directions on foot
  getStation(posObj): Promise<any>{
    // const url = '/station';

    const url = '/getmap';

    const dataObj = posObj;

    console.log(dataObj);

    const options = {
    };


    return this.http.post(url,dataObj).toPromise();
    // return this.http.post(url,options,dataObj).toPromise();
  }
}
