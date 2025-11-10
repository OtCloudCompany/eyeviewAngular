import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as Highcharts from 'highcharts';
import { HighchartsChartComponent, ChartConstructorType } from 'highcharts-angular';
import { DashboardService } from '../../services/dashboard-service';
import { TreeMap } from "./tree-map/tree-map";
import { SummaryCounts } from "./summary-counts/summary-counts";
import { AfricaMap } from "./africa-map/africa-map";
import { YearBarchart } from "./year-barchart/year-barchart";
import { DashboardActivities } from "./dashboard-activities/dashboard-activities";
import { DashboardFilters } from "./dashboard-filters/dashboard-filters";
import { PaginatedResponse, Activity } from '../../models/records.model';
import { forkJoin, finalize } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HighchartsChartComponent, TreeMap, SummaryCounts, AfricaMap, YearBarchart, DashboardActivities, DashboardFilters],
  templateUrl: './dashboard.html'
})
export class Dashboard implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};
  chartConstructor: ChartConstructorType = 'chart';
  isLoading = true;
  thematicFacets: any[] = [];
  regionsFacets: any[] = [];
  countryFacets: any[] = [];
  directorateFacets: any[] = [];
  yearFacets: any[] = []
  activities: PaginatedResponse<Activity> | null = null;
  summaryCounts = {
    'thematic_areas': 0,
    'countries': 0,
    'regions': 0,
    'directorates': 0,
    'years': 0,
    'activities': 0,
  };
  selectedThematicArea: string | null = null;
  selectedRegion: string | null = null;
  selectedCountry: string | null = null;

  constructor(private dashboardService: DashboardService, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.dashboardService.data$.subscribe( (data) =>{
      if(data){
        this.prepareThematicFacets(data.thematicFacets);
        this.prepareRegionsFacets(data.regionsFacets);
        this.prepareCountryFacets(data.countryFacets);
        this.prepareDirectorateFacets(data.directorateFacets);
        this.prepareYearFacets(data.yearFacets);
        this.prepareActivities(data.activities);
        this.prepareStackedChart(data.stackedCountryFacets);
        this.isLoading = false;
      }
    });
  }

  onThematicAreaClick(facetValue: any) {
    this.selectedThematicArea = facetValue.thematic_area;
    this.selectedRegion = null;
    this.selectedCountry = null;
    this.loadDashboardData({ thematicArea: this.selectedThematicArea, region: null, country: null });
  }

  onRegionClick(regionName: string) {
    this.selectedRegion = regionName;
    this.selectedThematicArea = null;
    this.selectedCountry = null;
    this.loadDashboardData({ region: this.selectedRegion, thematicArea: null, country: null });
  }

  onCountryClick(countryName: string) {
    this.selectedCountry = countryName;
    this.selectedRegion = null;
    this.selectedThematicArea = null;
    this.loadDashboardData({ country: this.selectedCountry, region: null, thematicArea: null });
  }

  private loadDashboardData(filters: { thematicArea: string | null; region: string | null; country: string | null }) {
    this.isLoading = true;
    const normalizedFilters = {
      thematicArea: filters.thematicArea,
      region: filters.region,
      country: filters.country
    };

    forkJoin({
      countryStacks: this.dashboardService.getCountryStacks(normalizedFilters),
      thematicFacets: this.dashboardService.getThematicFacets(normalizedFilters),
      countryFacets: this.dashboardService.getCountryFacets(normalizedFilters),
      regionsFacets: this.dashboardService.getRegionsFacets(normalizedFilters),
      directorateFacets: this.dashboardService.getDirectorateFacets(normalizedFilters),
      yearFacets: this.dashboardService.getYearFacets(normalizedFilters),
      activities: this.dashboardService.getFilteredActivities(normalizedFilters)
    })
      .pipe(finalize(() => { this.isLoading = false; this.cd.markForCheck(); }))
      .subscribe({
        next: (results) => {
          this.dashboardService.setCurrentFilters(normalizedFilters);
          this.dashboardService.setData({
            countryStacks: results.countryStacks,
            stackedCountryFacets: results.countryStacks,
            thematicFacets: results.thematicFacets,
            countryFacets: results.countryFacets,
            regionsFacets: results.regionsFacets,
            directorateFacets: results.directorateFacets,
            yearFacets: results.yearFacets,
            activities: results.activities
          });
        },
        error: (err) => {
          console.error('Error loading dashboard data:', err);
        }
      });
  }

  prepareThematicFacets(data: any[]) {
    this.thematicFacets = data;
    // this.summaryCounts['thematic_areas'] = this.thematicFacets.length;
    this.summaryCounts['thematic_areas'] = (this.thematicFacets || []).filter((facet: any) => (facet?.count ?? 0) > 0).length;
  }
  prepareRegionsFacets(data: any[]) {
    this.regionsFacets = data;
    this.summaryCounts['regions'] = (this.regionsFacets || []).filter((facet: any) => (facet?.count ?? 0) > 0).length;
  }
  prepareCountryFacets(data: any[]) {
    this.countryFacets = data;
    // this.summaryCounts['countries'] = this.countryFacets.length;
    this.summaryCounts['countries'] = (this.countryFacets || []).filter((facet: any) => (facet?.count ?? 0) > 0).length;

  }
  prepareDirectorateFacets(data: any[]) {
    this.directorateFacets = data;
    this.summaryCounts['directorates'] = (this.directorateFacets || []).filter((facet: any) => (facet?.count ?? 0) > 0).length;
  }
  prepareYearFacets(data: any[]) {
    this.yearFacets = data;
    this.summaryCounts['years'] = this.yearFacets.length;
  }
  prepareActivities(data: PaginatedResponse<Activity>) {
    this.activities = data;
    this.summaryCounts['activities'] = this.activities?.count || 0;
  }
  prepareStackedChart(data: { labels: string[], datasets: Array<{ label: string, data: number[] }> }): void {
    
    // The data is already formatted, so we can use it directly
    const countries = data.labels || [];
    const datasets = data.datasets || [];

    // Build series from datasets
    const series: Highcharts.SeriesOptionsType[] = datasets.map((dataset) => ({
      type: 'bar',
      name: dataset.label,
      data: dataset.data,
      stacking: 'normal' as const,
    })) as Highcharts.SeriesOptionsType[];

    // Define how many pixels each bar should take up. Adjust this to your liking.
    const pixelsPerBar = 20;
    // Calculate legend space dynamically based on number of thematic areas
    // Each legend item is approximately 20px tall, and we estimate rows based on items
    const legendItemHeight = 20;
    const itemsPerRow = 4; // Estimate 4 items per row for horizontal layout
    const legendRows = Math.ceil(datasets.length / itemsPerRow);
    const legendSpace = (legendRows * legendItemHeight) + 20; // Space for legend rows + padding
    const axisLabelsSpace = 90; // Space for axis labels and titles
    const chartPadding = legendSpace + axisLabelsSpace;
    // Calculate the total required height, with a minimum height for proper display
    const calculatedHeight = (countries.length * pixelsPerBar) + chartPadding;
    const dynamicChartHeight = Math.max(calculatedHeight, 400); // Minimum height of 400px to accommodate legend


    // Step 4: Define Highcharts options
    this.chartOptions = {
      chart: { 
        type: 'bar', 
        height: dynamicChartHeight,
        marginTop: 10,
        marginBottom: Math.max(legendSpace, 120), // Dynamic space for x-axis title and multi-row legend
        marginLeft: 80 // Extra space for y-axis title
      },

      title: undefined, //{ text: 'AU Activities by Country and Thematic Area' },
      xAxis: {
        categories: countries, 
        title: { 
          text: 'Country',
          margin: 15, // Ensure proper spacing for x-axis title
          style: {
            fontSize: '9px'
          }
        },
        labels: { 
          step: 1,
          style: {
            fontSize: '9px'
          }
        }
      },
      yAxis: {
        min: 0,
        title: { 
          text: 'Number of Activities',
          margin: 15 // Ensure proper spacing for y-axis title
        },
        stackLabels: { enabled: true },
      },
      legend: { 
        reversed: true,
        align: 'center',
        verticalAlign: 'bottom',
        layout: 'horizontal',
        x: 0,
        y: 0, // Reset to default, marginBottom handles spacing
        itemMarginBottom: 5, // Spacing between legend rows
        itemStyle: {
          fontSize: '9px'
        },
        symbolHeight: 10,
        symbolWidth: 15,
        symbolRadius: 0
      },
      plotOptions: {
        series: { stacking: 'normal' },
        bar: {
          groupPadding: 0.075,
          pointPadding: 0.001,
          borderWidth: 0
        },
      },
      series,
      credits: { enabled: false },
    };
  }
}
