import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable()
export class EventLogsService {
  env : string = '';
  url : string = '';
  constructor(private http : HttpClient) {
    this.env = (<HTMLInputElement>document.getElementById('env')).value;
    if(this.env === 'beta'){
      this.url = 'https://iclicker-dev-inst-analytics.macmillanlearning.com/'
    }
    else{
      this.url = 'https://iclicker-prod-inst-analytics.macmillanlearning.com/'
    }
   }

   logEvents(data){
    const headers = new HttpHeaders({
      'content-type': 'application/x-www-form-urlencoded',
    });
    let analytic_log = {"log_event":{"ANALYTIC_LOG" : data}}
     return this.http.post(this.url + 'log-event/',analytic_log, {headers})
   }


}
