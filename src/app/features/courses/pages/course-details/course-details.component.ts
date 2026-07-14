import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { LoadingStateComponent } from '../../../../shared/components/loading-state/loading-state.component';

import { Course } from '../../models/course.model';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    EmptyStateComponent,
    LoadingStateComponent,
    DatePipe,
    CurrencyPipe
  ],
  templateUrl: './course-details.component.html',
  styleUrl: './course-details.component.css'
})
export class CourseDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly courseService = inject(CourseService);

  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly course = signal<Course | null>(null);

  constructor() {
    const courseId = this.route.snapshot.paramMap.get('id');

    if (courseId) {
      this.loadCourse(courseId);
    } else {
      this.errorMessage.set('Course ID is missing.');
    }
  }

  private loadCourse(courseId: string): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.courseService.getById(courseId).subscribe({
      next: (course) => {
        this.course.set(course);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Course details API error:', error);
        this.errorMessage.set(
          'Unable to load this course right now. Make sure the mock API is running.'
        );
        this.loading.set(false);
      }
    });
  }
}
