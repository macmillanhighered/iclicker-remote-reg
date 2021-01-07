import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from './../environments/environment';
@Injectable()
export class CommonService {

  constructor(private http : HttpClient) { }


  searchClickers(data) {
    return this.http.post('/search-clickers', {
      "student_id": data['student_id'],
      "email_id": data['email_id'],
      "addURL": data['addUrl'],
      "lastName": null});
  }

  getCountryList() {
    return this.http.get('/get-country-list')
  }

  removeClicker(data){
    return this.http.post('/remove-clicker', {
      "student_id": data['studentId'],
      "email_id": data['email'],
      "addURL": data['addURL'],
      "clickerId": data['clickerId'].toUpperCase()});
  }

  registerClicker(data){
    return this.http.post('/add-clicker', data);
  }

  doesClickerExist(data){
    return this.http.post('/does-clicker-exist', data);
  }
  updateClicker(data){
    return this.http.post('/update-clicker', data);
  }
}
