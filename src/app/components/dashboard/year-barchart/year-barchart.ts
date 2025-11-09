import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HighchartsChartComponent } from 'highcharts-angular';


@Component({
  selector: 'app-year-barchart',
  imports: [HighchartsChartComponent],
  templateUrl: './year-barchart.html',
  styleUrl: './year-barchart.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class YearBarchart implements OnInit {
  @Input() yearsChartData: { year: string, count: number }[] = [];
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};
  ngOnInit(): void {
    const categories = this.yearsChartData.map(item => item.year);
    const seriesData = this.yearsChartData.map(item => item.count);

    this.chartOptions = {
      chart: {
        type: 'column'
      },
      legend:{enabled:false},
      title: undefined,
      xAxis: {
        categories: categories,
        title: { text: 'Year' }
      },
      yAxis: {
        min: 0,
        title: { text: 'Events Count' }
      },
      series: [{
        name: 'Count',
        type: 'column',
        data: seriesData,
        color: '#1976d2'   // Use your preferred palette here
      }]
    };
  }
}
