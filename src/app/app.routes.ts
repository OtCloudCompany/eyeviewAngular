import { Routes } from '@angular/router';
import { LoginComponent } from './components/account/login/login';
import { AdminLayout } from './admin-layout/admin-layout';
import { AuthGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: AdminLayout,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./components/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'profile/users',
        loadComponent: () =>
          import('./components/account/user-profiles/user-profiles').then((m) => m.UserProfiles),
      },
      {
        path: 'profile/:public_id',
        loadComponent: () =>
          import('./components/account/account').then((m) => m.Account),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./components/account/account').then((m) => m.Account),
      },
      {
        path: 'activities',
        loadComponent: () =>
          import('./components/activities-list/activities-list').then((m) => m.ActivitiesList),
      },
      {
        path: 'activities/upload',
        loadComponent: () =>
          import('./components/upload-activities/upload-activities').then((m) => m.UploadActivities),
      },
      {
        path: 'activities/:id',
        loadComponent: () =>
          import('./components/activity-details/activity-details').then((m) => m.ActivityDetails),
      },
      {
        path: 'activities/:id/edit',
        loadComponent: () =>
          import('./components/edit-activity/edit-activity').then((m) => m.EditActivity),
      },
      
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    ],
  },
];
