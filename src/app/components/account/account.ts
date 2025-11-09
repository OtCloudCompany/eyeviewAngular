import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UserProfile } from '../../models/account.model';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Spinner } from "../spinner/spinner";
import { Alert } from '../alert/alert';

@Component({
  selector: 'app-account',
  imports: [FormsModule, CommonModule, ReactiveFormsModule, Spinner, Alert],
  templateUrl: './account.html',
  styleUrl: './account.css',
})
export class Account implements OnInit {

  public_id: string = '';
  error = '';
  profileForm: FormGroup;
  profileUpdateMessage: string = '';

  old_password: string = '';
  password: string = '';
  password2: string = '';
  passwordForm: FormGroup;
  passwordChangeMessage: string = '';

  my_account: boolean = true;
  is_updating: boolean = false;
  is_fetching: boolean = true;
  is_deleting: boolean = false;
  is_changing_password: boolean = false;
  userProfile: UserProfile | undefined;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private changeDetector: ChangeDetectorRef,
    private formBuilder: FormBuilder) {
    this.profileForm = new FormGroup({});
    this.passwordForm = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.public_id = params.get('public_id')!;
    });

    this.getUserProfile();

    this.passwordForm = this.formBuilder.group({
      old_password: ['', Validators.required],
      password: ['', Validators.required],
      password2: ['', Validators.required],
    });
  }
  getUserProfile() {
    // this.public_id = this.route.ac

    if (!this.public_id) {
      // throw an exception
      console.error('user id not provided');
    }

    this.authService.getUser(this.public_id).subscribe({
      next: (userResp: UserProfile) => {
        this.userProfile = userResp;
        // this.first_name = this.userProfile.first_name
        this.updateUserProfileForm();
        this.changeDetector.detectChanges();
      },
      error: (err) => {
        console.error(`Error occured: ${err}`)
      },
      complete: () => {
        this.is_fetching = false;
      },
    });
  }
  onUpdateProfile(): void {
    if (this.profileForm.invalid) {
      // Mark all fields as touched to display validation errors
      this.profileForm.markAllAsTouched();
      return;
    }
    this.is_updating = true;
    this.profileUpdateMessage = '';
    const user_id = this.public_id; 

    this.authService.updateProfile(this.profileForm, user_id).subscribe({
      next: (userResp: UserProfile) => {
        this.userProfile = userResp;
        this.updateUserProfileForm();
        
        this.changeDetector.markForCheck();
        this.profileUpdateMessage = "Profile updated successfully";
        // this.router.navigate([`/profile/${user_id}`]);
      },
      error: (err) => {
        this.error = err.error?.detail || `Profile update failed. Please try again.`;
        this.profileUpdateMessage = this.error;
        // console.error('Profile update error:', err);
      },
      complete: () => {
        this.is_updating = false;

      }
    });
  }

  updateUserProfileForm(){
    this.profileForm = this.formBuilder.group({
      first_name: [this.userProfile?.first_name, Validators.required],
      last_name: [this.userProfile?.last_name, Validators.required],
      email: [this.userProfile?.email, Validators.required],
    });
  }

  deleteUserProfile(){
    this.is_deleting = true;
    this.authService.deleteUserProfile(this.public_id).subscribe({
      next: (resp) => {
        // this.router.navigate(['/profile/users']);
        window.location.href = '/profile/users';
      },
      error: (err) => {
        console.error(`Failed deleting: ${err}`);
      },
      complete: () => {
        this.is_deleting = false;
      },
    });
  }
  
  changeUserPassword(){
    this.is_changing_password = true;
    this.passwordChangeMessage = '';
    const form_data = this.passwordForm.getRawValue();
    this.authService.changePassword(form_data, this.public_id).subscribe({
      next: (resp) => {
        this.passwordChangeMessage = resp.detail
      },
      error: (err) => {
        console.error(`Failed changing password`, err.error);
        this.passwordChangeMessage = `${err.error.detail}`;
        this.is_changing_password = false;
      },
      complete: () => {
        this.is_changing_password = false;
      },
    });
  }

  openModal(){
    this.is_deleting = false;
  }
  

}
