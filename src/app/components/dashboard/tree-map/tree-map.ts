import { Component, Input, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as Highcharts from 'highcharts';
import { HighchartsChartComponent } from 'highcharts-angular';

@Component({
  selector: 'app-tree-map',
  imports: [HighchartsChartComponent, CommonModule],
  templateUrl: './tree-map.html',
  styleUrl: './tree-map.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TreeMap implements OnInit {
  @Input() regionsData: any[] = [];
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};

  ngOnInit(): void {
    this.initChart();
  }
  initChart(): void {
    const randomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16);
    const colors = Highcharts.getOptions().colors!;
    const seriesData = this.regionsData.map((item, i) => ({
      name: item.region,
      value: item.count,
      color: colors[i % colors.length] // cycle through Highcharts palette
    }));
    this.chartOptions = {
      legend: {
        enabled: false // completely hides the legend
      },
      series: [{
        type: 'treemap',
        layoutAlgorithm: 'squarified',
        data: seriesData,
        name: 'Regions',
        colorByPoint: true,
        dataLabels: {
          enabled: true,
          useHTML: true, crop: true,allowOverlap: false,
          style: {
            fontSize: '12px',
            textOutline: 'none'
          },
          formatter: function () {
            return `
            <div style="text-align:center;">
              <span style="font-size:12px; display:block;">
                ${this.name}
              </span>
              <span style="font-size:16px;">
                ${this.value}
              </span>
            </div>
          `;
          }
        }
      }],
      title: undefined,
      tooltip: {
        enabled: true
      }
    };
  }

}
