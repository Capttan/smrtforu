import { Component, OnInit } from '@angular/core';
import { StationService } from '../services/station.service';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { NgForm, NgModel, FormControl, Validators, FormGroup } from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

export interface State {
  flag: string;
  name: string;
  population: string;
}

export interface Station {
  id: string;
  stn: string;
  design: number;
  lat: number;
  lon: number;
}

@Component({
  selector: 'app-autocomp',
  templateUrl: './autocomp.component.html',
  styleUrls: ['./autocomp.component.css']
})
export class AutocompComponent implements OnInit {

  stations: Station[] = [
    {id:"ADM",stn:"Admiralty",design:44,lat:1.4406,lon:103.8010},
    {id:"ALJ",stn:"Aljunied",design:34,lat:1.3164,lon:103.8828},
    {id:"AMK",stn:"Ang Mo Kio",design:2,lat:1.3700,lon:103.8496},
    {id:"CBLY",stn:"Bartley",design:205,lat:1.3429,lon:103.8796},
    {id:"CBFT",stn:"Bay Front",design:229,lat:1.2813,lon:103.8590},
    {id:"BDK",stn:"Bedok",design:38,lat:1.3240,lon:103.9302},
    {id:"CBSH",stn:"Bishan",design:3,lat:1.3508,lon:103.8482},
    {id:"BNL",stn:"​Boon Lay",design:27,lat:1.3386,lon:103.7058},
    {id:"CBTN",stn:"Botanic Gardens",design:217,lat:1.3223,lon:103.8149},
    {id:"BDL",stn:"Braddell",design:4,lat:1.3405,lon:103.8471},
    {id:"CBBS",stn:"Bras Basah",design:215,lat:1.2969,lon:103.8507},
    {id:"BGS",stn:"Bugis",design:31,lat:1.3007,lon:103.8559},
    {id:"BBT",stn:"Bukit Batok",design:28,lat:1.3491,lon:103.7496},
    {id:"BGB",stn:"Bukit Gombak",design:29,lat:1.3589,lon:103.7518},
    {id:"CBNV",stn:"Buona Vista",design:20,lat:1.3073,lon:103.7901},
    {id:"CCDT",stn:"Caldecott",design:216,lat:1.3376,lon:103.8396},
    {id:"CBR",stn:"Canberra",design:73,lat:1.4431,lon:103.8297},
    {id:"CGA",stn:"Changi Airport",design:65,lat:1.3576,lon:103.9885},
    {id:"CNG",stn:"Chinese Garden",design:25,lat:1.3424,lon:103.7326},
    {id:"CCK",stn:"Choa Chu Kang",design:30,lat:1.3854,lon:103.7443},
    {id:"CTH",stn:"City Hall",design:11,lat:1.2931,lon:103.8521},
    {id:"CLE",stn:"Clementi",design:21,lat:1.3162,lon:103.7649},
    {id:"COM",stn:"Commonwealth",design:19,lat:1.3024,lon:103.7983},
    {id:"CDKT",stn:"Dakota",design:209,lat:1.3084,lon:103.8888},
    {id:"CDBG",stn:"Dhoby Ghaut",design:10,lat:1.2991,lon:103.8458},
    {id:"DVR",stn:"Dover",design:64,lat:1.3114,lon:103.7786},
    {id:"CEPN",stn:"Esplanade",design:214,lat:1.2939,lon:103.8554},
    {id:"EUN",stn:"Eunos",design:36,lat:1.3197,lon:103.9029},
    {id:"XPO",stn:"Expo",design:63,lat:1.3344,lon:103.9615},
    {id:"CFRR",stn:"Farrer Road",design:218,lat:1.3176,lon:103.8077},
    {id:"GCL",stn:"GUL Circle",design:69,lat:1.3212,lon:103.6657},
    {id:"CHBF",stn:"HarbourFront",design:116,lat:1.2656,lon:103.8209},
    {id:"CHPV",stn:"Haw Par Villa",design:223,lat:1.2831,lon:103.7820},
    {id:"CHLV",stn:"Holland Village",design:219,lat:1.3111,lon:103.7961},
    {id:"JKN",stn:"Joo Koon",design:67,lat:1.3278,lon:103.6783},
    {id:"JUR",stn:"Jurong East",design:24,lat:1.3331,lon:103.7421},
    {id:"KAL",stn:"Kallang",design:33,lat:1.3115,lon:103.8714},
    {id:"KEM",stn:"Kembangan",design:37,lat:1.3210,lon:103.9129},
    {id:"CKRG",stn:"Kent Ridge",design:222,lat:1.2936,lon:103.7845},
    {id:"KTB",stn:"Khatib",design:23,lat:1.4173,lon:103.8330},
    {id:"KRJ",stn:"Kranji",design:47,lat:1.4252,lon:103.7620},
    {id:"CLBD",stn:"Labrador Park",design:225,lat:1.2721,lon:103.8026},
    {id:"LKS",stn:"Lakeside",design:26,lat:1.3442,lon:103.7208},
    {id:"LVR",stn:"Lavendar",design:32,lat:1.3074,lon:103.8628},
    {id:"CLRC",stn:"Lorong Chuan",design:203,lat:1.351636,lon:103.864064},
    {id:"CMPS",stn:"MacPherson",design:207,lat:1.3267,lon:103.8899},
    {id:"CMRB",stn:"Marina Bay",design:13,lat:1.2723,lon:103.8528},
    {id:"MSP",stn:"Marina South Pier",design:68,lat:1.2714,lon:103.8636},
    {id:"MSL",stn:"Marsiling",design:46,lat:1.4326,lon:103.7742},
    {id:"CMRM",stn:"Marymount",design:205,lat:1.3490,lon:103.8391},
    {id:"CMBT",stn:"Mountbatten",design:210,lat:1.3061,lon:103.8832},
    {id:"NEW",stn:"Newton",design:7,lat:1.3138,lon:103.8380},
    {id:"CNCH",stn:"Nicoll Highway",design:212,lat:1.3002,lon:103.8635},
    {id:"NOV",stn:"Novena",design:6,lat:1.3200,lon:103.8434},
    {id:"CONH",stn:"One-North",design:221,lat:1.2998,lon:103.7876},
    {id:"ORC",stn:"Orchard",design:8,lat:1.3040,lon:103.8318},
    {id:"OTP",stn:"Outram Park",design:15,lat:1.2803,lon:103.8403},
    {id:"CPPJ",stn:"Pasir Panjang",design:224,lat:1.2761,lon:103.7919},
    {id:"PSR",stn:"Pasir Ris",design:42,lat:1.3732,lon:103.9494},
    {id:"CPYL",stn:"Paya Lebar",design:35,lat:1.3182,lon:103.8931},
    {id:"PNR",stn:"Pioneer",design:66,lat:1.3376,lon:103.6974},
    {id:"CPMN",stn:"Promenade",design:213,lat:1.2940,lon:103.8602},
    {id:"QUE",stn:"Queenstown",design:18,lat:1.2948,lon:103.8059},
    {id:"RFP",stn:"Raffles Place",design:12,lat:1.2830,lon:103.8513},
    {id:"RDH",stn:"Redhill",design:17,lat:1.2896,lon:103.8168},
    {id:"SBW",stn:"Sembawang",design:43,lat:1.4491,lon:103.8200},
    {id:"CSER",stn:"Serangoon",design:106,lat:1.3498,lon:103.8736},
    {id:"SIM",stn:"Simei",design:40,lat:1.3432,lon:103.9534},
    {id:"SOM",stn:"Somerset",design:9,lat:1.3003,lon:103.8367},
    {id:"CSDM",stn:"Stadium",design:211,lat:1.3028,lon:103.8754},
    {id:"CTSG",stn:"Tai Seng",design:206,lat:1.3359,lon:103.8877},
    {id:"TAM",stn:"Tampines",design:41,lat:1.3544,lon:103.9433},
    {id:"TNM",stn:"Tanah Merah",design:39,lat:1.3272,lon:103.9465},
    {id:"TPG",stn:"Tanjong Pagar",design:14,lat:1.2763,lon:103.8468},
    {id:"CTLB",stn:"Telok Blangah",design:226,lat:1.2707,lon:103.8099},
    {id:"TIB",stn:"Tiong Bahru",design:16,lat:1.2865,lon:103.8270},
    {id:"TAP",stn:"Toa Payoh",design:5,lat:1.3323,lon:103.8474},
    {id:"TCR",stn:"Tuas Crescent",design:70,lat:1.3310,lon:103.6547},
    {id:"TLK",stn:"Tuas Link",design:72,lat:1.3403,lon:103.6368},
    {id:"TWR",stn:"Tuas West Road",design:71,lat:1.3300,lon:103.6396},
    {id:"WDL",stn:"Woodlands",design:45,lat:1.4369,lon:103.7864},
    {id:"YWT",stn:"Yew Tee",design:48,lat:1.3973,lon:103.7475},
    {id:"YCK",stn:"Yio Chu Kang",design:1,lat:1.3817,lon:103.8449},
    {id:"YIS",stn:"Yishun",design:22,lat:1.4295,lon:103.8350}
  ];



