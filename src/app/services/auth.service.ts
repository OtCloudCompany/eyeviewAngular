import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { FormGroup } from '@angular/forms';
import { PaginatedUserResponse, UserProfile } from '../models/account.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/accounts`;
  private tokenKey = 'access_token';
  private refreshKey = 'refresh_token';
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient, private router: Router) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/token/`, { email, password }).pipe(
      tap((tokens: any) => {
        localStorage.setItem(this.tokenKey, tokens.access);
        localStorage.setItem(this.refreshKey, tokens.refresh);
        this.loggedIn.next(true);
      })
    );
  }

  updateProfile(userForm: FormGroup, user_id: string): Observable<any> {
    const payload = userForm.getRawValue();

    return this.http.post(`${this.apiUrl}/${user_id}/update-profile/`, payload);
  }

  createUser(userForm: FormGroup): Observable<any> {
    const payload = userForm.getRawValue();

    return this.http.post(`${this.apiUrl}/create-profile/`, payload);
  }

  changePassword(passwordForm: FormGroup, user_id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${user_id}/change-password/`, passwordForm);
  }

  getUser(user_id: string): Observable<UserProfile> {
    
    return this.http.get<UserProfile>(`${this.apiUrl}/${user_id}/`);
  }

  getUsers(page: number): Observable<PaginatedUserResponse<UserProfile>> {
    // Use HttpParams to add the "?page=1" query string
    let params = new HttpParams().set('page', page.toString());

    return this.http.get<PaginatedUserResponse<UserProfile>>(
      `${this.apiUrl}/user-profiles/`,
      { params }
    );
  }

  deleteUserProfile(user_id: string){
    return this.http.delete(`${this.apiUrl}/${user_id}/delete/`);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshKey);

    localStorage.removeItem('profile');

    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return this.loggedIn.value;
  }
  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }
}
