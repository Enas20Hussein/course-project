import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { filter } from 'rxjs/operators';

import { NotificationService } from '../../../../core/services/notification.service';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';
import {
  TableAction,
  TableActionEvent,
  TableColumn
} from '../../../../shared/models/table.model';
import {
  COURSE_STATUSES,
  Course,
  CourseStatus
} from '../../models/course.model';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [
    DataTableComponent,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.css'
})
export class CourseListComponent {
  private readonly courseService = inject(CourseService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly notifications =
    inject(NotificationService);

  readonly courseStatuses = COURSE_STATUSES;

  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly courses = signal<Course[]>([]);
  readonly searchTerm = signal('');
  readonly selectedStatus = signal<CourseStatus | 'All'>('All');

  readonly columns: TableColumn<Course>[] = [
    {
      key: 'id',
      header: 'ID'
    },
    {
      key: 'courseName',
      header: 'Course Name'
    },
    {
      key: 'instructorName',
      header: 'Instructor'
    },
    {
      key: 'category',
      header: 'Category'
    },
    {
      key: 'duration',
      header: 'Duration',
      formatter: (course) => `${course.duration} hours`
    },
    {
      key: 'price',
      header: 'Price',
      formatter: (course) =>
        new Intl.NumberFormat('en-EG', {
          style: 'currency',
          currency: 'EGP'
        }).format(course.price)
    },
    {
      key: 'status',
      header: 'Status',
      headerClass: 'status-column-header',
      cellClass: (course) =>
        `status-badge status-${course.status.toLowerCase()}`
    },
    {
      key: 'createdDate',
      header: 'Created Date',
      formatter: (course) =>
        new Intl.DateTimeFormat('en-GB').format(
          new Date(course.createdDate)
        )
    }
  ];

  readonly tableActions: TableAction<Course>[] = [
    {
      id: 'view',
      icon: 'visibility'
    },
    {
      id: 'edit',
      icon: 'edit'
    },
    {
      id: 'delete',
      icon: 'delete'
    }
  ];

  readonly filteredCourses = computed(() => {
    const search = this.searchTerm().trim().toLowerCase();
    const status = this.selectedStatus();

    return this.courses().filter((course) => {
      const matchesSearch =
        search.length === 0 ||
        [
          course.courseName,
          course.instructorName,
          course.category
        ].some((value) =>
          value.toLowerCase().includes(search)
        );

      const matchesStatus =
        status === 'All' || course.status === status;

      return matchesSearch && matchesStatus;
    });
  });

  readonly activeCoursesCount = computed(() =>
    this.courses().filter(
      (course) => course.status === 'Active'
    ).length
  );

  constructor() {
    this.loadCourses();
  }

  loadCourses(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.courseService.getAll()
      .pipe(
        catchError((error) => {
          console.error('Courses API error:', error);
          this.errorMessage.set(
            'Unable to connect to the courses API. Make sure npm run mock-api is running.'
          );
          this.notifications.error(
            'Courses API is unavailable right now.'
          );

          return of([] as Course[]);
        })
      )
      .subscribe({
      next: (courses) => {
        this.courses.set(courses);
        this.loading.set(false);
      }
    });
  }

  updateSearchTerm(value: string): void {
    this.searchTerm.set(value);
  }

  updateStatusFilter(value: string): void {
    this.selectedStatus.set(
      value === 'All' ? 'All' : (value as CourseStatus)
    );
  }

  onTableAction(
    event: TableActionEvent<Course>
  ): void {
    switch (event.actionId) {
      case 'view':
        this.router.navigate([
          '/courses',
          event.row.id
        ]);
        break;
      case 'edit':
        this.router.navigate([
          '/courses',
          event.row.id,
          'edit'
        ]);
        break;
      case 'delete':
        this.openDeleteDialog(event.row);
        break;
    }
  }

  private openDeleteDialog(course: Course): void {
    this.dialog.open(ConfirmationDialogComponent, {
      width: '420px',
      data: {
        title: 'Delete course',
        message: `Are you sure you want to delete "${course.courseName}"? This action cannot be undone.`,
        confirmLabel: 'Delete',
        cancelLabel: 'Keep course'
      }
    }).afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => {
        this.deleteCourse(course);
      });
  }

  private deleteCourse(course: Course): void {
    this.courseService.deleteById(course.id).subscribe({
      next: () => {
        this.courses.update((courses) =>
          courses.filter(
            (item) => item.id !== course.id
          )
        );

        this.notifications.success(
          'Course deleted successfully.'
        );
      },
      error: (error) => {
        console.error('Delete course API error:', error);
        this.notifications.error(
          'Unable to delete course.'
        );
      }
    });
  }
}
