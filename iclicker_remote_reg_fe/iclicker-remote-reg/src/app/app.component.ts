import { Component, OnInit } from '@angular/core';
import { CommonService } from './common.service';
import * as _ from 'lodash';
import { DatePipe } from '@angular/common'
import { CommonLogParams } from './common-log-params';
import { EventLogsService } from './event-logs.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  constructor(private commonService : CommonService,
    private date : DatePipe,
    private eventLogsServ : EventLogsService){}

  countries :any = [];
  country : any = {"countryCode":"USA","countryName":"United States","showSeq":100}
  clickerRegs : any = [];
  emailId : any = '';
  clickerId : any = '';
  firstName : any = '';
  lastName : any = '';
  addURL : any = '';
  env : any = '';
  context_id : any = '';
  studentId : any = '';
  countryCode : any = '';
  loader: boolean = true;
  show_be_error : boolean = false;
  disableRegButtonPerm : boolean = false;
  commonLogParams : any = {};
  referral_event_type : any = '';
  referral_event_id : any = '';
  ngOnInit(){
    this.commonLogParams = new CommonLogParams;
    
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
    this.env = (<HTMLInputElement>document.getElementById('env')).value
    this.context_id = (<HTMLInputElement>document.getElementById('context_id')).value
    this.commonLogParams['log_type'] = 'iclicker_remote_reg_view';
    this.commonLogParams = Object.assign({
      'referralUrl' : document.referrer,
      'userId' : this.studentId,
      'courseId' : this.context_id,
      'event_id' : this.generateId(32),
      'referral_event_id' : this.referral_event_id,
      'referral_event_type' : this.referral_event_type
    }, this.commonLogParams)
    this.eventLogsServ.logEvents(this.commonLogParams).subscribe((resp)=>{
      this.referral_event_type = resp[0]['ANALYTIC_LOG']['referral_event_id']
      this.referral_event_id = resp[0]['ANALYTIC_LOG']['referral_event_type']
    })
    if(!this.firstName || !this.lastName || !this.studentId){
      this.disableRegButtonPerm = true;
      this.commonLogParams['log_type'] = 'iclicker_remote_reg_incomplete_info_v';
      this.commonLogParams = Object.assign({
        'event_id' : this.generateId(32)
      }, this.commonLogParams)
      this.eventLogsServ.logEvents(this.commonLogParams).subscribe((resp)=>{

      })
    }
  }

  generateId(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }
  searchClicker(clicker?){
    if(!clicker){
      if(this.countryCode){
        this.country = _.find(this.countries, (item)=>{
          return item.countryCode === this.countryCode
        })
      }
      this.commonService.searchClickers({'student_id' : this.studentId, 'email_id' : this.emailId, 'addUrl' : this.addURL}).subscribe(resp=>{
        if(resp['code'] !== 422){
          this.clickerRegs = _.filter(resp, (item) => !item.disableFlag)
          this.clickerRegs = _.each(this.clickerRegs, (clicker) => {
            if(clicker.dateAdded && clicker.dateAdded.length>10){
              //clicker.dateAdded = clicker.dateAdded.substring(0,10)
              clicker.dateAdded = this.date.transform(clicker.dateAdded, 'MMM-dd-yyyy')
            }
          })
        }
        this.loader = false;
      },
      (err) => {
        this.loader = false;
      })
    }
    else{
      this.commonService.searchClickers(clicker).subscribe((resp) => {
        if(resp['code'] !== 422){
          this.clickerRegs = _.filter(resp, (item) => !item.disableFlag)
          this.clickerRegs = _.each(this.clickerRegs, (clicker) => {
            if(clicker.dateAdded && clicker.dateAdded.length>10){
                //clicker.dateAdded = clicker.dateAdded.substring(0,10)
                clicker.dateAdded = this.date.transform(clicker.dateAdded, 'MMM-dd-yyyy')
            }
          })
        }
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
    this.commonLogParams['remoteId'] = clicker.clickerId;
    this.commonLogParams['log_type'] = 'iclicker_remote_reg_action';
    this.commonLogParams['action_type'] = 'REMOVE';
    this.commonLogParams['event_id'] = this.generateId(32);
    this.commonLogParams = Object.assign({
      'userId' : this.studentId,
      'referral_event_id' : this.referral_event_id,
      'referral_event_type' : this.referral_event_type
    }, this.commonLogParams)
    this.eventLogsServ.logEvents(this.commonLogParams).subscribe((resp)=>{

    })
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
        this.commonLogParams['remoteId'] = this.clickerId;
        this.commonLogParams['log_type'] = 'iclicker_remote_reg_incorrect_info_view';
        this.commonLogParams['event_id'] = this.generateId(32);
        this.commonLogParams = Object.assign({
          'userId' : this.studentId,
          'referral_event_id' : this.referral_event_id,
          'referral_event_type' : this.referral_event_type
        }, this.commonLogParams)
        this.eventLogsServ.logEvents(this.commonLogParams).subscribe((resp)=>{
    
        })
        this.show_be_error = true;
        this.loader = false;
        return
      }
      if(resp['status'] === 265 || resp['status'] === 250 ){
        this.commonLogParams['event_id'] = this.generateId(32);
        this.commonLogParams['remoteId'] = this.clickerId;
        this.commonLogParams['log_type'] = 'iclicker_remote_reg_incorrect_info_view';
        this.commonLogParams['action_type'] = 'REGISTER'
        this.commonLogParams = Object.assign({
          'userId' : this.studentId,
          'referral_event_id' : this.referral_event_id,
          'referral_event_type' : this.referral_event_type
        }, this.commonLogParams)
        this.eventLogsServ.logEvents(this.commonLogParams).subscribe((resp)=>{
    
        })
        this.commonService.registerClicker(data).subscribe(resp =>{
          const data = {'student_id' : resp['studentId'],'email_id' : resp['email'], 'addUrl': resp['addURL']}
          this.searchClicker(data)
        })
      }
      else{
        this.commonLogParams['remoteId'] = this.clickerId;
        this.commonLogParams['log_type'] = 'iclicker_remote_reg_action';
        this.commonLogParams['action_type'] = 'UPDATE';
        this.commonLogParams['event_id'] = this.generateId(32);
        this.commonLogParams = Object.assign({
          'userId' : this.studentId,
          'referral_event_id' : this.referral_event_id,
          'referral_event_type' : this.referral_event_type
        }, this.commonLogParams)
        this.eventLogsServ.logEvents(this.commonLogParams).subscribe((resp)=>{
    
        })
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

  countryDisplay(coun) {
    return _.find(this.countries,(country) => country.countryCode === coun)
  }

  logAccordion(target, index) {
    this.commonLogParams['remoteId'] = this.clickerId;
    this.commonLogParams['faqItem'] = index;
    this.commonLogParams['log_type'] = 'iclicker_remote_reg_action';
    this.commonLogParams['action_type'] = 'FAQ_CLICK';
    this.commonLogParams['event_id'] = this.generateId(32);
    this.commonLogParams = Object.assign({
      'userId' : this.studentId,
      'referral_event_id' : this.referral_event_id,
      'referral_event_type' : this.referral_event_type
    }, this.commonLogParams)
    this.eventLogsServ.logEvents(this.commonLogParams).subscribe((resp)=>{

    })
  }

  logEventSupport(index){
    this.commonLogParams['faqItem'] = index;
    this.commonLogParams['log_type'] = 'iclicker_remote_reg_faq_item_action';
    this.commonLogParams['action_type'] = 'SUPPORT_LINK_CLICK';
    this.commonLogParams['event_id'] = this.generateId(32);
    this.commonLogParams = Object.assign({
      'userId' : this.studentId,
      'referral_event_id' : this.referral_event_id,
      'referral_event_type' : this.referral_event_type
    }, this.commonLogParams)
    this.eventLogsServ.logEvents(this.commonLogParams).subscribe((resp)=>{

    })
  }
}
