import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit } from '@angular/core';
import { HighchartsChartComponent } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import africaMap from '@highcharts/map-collection/custom/africa.topo.json';
import { preprocessMapData } from '../../map-preprocessor';

@Component({
  selector: 'app-africa-map',
  imports: [HighchartsChartComponent],
  templateUrl: './africa-map.html',
  styleUrl: './africa-map.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AfricaMap implements OnInit {
  @Input() mapData: any;
  chartOptions: Highcharts.Options = {};
  mapChartOptions: any;
  Highcharts: typeof Highcharts = Highcharts;

  ngOnInit(): void {
    const processedMapData = preprocessMapData(this.mapData).map(item => ({
      ...item,
      value: item.value === 0 ? null : item.value
    }));
    this.mapChartOptions = {
      chart: {
        map: africaMap
      },
      legend: {
        enabled: false // completely hides the legend
      },
      title: undefined,
      mapNavigation: {
        enabled: true,
        buttonOptions: {
          verticalAlign: 'bottom'
        }
      },
      colorAxis: {
        min: 1,
        minColor: '#F7C57E',   // very light orange
        maxColor: '#E65100'    // deep orange
      },
      series: [{
        data: processedMapData,
        name: '',
        nullColor: '#ffffff',  // makes null/0 values white
        states: {
          hover: {
            color: '#BADA55',
            dataLabels: {
              enabled: true,  // show country name only when hovered
              format: '{point.name}', // display country name
              style: { fontWeight: 'bold', textOutline: 'none' }
            }
          }
        },
        dataLabels: false,
        tooltip: {
          headerFormat: '',
          pointFormat: '{point.name}: {point.value}'
        }
      }]
    }
  }

}
