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

  totalConfirmedPrev = 0;
  totalActivePrev = 0;
  totalDeathsPrev = 0;
  totalRecoveredPrev = 0;

  globalData : GlobalDataSummary[] ;
  globalDataPrev : GlobalDataSummary[] ;
  dataTable = [];
  dataTableSecond = [];
  chartSecondHeader : string = "Confirmed Cases";

  chart = {
    PieChart : "PieChart",
    ColumnChart : "ColumnChart",
    height : 100,
    dynamicResize: true,
    chartColumns : ['Country', 'Persons'],
    options : {
      animation : {
        duration : 1000,
        easing : 'out',        
      },
      is3D: true,
    },
    optionSecond : {
      animation : {
        duration : 1000,
        easing : 'out',        
      },
      is3D: true,
      colors: ['#007bff'],
    }

  }

  
  
  userFilter: string;
  
  constructor(private dataService : DataServiceService) { }

  ngOnInit(): void {
    
    this.getCurrentData();
    this.getPreviousMonthData();

    //DataTables
    $('#dtTable').DataTable({
      "paging": false // false to disable pagination (or any other option)
    });
    $('.dataTables_length').addClass('bs-select');
  }

  initChart(caseType : string){

    this.dataTable = [];
    this.dataTableSecond = [];
    
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

    // For Second Chart

    let tempGlobalData = this.globalData;
    if(caseType == 'c'){
        tempGlobalData.sort((a, b) => b.confirmed - a.confirmed);
        this.chart.optionSecond.colors = ['#007bff'];
        this.chartSecondHeader = "Confirmed Cases";
    }
      
    if(caseType == 'a'){
      tempGlobalData.sort((a, b) => b.active - a.active);
      this.chart.optionSecond.colors = ['#ffc107'];
      this.chartSecondHeader = "Active Cases";
    }
      
    if(caseType == 'r'){
      tempGlobalData.sort((a, b) => b.recovered - a.recovered);
      this.chart.optionSecond.colors = ['#28a745'];
      this.chartSecondHeader = "Reovered Cases";
    }
      
    if(caseType == 'd'){
      tempGlobalData.sort((a, b) => b.deaths - a.deaths);
      this.chart.optionSecond.colors = ['#dc3545'];
      this.chartSecondHeader = "Total Deaths";
    }
      
      
    var topValues = tempGlobalData.slice(0,5);
      topValues.forEach(tgd => {
        let value : number;
        if(caseType == 'c'){
            value = tgd.confirmed;
        }
          
        if(caseType == 'a'){
            value = tgd.active;
        }
          
        if(caseType == 'r'){
            value = tgd.recovered;
        }
          
        if(caseType == 'd'){
            value = tgd.deaths;
        }
        this.dataTableSecond.push([tgd.country, value]);
        console.log(this.chart.optionSecond);

      })



    
  }

  updateChart(input : HTMLInputElement){
    console.log(input.value);
    this.initChart(input.value);
  }

  getCurrentData(){
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

  getPreviousMonthData(){
    this.dataService.getGlobalDataPreviosMonth().subscribe((resultNew) => {
        console.log(resultNew);
        resultNew.forEach(cs => {
          if(!Number.isNaN(cs.confirmed)){
            this.totalConfirmedPrev += cs.confirmed;
            this.totalActivePrev += cs.active;
            this.totalDeathsPrev += cs.deaths;
            this.totalRecoveredPrev += cs.recovered;
          }          
        })
      }      
    )
  }
}
