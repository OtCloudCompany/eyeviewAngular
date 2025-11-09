import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { forkJoin, finalize } from 'rxjs';
import { DashboardService } from '../../../services/dashboard-service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-dashboard-filters',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule
  ],
  templateUrl: './dashboard-filters.html',
  styleUrl: './dashboard-filters.css',
})
export class DashboardFilters {
  isLoading = true;
  thematicFacets: any[] = [];
  regionsFacets: any[] = [];
  countryFacets: any[] = [];
  directorateFacets: any[] = [];
  yearFacets: any[] = []
  summaryCounts = {
    'activities': 0,
    'thematic_areas': 0,
    'countries': 0,
    'regions': 0,
    'directorates': 0,
    'years': 0,
  };
  form: FormGroup;
  country = [];
  region = [];
  thematicArea = [];
  @Output() isLoadingChange = new EventEmitter<boolean>();


  constructor(
    private dashboardService: DashboardService,
    private formBuilder: FormBuilder,
    private cd: ChangeDetectorRef) {
    this.form = this.formBuilder.group({
      country: [...this.country],
      region: [...this.region],
      thematicArea: [...this.thematicArea]
    });
  }

  ngOnInit(): void {
    // Store initial filters (empty filters) for pagination
    this.dashboardService.setCurrentFilters(this.form.value);
    this.fetchDashboardData(this.form.value)
  }

  setIsLoading(value: boolean) {
    this.isLoading = value;
    this.isLoadingChange.emit(value);
  }

  onSubmit() {
    this.setIsLoading(true);
    this.fetchDashboardData(this.form.value)
  }

  fetchDashboardData(formFilters: { regionFilter: any, countryFilter: any, thematicFilter: any }) {
    forkJoin({
      countryStacks: this.dashboardService.getCountryStacks(formFilters),
      thematicFacets: this.dashboardService.getThematicFacets(formFilters),
      countryFacets: this.dashboardService.getCountryFacets(formFilters),
      stackedCountryFacets: this.dashboardService.getCountryStacks(formFilters),
      regionsFacets: this.dashboardService.getRegionsFacets(formFilters),
      directorateFacets: this.dashboardService.getDirectorateFacets(formFilters),
      yearFacets: this.dashboardService.getYearFacets(formFilters),
      activities: this.dashboardService.getFilteredActivities(formFilters)
    })
      .pipe(
        finalize(() => {
          this.setIsLoading(false);
          this.cd.markForCheck();
        })
      )
      .subscribe({
        next: (results) => {
          // Store current filters for pagination
          this.dashboardService.setCurrentFilters(formFilters);
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
          this.thematicArea = results.thematicFacets.map((item: any, idx: number) => ({
            id: idx,
            name: item.thematic_area,
            count: item.count
          }));
          this.country = results.countryFacets.map((item: any, idx: number) => ({
            id: idx,
            name: item.country,
            count: item.count
          }));
          this.region = results.regionsFacets.map((item: any, idx: number) => ({
            id: idx + 1,
            name: item.region,
            count: item.count
          }));
          this.cd.markForCheck();
        },
        error: (err) => {
          console.error('Error loading dashboard data:', err);
        }
      });
  }

}