  // profileForm = this.fb.group({
  //   name: ['Station', [Validators.required]], //initial value,sync validators,async validators
  // });

  

  // stateCtrl = new FormControl('Station',Validators.required);
stationForm = new FormGroup({
    startCtrl: new FormControl('',Validators.required),
    endCtrl: new FormControl('',Validators.required)
  });

  // stateCtrl = new FormControl('',Validators.required);
  filteredStart: Observable<Station[]>;

  // stationCtrl = new FormControl('',Validators.required);
  filteredEnd: Observable<Station[]>;

  states: State[] = [
    {
      name: 'Arkansas',
      population: '2.978M',
      // https://commons.wikimedia.org/wiki/File:Flag_of_Arkansas.svg
      flag: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Flag_of_Arkansas.svg'
    },
    {
      name: 'California',
      population: '39.14M',
      // https://commons.wikimedia.org/wiki/File:Flag_of_California.svg
      flag: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Flag_of_California.svg'
    },
    {
      name: 'Florida',
      population: '20.27M',
      // https://commons.wikimedia.org/wiki/File:Flag_of_Florida.svg
      flag: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Florida.svg'
    },
    {
      name: 'Texas',
      population: '27.47M',
      // https://commons.wikimedia.org/wiki/File:Flag_of_Texas.svg
      flag: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Texas.svg'
    }
  ];





