import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators'
import { GlobalDataSummary } from '../models/global-data';
import { DateWiseData } from '../models/date-wise-data';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  month;
  year;
  day;
  previousMonth;
  private extension = '.csv'
  private globalDataURL = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/';
  private dateWiseDataURL = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv';

  constructor(private http : HttpClient) { 
    let currentDate = new Date();
    this.year = currentDate.getFullYear();
    this.previousMonth  = currentDate.getMonth();
    this.month = currentDate.getMonth() + 1;
    this.day = currentDate.getDate();
  }

  getDate(date : number) : any{
    if(date < 10)
      return '0'+date;
    else
      return date; 
  }

  getDateWiseData(){
    return this.http.get(this.dateWiseDataURL, {responseType : 'text'})
    .pipe(map(result => {
      let rows = result.split('\n');
      let mainData = {};
      let header = rows[0];
      let dates = header.split(/,(?=\S)/);
      dates.splice(0, 4);
      rows.splice(0, 1);
      rows.forEach(row =>{
        let cols = row.split(/,(?=\S)/);
        let con = cols[1];
        cols.splice(0, 4);
        
        mainData[con] = [];
        cols.forEach((value, index)=>{
          let dw : DateWiseData = {
            cases : +value,
            country : con,
            date : new Date(Date.parse(dates[index]))
          }

          mainData[con].push(dw);
        });
      })
    }))
  }

  getGlobalData(){
    let url = this.getURL();
    return this.http.get(url, {responseType : 'text'}).pipe(
      map(result => {
        let data : GlobalDataSummary[] = [];
        let rows = result.split('\n');
        let raw = {};
        rows.splice(0, 1);
        rows.forEach(row => {
          let cols = row.split(/,(?=\S)/);
          //console.log(cols);
          //data.push({
            let cs = {
            country : cols[3],
            confirmed : +cols[7],
            deaths : +cols[8],
            recovered : +cols[9],
            active : +cols[10],
            }
          //})

          let temp : GlobalDataSummary = raw[cs.country];

          if(temp){
            temp.active = cs.active + temp.active;
            temp.confirmed = cs.confirmed + temp.confirmed;
            temp.deaths = cs.deaths + temp.deaths;
            temp.recovered = cs.recovered + temp.recovered;

            raw[cs.country] = temp;
          }
          else{
            raw[cs.country] = cs;
          }
        })

        //console.log(raw);

        return <GlobalDataSummary[]>Object.values(raw);
      }),
      catchError((error : HttpErrorResponse) => {
        if(error.status == 404){
          if((this.day)-1 > 0){
            this.day = this.day - 1;
            return this.getGlobalData();
          }
          else{
            this.month = this.month -1 ;
            return this.getGlobalData();
          }
        }
      })
    )
  }

  getURL() : string{
    let url = `${this.globalDataURL}${this.getDate(this.month)}-${this.getDate(this.day)}-${this.year}${this.extension}`;
    console.log(url);
    return url;
  }

  getURLPrevMonth() : string{
    let url = `${this.globalDataURL}${this.getDate(this.previousMonth)}-${this.getDate(this.day)}-${this.year}${this.extension}`;
    console.log(url);
    return url;
  }

  getGlobalDataPreviosMonth(){
    let url = this.getURLPrevMonth();
    return this.http.get(url, {responseType : 'text'}).pipe(
      map(result => {
        let data : GlobalDataSummary[] = [];
        let rows = result.split('\n');
        let raw = {};
        rows.splice(0, 1);
        rows.forEach(row => {
          let cols = row.split(/,(?=\S)/);
          //console.log(cols);
          //data.push({
            let cs = {
            country : cols[3],
            confirmed : +cols[7],
            deaths : +cols[8],
            recovered : +cols[9],
            active : +cols[10],
            }
          //})

          let temp : GlobalDataSummary = raw[cs.country];

          if(temp){
            temp.active = cs.active + temp.active;
            temp.confirmed = cs.confirmed + temp.confirmed;
            temp.deaths = cs.deaths + temp.deaths;
            temp.recovered = cs.recovered + temp.recovered;

            raw[cs.country] = temp;
          }
          else{
            raw[cs.country] = cs;
          }
        })

        //console.log(raw);

        return <GlobalDataSummary[]>Object.values(raw);
      }),
      catchError((error : HttpErrorResponse) => {
        if(error.status == 404){
          if(this.day-1 > 0){
            this.day = this.day - 1;
            return this.getGlobalDataPreviosMonth();
          }
          else{
            this.previousMonth = this.previousMonth - 1;
            this.day = 31;
          }
        }
      })
    )
  }

}
