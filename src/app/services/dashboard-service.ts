import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Activity, PaginatedResponse } from '../models/records.model';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private api_url: string;
  private dataSource = new BehaviorSubject<any>(null);
  data$ = this.dataSource.asObservable();
  private currentFiltersSource = new BehaviorSubject<any>({});
  currentFilters$ = this.currentFiltersSource.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.api_url = environment.apiUrl;
  }

  setData(data: any) {
    this.dataSource.next(data);
  }

  setCurrentFilters(filters: any) {
    this.currentFiltersSource.next(filters);
  }

  getCurrentFilters(): any {
    return this.currentFiltersSource.getValue();
  }

  /**
   * Safely extracts and URL-encodes a filter value
   * Handles strings, arrays, objects, and null/undefined
   */
  private encodeFilterValue(value: any): string {
    if (!value) return '';
    
    // If it's an array, get the first element (or join if multiple values expected)
    if (Array.isArray(value)) {
      if (value.length === 0) return '';
      // If array contains objects, extract name property, otherwise use the value directly
      const firstValue = typeof value[0] === 'object' && value[0]?.name ? value[0].name : value[0];
      return encodeURIComponent(String(firstValue));
    }
    
    // If it's an object, try to extract the name property
    if (typeof value === 'object' && value?.name) {
      return encodeURIComponent(String(value.name));
    }
    
    // Otherwise, treat it as a string
    return encodeURIComponent(String(value));
  }

  getThematicFacets(formFilters: any): Observable<any> {

    const thematicFilter = formFilters.thematicArea ? `f.thematics=${this.encodeFilterValue(formFilters.thematicArea)}` : 'f.thematics=';
    const countryFilter = formFilters.country ? `&f.countries=${this.encodeFilterValue(formFilters.country)}` : '&f.countries=';
    const regionFilter = formFilters.region ? `&f.regions=${this.encodeFilterValue(formFilters.region)}` : '&f.regions=';
    
    const url = `${this.api_url}/dashboard/thematic-facets?${thematicFilter}${countryFilter}${regionFilter}`;
    return this.http.get(url);
  }

  getCountryFacets(formFilters: any): Observable<any> {
    
    const thematicFilter = formFilters.thematicArea ? `f.thematics=${this.encodeFilterValue(formFilters.thematicArea)}` : 'f.thematics=';
    const countryFilter = formFilters.country ? `&f.countries=${this.encodeFilterValue(formFilters.country)}` : '&f.countries=';
    const regionFilter = formFilters.region ? `&f.regions=${this.encodeFilterValue(formFilters.region)}` : '&f.regions=';
    
    const url = `${this.api_url}/dashboard/country-facets?${thematicFilter}${countryFilter}${regionFilter}`;
    return this.http.get(url);
  }
  getRegionsFacets(formFilters: any): Observable<any> {
    
    const thematicFilter = formFilters.thematicArea ? `f.thematics=${this.encodeFilterValue(formFilters.thematicArea)}` : 'f.thematics=';
    const countryFilter = formFilters.country ? `&f.countries=${this.encodeFilterValue(formFilters.country)}` : '&f.countries=';
    const regionFilter = formFilters.region ? `&f.regions=${this.encodeFilterValue(formFilters.region)}` : '&f.regions=';
    
    const url = `${this.api_url}/dashboard/region-facets/?${thematicFilter}${countryFilter}${regionFilter}`;
    return this.http.get(url);
  }
  getDirectorateFacets(formFilters: any): Observable<any> {
    const countryFilter = formFilters.country ? `&f.countries=${this.encodeFilterValue(formFilters.country)}` : '&f.countries=';
    const regionFilter = formFilters.region ? `&f.regions=${this.encodeFilterValue(formFilters.region)}` : '&f.regions=';
    const thematicFilter = formFilters.thematicArea ? `f.thematics=${this.encodeFilterValue(formFilters.thematicArea)}` : 'f.thematics=';
    
    const url = `${this.api_url}/dashboard/directorate-facets?${thematicFilter}${countryFilter}${regionFilter}`;
    return this.http.get(url);
  }
  getYearFacets(formFilters: any): Observable<any> {

    const countryFilter = formFilters.country ? `&f.countries=${this.encodeFilterValue(formFilters.country)}` : '&f.countries=';
    const regionFilter = formFilters.region ? `&f.regions=${this.encodeFilterValue(formFilters.region)}` : '&f.regions=';
    const thematicFilter = formFilters.thematicArea ? `f.thematics=${this.encodeFilterValue(formFilters.thematicArea)}` : 'f.thematics=';
    
    const url = `${this.api_url}/dashboard/yearly-facets?${thematicFilter}${countryFilter}${regionFilter}`;
    return this.http.get(url);
  }
  
  getFilteredActivities(formFilters: any, page: number = 1): Observable<PaginatedResponse<Activity>> {
    const countryFilter = formFilters.country ? `&f.countries=${this.encodeFilterValue(formFilters.country)}` : '&f.countries=';
    const regionFilter = formFilters.region ? `&f.regions=${this.encodeFilterValue(formFilters.region)}` : '&f.regions=';
    const thematicFilter = formFilters.thematicArea ? `f.thematics=${this.encodeFilterValue(formFilters.thematicArea)}` : 'f.thematics=';
    
    const url = `${this.api_url}/dashboard/activities/?${thematicFilter}${countryFilter}${regionFilter}&page=${page}`;
    return this.http.get<PaginatedResponse<Activity>>(url);
  }

  getAllActivities(page: number = 1, page_size: number = 20): Observable<PaginatedResponse<Activity>> {
    
    const url = `${this.api_url}/dashboard/activities/?page=${page}&per_page=${page_size}`;
    return this.http.get<PaginatedResponse<Activity>>(url);
  }

  
  getCountryStacks(formFilters: any): Observable<any> {
    const thematicFilter = formFilters.thematicArea ? `f.thematics=${this.encodeFilterValue(formFilters.thematicArea)}` : 'f.thematics=';
    const countryFilter = formFilters.country ? `&f.countries=${this.encodeFilterValue(formFilters.country)}` : '&f.countries=';
    const regionFilter = formFilters.region ? `&f.regions=${this.encodeFilterValue(formFilters.region)}` : '&f.regions=';
    
    const url = `${this.api_url}/dashboard/stacked-dataset/?${thematicFilter}${countryFilter}${regionFilter}`;
    return this.http.get(url);
  }

  getActivityById(db_id: number | undefined): Observable<Activity> | undefined {
    if(!db_id){ return;}
    
    const url = `${this.api_url}/activities/${db_id}`;
    return this.http.get<Activity>(url);
  }

  updateActivity(activityFormData: FormGroup, db_id: number): Observable<any> {
    return this.http.patch(`${this.api_url}/activities/${db_id}/update`, activityFormData);
  }

  deleteActivity(db_id: number): Observable<any> {
    return this.http.delete(`${this.api_url}/activities/${db_id}/delete`);
  }

  uploadCsvFile(file: File): Observable<HttpEvent<any>> {
    const formData = new FormData();
    // backend expects field name 'file' — change key if your API expects a different name
    formData.append('file', file, file.name);

    // Use observe: 'events' + reportProgress to get progress events
    return this.http.post<any>(`${this.api_url}/activities/bulk-upload`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

}
