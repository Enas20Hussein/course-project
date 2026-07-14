import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PendingChangesGuarded } from '../../../../core/guards/pending-changes.guard';
import { NotificationService } from '../../../../core/services/notification.service';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { LoadingStateComponent } from '../../../../shared/components/loading-state/loading-state.component';
import {
  COURSE_STATUSES,
  CourseFormValue,
  CourseId,
  CourseStatus
} from '../../models/course.model';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatProgressSpinnerModule,
    LoadingStateComponent,
    EmptyStateComponent
  ],
  templateUrl: './course-form.component.html',
  styleUrl: './course-form.component.css'
})
export class CourseFormComponent
  implements PendingChangesGuarded {
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly courseService = inject(CourseService);
  private readonly notifications =
    inject(NotificationService);

  readonly statuses = COURSE_STATUSES;
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly errorMessage = signal('');

  readonly courseForm = this.formBuilder.group({
    courseName: ['', [Validators.required, Validators.minLength(3)]],
    instructorName: ['', [Validators.required]],
    category: ['', [Validators.required]],
    duration: [null as number | null, [Validators.required, Validators.min(1)]],
    price: [null as number | null, [Validators.required, Validators.min(0)]],
    status: ['' as CourseStatus | '', [Validators.required]],
    description: ['', [Validators.maxLength(500)]]
  });

  readonly courseId = this.route.snapshot.paramMap.get('id');
  readonly isEditMode = this.courseId !== null;

  constructor() {
    if (this.isEditMode && this.courseId) {
      this.loadCourse(this.courseId);
    }
  }

  submitForm(): void {
    if (this.courseForm.invalid) {
      this.courseForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.errorMessage.set('');

    const formValue = this.courseForm.getRawValue();
    const payload: CourseFormValue = {
      courseName: formValue.courseName?.trim() ?? '',
      instructorName: formValue.instructorName?.trim() ?? '',
      category: formValue.category?.trim() ?? '',
      duration: Number(formValue.duration),
      price: Number(formValue.price),
      status: formValue.status as CourseStatus,
      description: formValue.description?.trim() ?? ''
    };

    const request = this.isEditMode && this.courseId
      ? this.courseService.updateCourse(this.courseId, payload)
      : this.courseService.createCourse(payload);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.courseForm.markAsPristine();
        this.notifications.success(
          this.isEditMode
            ? 'Course updated successfully.'
            : 'Course created successfully.'
        );
        this.router.navigate(['/courses']);
      },
      error: (error) => {
        console.error('Course form API error:', error);
        this.saving.set(false);
        this.notifications.error(
          'Unable to save the course.'
        );
        this.errorMessage.set(
          'Unable to save the course. Make sure the mock API is running and try again.'
        );
      }
    });
  }

  private loadCourse(courseId: CourseId): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.courseService.getById(courseId).subscribe({
      next: (course) => {
        this.courseForm.patchValue({
          courseName: course.courseName,
          instructorName: course.instructorName,
          category: course.category,
          duration: course.duration,
          price: course.price,
          status: course.status,
          description: course.description
        });
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Course details API error:', error);
        this.loading.set(false);
        this.errorMessage.set(
          'Unable to load this course for editing.'
        );
      }
    });
  }

  canDiscardChanges(): boolean | Observable<boolean> {
    if (this.saving() || this.courseForm.pristine) {
      return true;
    }

    return this.dialog.open(ConfirmationDialogComponent, {
      width: '440px',
      data: {
        title: 'Discard your changes?',
        message: 'You have unsaved changes on this course form. If you leave now, your latest edits will be lost.',
        confirmLabel: 'Leave page',
        cancelLabel: 'Stay here',
        icon: 'logout'
      }
    }).afterClosed()
      .pipe(map((result) => result === true));
  }

  hasFieldError(controlName: keyof CourseFormValue): boolean {
    const control = this.courseForm.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  getFieldError(controlName: keyof CourseFormValue): string {
    const control = this.courseForm.get(controlName);

    if (!control || !control.errors) {
      return '';
    }

    return this.getErrorMessage(controlName, control);
  }

  private getErrorMessage(
    controlName: keyof CourseFormValue,
    control: AbstractControl
  ): string {
    if (control.hasError('required')) {
      switch (controlName) {
        case 'courseName':
          return 'Course name is required.';
        case 'instructorName':
          return 'Instructor name is required.';
        case 'category':
          return 'Category is required.';
        case 'duration':
          return 'Duration in hours is required.';
        case 'price':
          return 'Price is required.';
        case 'status':
          return 'Status is required.';
        default:
          return 'This field is required.';
      }
    }

    if (control.hasError('minlength') && controlName === 'courseName') {
      return 'Course name must be at least 3 characters.';
    }

    if (control.hasError('min') && controlName === 'duration') {
      return 'Duration must be greater than 0.';
    }

    if (control.hasError('min') && controlName === 'price') {
      return 'Price must be 0 or more.';
    }

    if (control.hasError('maxlength') && controlName === 'description') {
      return 'Description must be 500 characters or fewer.';
    }

    return 'Please enter a valid value.';
  }
}
