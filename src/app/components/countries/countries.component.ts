import { Component, OnInit } from '@angular/core';
import { DataServiceService } from 'src/app/services/data-service.service';
import { GlobalDataSummary } from 'src/app/models/global-data';
import { DateWiseData } from 'src/app/models/date-wise-data';
declare var $ : any;

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {

  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;

  dateWiseData;
  selectedCountryData : DateWiseData[];
  data : GlobalDataSummary[];
  constructor(private service : DataServiceService) { }
  countries : string[] = [];
  countryData : GlobalDataSummary;
  ngOnInit(): void {

    this.service.getDateWiseData().subscribe(result => {
      this.dateWiseData = result;
      console.log(result)
    });

    this.service.getGlobalData().subscribe(result => {
      this.data = result;
      this.data.forEach(cs =>{
        if(!Number.isNaN(cs.confirmed)){
          this.countries.push(cs.country);
        }       
      })
    })
  }

  updateValues(country){
    this.data.forEach(cs => {
      if(cs.country == country){
        this.totalActive = cs.active;
        this.totalConfirmed = cs.confirmed;
        this.totalDeaths = cs.deaths;
        this.totalRecovered = cs.recovered;
      }
    })
    $(".counter-box").counterUp({delay : 10, time: 1000})
    this.selectedCountryData = this.dateWiseData[country];
  }
}
