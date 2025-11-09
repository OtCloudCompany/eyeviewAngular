import { Component, OnInit, OnChanges, SimpleChanges, Input, ChangeDetectorRef } from '@angular/core';
import { Activity, PaginatedResponse } from '../../../models/records.model';
import { DashboardService } from '../../../services/dashboard-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-activities',
  imports: [CommonModule],
  templateUrl: './dashboard-activities.html',
  styleUrl: './dashboard-activities.css',
})
export class DashboardActivities implements OnInit, OnChanges {
  @Input() activitiesResponse: PaginatedResponse<Activity> | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(private dashboardService: DashboardService, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    // If activitiesResponse is already provided, don't fetch again
    // Otherwise, fetch the first page when component loads
    if (!this.activitiesResponse) {
      this.fetchActivities(1);
    } else {
      this.isLoading = false;
    }
    this.cd.markForCheck();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // When activitiesResponse is updated from parent (e.g., filter changes)
    if (changes['activitiesResponse'] && this.activitiesResponse) {
      this.isLoading = false;
      this.error = null;
      this.cd.markForCheck();
    }
  }

  /**
   * Fetches data for a specific page and updates the component's state.
   * @param page The page number to fetch.
   */
  fetchActivities(page: number): void {
    // Prevent fetching if already loading or invalid page
    if (page < 1 || this.isLoading) return;
    
    // Don't fetch if already on that page
    if (this.activitiesResponse && this.activitiesResponse.current_page === page) return;
    
    this.isLoading = true;
    this.error = null;
    
    // Get current filters from the service
    const currentFilters = this.dashboardService.getCurrentFilters();
    
    // Fetch activities with current filters and specified page
    this.dashboardService.getFilteredActivities(currentFilters, page).subscribe({
      next: (response) => {
        this.activitiesResponse = response;
        this.isLoading = false;
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
