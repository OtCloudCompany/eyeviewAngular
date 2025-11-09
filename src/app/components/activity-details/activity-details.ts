import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DashboardService } from '../../services/dashboard-service';
import { ActivatedRoute, Router } from '@angular/router';
import { Activity } from '../../models/records.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-activity-details',
  imports: [ReactiveFormsModule],
  templateUrl: './activity-details.html',
  styleUrl: './activity-details.css',
})
export class ActivityDetails implements OnInit {
  isLoading = true;
  db_id: number | undefined;
  activity: any;
  err: any;
  activityForm: FormGroup;
  flashMsg: string | undefined;


  constructor(
    private dashboardService: DashboardService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private changeDetector: ChangeDetectorRef,
    private router: Router
  ) {
    this.activityForm = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.db_id = Number(params.get('id')!);
    });
    this.dashboardService.getActivityById(this.db_id)?.subscribe({
      next: (activity: Activity) => {

        this.activity = activity;

        this.activityForm = this.formBuilder.group({
          id: [{ value: this.activity.id, disabled: true }],
          url: [this.activity.url],
          start_date: [this.activity.start_date, Validators.required],
          end_date: [this.activity.end_date],
          country: [this.activity.country, Validators.required],
          region: [this.activity.region, Validators.required],
          activity: [this.activity.activity, Validators.required],
          objective: [this.activity.objective, Validators.required],
          thematic: [this.activity.thematic, Validators.required],
          directorate: [this.activity.directorate, Validators.required],
        });
      },
      error: (error: any) => {
        this.err = error;
        console.error('An error occurred:', error);
      },
      complete: () => {
        this.isLoading = false;
        this.changeDetector.markForCheck();
      }
    });
  }

  onSubmit(): void {
    if (this.activityForm.invalid) {
      this.activityForm.markAllAsTouched();
      return;
    }
    this.err = null;
    this.flashMsg = undefined;
    this.isLoading = true;

    // Use getRawValue() to include the disabled 'id' value
    this.dashboardService.updateActivity(this.activityForm.getRawValue(), this.db_id!).subscribe({
      next: (newActivity) => {
        this.activity = newActivity;
        this.flashMsg = "Activity edited successfully";
        this.changeDetector.markForCheck();
      },
      error: (error) => {
        this.err = `Updating form values failed: ${error}`;
        this.flashMsg = this.err;
      },
      complete:()=>{
        this.isLoading = false;
      }
    });
  }

  onDelete():void {
    this.isLoading = true;
    this.dashboardService.deleteActivity(this.db_id!).subscribe({
      next: () => {
        this.router.navigate(['/activities'])
      },
      error: (err) => {
        this.err = `Failed deleting activity. Please try again: ${err}`;
        this.flashMsg = 'Failed deleting activity. Please try again.';
      },
      complete:()=>{
        this.isLoading = false;
      }
    });    
  }
}
