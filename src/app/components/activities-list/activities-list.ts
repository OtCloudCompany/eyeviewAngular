import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Activity, PaginatedResponse } from '../../models/records.model';
import { DashboardService } from '../../services/dashboard-service';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-activities-list',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './activities-list.html',
  styleUrl: './activities-list.css',
})
export class ActivitiesList implements OnInit{
  activitiesResponse: PaginatedResponse<Activity> | null = null;
  isLoading = true;
  error: string | null = null;
  page_size = 20;
  page = 1;
  filterForm: FormGroup;
  countryOptions: string[] = [];
  regionOptions: string[] = [];
  thematicOptions: string[] = [];
  private currentFilters: { country: string | null; region: string | null; thematicArea: string | null } = {
    country: null,
    region: null,
    thematicArea: null
  };

  constructor(
    private dashboardService: DashboardService, 
    private cd: ChangeDetectorRef,
    private fb: FormBuilder){
      this.filterForm = this.fb.group({
        country: [''],
        region: [''],
        thematicArea: ['']
      });
    }

  ngOnInit(): void {
    this.loadFilterOptions();
    this.loadActivities();
  }
  /**
   * Fetches data for a specific page and updates the component's state.
   * @param page The page number to fetch.
   */
  fetchActivities(page: number): void {
    if (page < 1) return; // Basic validation
    // Don't fetch if already on that page
    if (this.activitiesResponse && this.activitiesResponse.current_page === page) return;
    
    this.page = page;
    this.loadActivities();
  }

  onFilterSubmit(): void {
    const { country, region, thematicArea } = this.filterForm.value;
    this.currentFilters = {
      country: country || null,
      region: region || null,
      thematicArea: thematicArea || null
    };
    this.dashboardService.setCurrentFilters(this.currentFilters);
    this.page = 1;
    this.loadActivities();
  }

  private loadActivities(): void {
    this.isLoading = true;
    this.error = null;

    this.dashboardService.getFilteredActivities(this.currentFilters, this.page).subscribe({
      next: (response) => {
        this.activitiesResponse = response;
        this.isLoading = false;
        this.dashboardService.setCurrentFilters(this.currentFilters);
        this.cd.markForCheck();
      },
      error: (err) => {
        this.error = 'Failed to load activities. Please try again.';
        this.isLoading = false;
        console.error('Error fetching activities:', err);
        this.cd.markForCheck();
      }
    });
  }

  private loadFilterOptions(): void {
    const baseFilters = { country: null, region: null, thematicArea: null };
    forkJoin({
      countries: this.dashboardService.getCountryFacets(baseFilters),
      regions: this.dashboardService.getRegionsFacets(baseFilters),
      thematics: this.dashboardService.getThematicFacets(baseFilters)
    }).subscribe({
      next: (facets) => {
        this.countryOptions = this.extractFacetNames(facets.countries, 'country');
        this.regionOptions = this.extractFacetNames(facets.regions, 'region');
        this.thematicOptions = this.extractFacetNames(facets.thematics, 'thematic_area');
        this.cd.markForCheck();
      },
      error: (err) => {
        console.error('Error loading filter options:', err);
      }
    });
  }

  private extractFacetNames(items: any[], key: string): string[] {
    const values = (items || []).map((item: any) => item?.[key]).filter((value: string | undefined) => !!value);
    return Array.from(new Set(values));
  }
  /**
   * Generates an array of numbers for the pagination links.
   * This is a simple implementation. For a large number of pages,
   * you might want to add logic to show ellipses (...).
   */
  get pages(): (string | number)[] {
    if (!this.activitiesResponse) {
      return [];
    }

    const totalPages = this.activitiesResponse.total_pages;
    const currentPage = this.activitiesResponse.current_page;
    const pageNeighbours = 3; // How many pages to show on each side of the current page
    const pagesToShow: (string | number)[] = [];

    // If there are not enough pages to require ellipses, show all of them
    // The number 7 comes from: 1 (first) + 1 (last) + 1 (current) + 2*pageNeighbours + 2 (ellipses)
    if (totalPages <= 5 + (2 * pageNeighbours)) {
      for (let i = 1; i <= totalPages; i++) {
        pagesToShow.push(i);
      }
      return pagesToShow;
    }

    // Always show the first page
    pagesToShow.push(1);

    // Show left ellipsis if needed
    if (currentPage > pageNeighbours + 2) {
      pagesToShow.push('...');
    }

    // Show pages around the current page
    const startPage = Math.max(2, currentPage - pageNeighbours);
    const endPage = Math.min(totalPages - 1, currentPage + pageNeighbours);

    for (let i = startPage; i <= endPage; i++) {
      pagesToShow.push(i);
    }

    // Show right ellipsis if needed
    if (currentPage < totalPages - (pageNeighbours + 1)) {
      pagesToShow.push('...');
    }

    // Always show the last page
    pagesToShow.push(totalPages);

    return pagesToShow;
  }

  // ADD this new helper function for the template
  isNumber(value: string | number): value is number {
    return typeof value === 'number';
  }

}