  constructor(private stnSvc: StationService, private router: Router) { 
    this.filteredStart = this.stationForm.controls.startCtrl.valueChanges
    .pipe(
      startWith(''),
      map(station => station ? this._filterStations(station) : this.stations.slice())
      // map(state => { console.log(typeof(state)); return state;})
      // map(state => state)
    );

    this.filteredEnd = this.stationForm.controls.endCtrl.valueChanges
    .pipe(
      startWith(''),
      map(station => station ? this._filterStations(station) : this.stations.slice())
      // map(station => { console.log(typeof(station)); return station;})
      // map(state => state)
    );
  }

  ngOnInit() {
  }


  // private _filterStates(value: string): State[] {
  //   const filterValue = value.toLowerCase();

  //   return this.states.filter(state => state.name.toLowerCase().indexOf(filterValue) === 0);
  // }

  private _filterStations(value: string): Station[] {
    const filterValue = value.toLowerCase();

    return this.stations.filter(station => station.stn.toLowerCase().indexOf(filterValue) === 0);
  }

  // processStnForm(form: NgForm){
  //   const value = form.value;
  //   console.log('value: ', value)
  // }

  processStnForm(){
    // console.log(this.stationForm['stateCtrl']);
    // const value = this.stationForm['stateCtrl'].value;
    // console.log('value: ', value)
    // console.log(this.stationForm['stationCtrl']);
    // const valueStn = this.stationForm['stationCtrl'].value;
    // console.log('valueStn: ', valueStn)

    console.log(this.stationForm);
  }

  // selectStation(id:string){
  //   console.log(id);

  //   this.router.navigate(['/curstn',id]);
  // }

  goToHome(){
    this.router.navigate(['/']);
  }

}
