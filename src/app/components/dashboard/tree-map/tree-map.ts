import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as Highcharts from 'highcharts';
import { HighchartsChartComponent } from 'highcharts-angular';

@Component({
  selector: 'app-tree-map',
  imports: [HighchartsChartComponent, CommonModule],
  templateUrl: './tree-map.html',
  styleUrl: './tree-map.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeMap implements OnInit, OnChanges {
  @Input() regionsData: any[] = [];
  @Output() regionSelected = new EventEmitter<string>();
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};

  ngOnInit(): void {
    this.initChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['regionsData'] && !changes['regionsData'].firstChange) {
      this.initChart();
    }
  }
  initChart(): void {
    const randomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16);
    const colors = Highcharts.getOptions().colors!;
    const seriesData = this.regionsData.map((item, i) => ({
      name: item.region,
      value: item.count,
      color: colors[i % colors.length] // cycle through Highcharts palette
    }));
    const component = this;
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
      },
      plotOptions: {
        series: {
          point: {
            events: {
              click() {
                const name = (this as Highcharts.Point).name;
                if (name) {
                  component.onRegionPointClick(name);
                }
              }
            }
          }
        }
      }
    };
  }

  onRegionPointClick(regionName: string): void {
    this.regionSelected.emit(regionName);
  }

}
