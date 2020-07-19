import { Component, OnInit, Input } from '@angular/core';
declare var $ : any;

@Component({
  selector: 'app-dashboard-card',
  templateUrl: './dashboard-card.component.html',
  styleUrls: ['./dashboard-card.component.css']
})
export class DashboardCardComponent implements OnInit {
  @Input("totalConfirmed") totalConfirmed
  @Input("totalActive") totalActive
  @Input("totalDeaths") totalDeaths
  @Input("totalRecovered") totalRecovered
  @Input("totalConfirmedPrev") totalConfirmedPrev
  @Input("totalActivePrev") totalActivePrev
  @Input("totalDeathsPrev") totalDeathsPrev
  @Input("totalRecoveredPrev") totalRecoveredPrev
  
  constructor() { }

  ngOnInit(): void {
    // $(".counter-box").counterUp({delay : 10, time: 1000})
  }

}
