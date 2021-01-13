import { Component, OnInit } from '@angular/core';
import { CommonService } from './common.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  constructor(private commonService : CommonService){}

  countries :any = [];
  country : any = {"countryCode":"USA","countryName":"United States","showSeq":100}
  clickerRegs : any = [];
  emailId : any = '';
  clickerId : any = '';
  firstName : any = '';
  lastName : any = '';
  addURL : any = '';
  studentId : any = '';
  countryCode : any = '';
  loader: boolean = true;
  show_be_error : boolean = false;
  disableRegButtonPerm : boolean = false;

  ngOnInit(){
    const CLICKER_SHOW_PAYMENT_GATEWAY = 265;
    const CLICKER_STUDENTID_CLICKERID_MATCH = 255;
    const CLICKER_STUDENTNAME_CLICKERID_MATCH = 260;
    const CLICKER_NEW_REGISTRATION = 250;

    this.commonService.getCountryList().subscribe(resp =>{
      this.countries = resp;
      this.searchClicker()
    })
    this.firstName = (<HTMLInputElement>document.getElementById('firstName')).value;
    this.lastName = (<HTMLInputElement>document.getElementById('lastName')).value;
    this.studentId = (<HTMLInputElement>document.getElementById('studentId')).value;
    this.countryCode = (<HTMLInputElement>document.getElementById('countryCode')).value;
    this.emailId = (<HTMLInputElement>document.getElementById('emailId')).value
    this.addURL = (<HTMLInputElement>document.getElementById('addUrl')).value
    if(!this.firstName || !this.lastName || !this.studentId){
      this.disableRegButtonPerm = true;
    }
  }

  searchClicker(clicker?){
    if(!clicker){
      if(this.countryCode){
        this.country = _.find(this.countries, (item)=>{
          return item.countryCode === this.countryCode
        })
      }
      this.commonService.searchClickers({'student_id' : this.studentId, 'email_id' : this.emailId, 'addUrl' : this.addURL}).subscribe(resp=>{
        this.clickerRegs = _.filter(resp, (item) => !item.disableFlag)
        this.clickerRegs = _.each(this.clickerRegs, (clicker) => {
          if(clicker.dateAdded && clicker.dateAdded.length>10){
            clicker.dateAdded = clicker.dateAdded.substring(0,10)
          }
        })
        this.loader = false;
      },
      (err) => {
        this.loader = false;
      })
    }
    else{
      this.commonService.searchClickers(clicker).subscribe((resp) => {
        this.clickerRegs = _.filter(resp, (item) => !item.disableFlag)
        this.clickerRegs = _.each(this.clickerRegs, (clicker) => {
          if(clicker.dateAdded && clicker.dateAdded.length>10){
              clicker.dateAdded = clicker.dateAdded.substring(0,10)
          }
        })
        this.loader = false;
      },
      (err) => {
      this.loader = false;
      })
    }
    this.clickerId = '';
  }
  removeClickerId(clicker){
    this.loader = true;
    this.show_be_error = false;
    this.commonService.removeClicker(clicker).subscribe(resp=>{
      this.searchClicker()
    })
  }
  register(){
    this.loader = true;
    this.show_be_error = false;
    const data = {'lastName' : this.lastName, 'clickerId' : this.clickerId.toUpperCase(),
                  'email' : this.emailId, 'addURL': this.addURL,
                'countryCode' : this.country.countryCode, 'firstName' : this.firstName,
              'studentId' : this.studentId}
    this.commonService.doesClickerExist(data).subscribe(resp =>{
      if(resp['code'] == 422){
        this.show_be_error = true;
        this.loader = false;
        return
      }
      if(resp['status'] === 265 || resp['status'] === 250 ){
        this.commonService.registerClicker(data).subscribe(resp =>{
          const data = {'student_id' : resp['studentId'],'email_id' : resp['email'], 'addUrl': resp['addURL']}
          this.searchClicker(data)
        })
      }
      else{
        data['id'] = resp['id']
        this.commonService.updateClicker(data).subscribe(resp =>{
          const data = {'student_id' : resp['studentId'],'email_id' : resp['email'], 'addUrl': resp['addURL']}
          this.searchClicker(data)
        },
        (err) => {
          this.loader = false;
        })
      }
    })

  }
}
