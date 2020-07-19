import { Component, OnInit } from '@angular/core';
import { DataServiceService } from 'src/app/services/data-service.service';
import { GlobalDataSummary } from 'src/app/models/global-data';
declare var $ : any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  globalData : GlobalDataSummary[] ;
  dataTable = [];

  chart = {
    PieChart : "PieChart",
    ColumnChart : "ColumnChart",
    height : 100,
    dynamicResize: true,
    options : {
      animation : {
        duration : 1000,
        easing : 'out',        
      },
      is3D: true,
    }
  }
  

  
  constructor(private dataService : DataServiceService) { }

  ngOnInit(): void {
    this.dataService.getGlobalData().subscribe({
      next : (result) => {
        console.log(result);
        this.globalData = result;
        result.forEach(cs => {
          if(!Number.isNaN(cs.confirmed)){
            this.totalConfirmed += cs.confirmed;
            this.totalActive += cs.active;
            this.totalDeaths += cs.deaths;
            this.totalRecovered += cs.recovered;
          }          
        })
        $(".counter-box").counterUp({delay : 10, time: 1000})
        this.initChart('c');
      }      
    })    
  }

  initChart(caseType : string){

    this.dataTable = [];
    
    //this.dataTable.push(["Country", "Cases"]);
    
    this.globalData.forEach(cs =>{
      let value : number;

        if(caseType == 'c'){
          if(cs.confirmed > 20000)
            value = cs.confirmed;
        }
          
        if(caseType == 'a'){
          if(cs.active > 10000)
            value = cs.active;
        }
          
        if(caseType == 'r'){
          if(cs.recovered > 10000)
            value = cs.recovered;
        }
          
        if(caseType == 'd'){
          if(cs.deaths > 10000)
            value = cs.deaths;
        }

        this.dataTable.push([cs.country, value]);       
    })


    
  }

  updateChart(input : HTMLInputElement){
    console.log(input.value);
    this.initChart(input.value);
  }
}
