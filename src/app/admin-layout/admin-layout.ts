import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './admin-layout.html',
})
export class AdminLayout implements OnInit{
  sidebarOpen = true;
  currentYear = new Date().getFullYear();
  first_name = '';
  public_id = '';

  ngOnInit(): void {
    this.first_name = localStorage.getItem('username') || 'Guest';
    this.public_id = localStorage.getItem('public_id') || ''
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    localStorage.removeItem('public_id');
    window.location.href = '/login';
  }
}
