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
  loader: boolean = true;

  ngOnInit(){
    const CLICKER_SHOW_PAYMENT_GATEWAY = 265;
    const CLICKER_STUDENTID_CLICKERID_MATCH = 255;
    const CLICKER_STUDENTNAME_CLICKERID_MATCH = 260;
    const CLICKER_NEW_REGISTRATION = 250;

    this.commonService.getCountryList().subscribe(resp =>{
      this.countries = resp;
      this.searchClicker()
    })
  }

  searchClicker(clicker?){
    if(!clicker && localStorage.getItem('initData')){
      const initData = JSON.parse(localStorage.getItem('initData'))
      this.emailId = initData['email_id']
      this.firstName = initData['firstName']
      this.lastName = initData['lastName']
      this.addURL = initData['addUrl']
      this.studentId = initData['student_id']
      if(initData['countryCode']){
        this.country = _.find(this.countries, (item)=>{
          return item.countryCode === initData['countryCode']
        })
      }
      this.commonService.searchClickers(initData).subscribe(resp=>{
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
    this.commonService.removeClicker(clicker).subscribe(resp=>{
      this.searchClicker()
    })
  }
  register(){
    this.loader = true;
    const data = {'lastName' : this.lastName, 'clickerId' : this.clickerId.toUpperCase(),
                  'email' : this.emailId, 'addURL': this.addURL,
                'countryCode' : this.country.countryCode, 'firstName' : this.firstName,
              'studentId' : this.studentId}
    this.commonService.doesClickerExist(data).subscribe(resp =>{
      if(resp['code'] == 422){
        alert("Remote ID entered is invalid. Make sure that you entered the correct 8-character code. Code entry is restricted to letters A-F and numbers 0-9");
        this.loader = false;
        return
      }
      if(resp['status'] === 265 || resp['status'] === 250 ){
        this.commonService.registerClicker(data).subscribe(resp =>{
          const data = {'student_id' : resp['studentId'],'email_id' : resp['email'], 'addUrl': resp['addURL']}
          this.searchClicker(data)
          console.log(resp);
        })
      }
      else{
        data['id'] = resp['id']
        this.commonService.updateClicker(data).subscribe(resp =>{
          const data = {'student_id' : resp['studentId'],'email_id' : resp['email'], 'addUrl': resp['addURL']}
          this.searchClicker(data)
          console.log(resp);
        },
        (err) => {
          this.loader = false;
        })
      }
    })

  }
}
