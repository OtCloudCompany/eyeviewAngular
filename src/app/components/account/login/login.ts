import { ChangeDetectorRef, Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { jwtDecode, JwtPayload } from 'jwt-decode'; // Import the function
import { UserProfile } from '../../../models/account.model';
import { Spinner } from "../../spinner/spinner";

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [CommonModule, FormsModule, Spinner]
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private changeDetector: ChangeDetectorRef
  ) { }

  onLogin() {
    this.isLoading = true;
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        const token = localStorage.getItem('access_token') || '';
        try {
          const decodedPayload = jwtDecode(token) as UserProfile;
          localStorage.setItem('username', decodedPayload.first_name)
          localStorage.setItem('public_id', decodedPayload.public_id)
          this.router.navigate(['/dashboard']);
        } catch (error) {
          console.error('Error decoding JWT or token is invalid:', error);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          this.isLoading = false;
        }
        // this.isLoading = false;        
      },
      error: () => {
        this.error = 'Invalid credentials. Please try again.';
        this.isLoading = false;
      },
      complete: () => {
        this.changeDetector.markForCheck();
      }
    });
  }

}
