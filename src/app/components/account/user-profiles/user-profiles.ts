import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { PaginatedUserResponse, UserProfile } from '../../../models/account.model';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Spinner } from "../../spinner/spinner";
import { Alert } from "../../alert/alert";
// import { Alert } from "../../alert/alert";

@Component({
  selector: 'app-user-profiles',
  imports: [NgxPaginationModule, CommonModule, Spinner, FormsModule, ReactiveFormsModule, Alert],
  templateUrl: './user-profiles.html',
  styleUrl: './user-profiles.css',
})
export class UserProfiles implements OnInit {
  users: UserProfile[] = [];
  userForm: FormGroup;
  userCreateMessage: string | null = '';
  is_creating: boolean = false;

  isLoading: boolean = true;
  error: string | null = null;

  totalItems: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(
    private authService: AuthService, 
    private formBuilder: FormBuilder,
    private changeDetector: ChangeDetectorRef
  ) { 
    this.userForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      password_repeat: ['', Validators.required],
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.userForm.controls;
  }

  ngOnInit(): void {
    // Load the initial page
    this.loadUsers(this.currentPage);
  }

  onCreateUser(): void {
    if (this.userForm.invalid) {
      // Mark all fields as touched to display validation errors
      this.userForm.markAllAsTouched();
      return;
    }
    this.is_creating = true;
    this.userCreateMessage = '';

    this.authService.createUser(this.userForm).subscribe({
      next: (resp: UserProfile) => {
        this.users.unshift(resp); //insert at the beginning of list to see it
        this.changeDetector.markForCheck();
        this.userCreateMessage = "User created successfully";
      },
      error: (err) => {
        this.error = err.error?.detail || `Failed creating user. Please try again.`;
        console.error('Error creating user:', err);
        // if(err.erro)
        this.is_creating = false;
      },
      complete: ()=>{
        this.is_creating = false;
        this.userForm.reset();
      }
    });
  }


  /**
   * Fetches users for a specific page.
   */
  loadUsers(page: number): void {
    this.isLoading = true;
    this.error = null;

    this.authService.getUsers(page).subscribe({
      next: (response: PaginatedUserResponse<UserProfile>) => {
        this.users = response.results;
        this.totalItems = response.count;
        this.currentPage = page;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load users:', err);
        this.error = 'Could not load user profiles. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Event handler for the pagination component.
   * This is called when the user clicks a new page number.
   * @param newPage The new page number
   */
  onPageChange(newPage: number): void {
    this.loadUsers(newPage);
  }
  deletUser(user_id: string){

  }

}
