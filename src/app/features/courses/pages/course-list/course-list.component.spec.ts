import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { provideRouter } from '@angular/router';
import { Observable, of } from 'rxjs';

import { NotificationService } from '../../../../core/services/notification.service';
import { CourseService } from '../../services/course.service';
import { CourseListComponent } from './course-list.component';

describe('CourseListComponent', () => {
  let component: CourseListComponent;
  let fixture: ComponentFixture<CourseListComponent>;
  let dialogResult$: Observable<boolean>;
  const courseServiceMock = {
    getAll: jasmine.createSpy('getAll').and.returnValue(
      of([
        {
          id: '1',
          courseName: 'Angular Fundamentals',
          instructorName: 'Ahmed Ali',
          category: 'Frontend',
          duration: 20,
          price: 1500,
          status: 'Active',
          description: 'Angular intro course',
          createdDate: '2026-06-01T00:00:00.000Z'
        },
        {
          id: '2',
          courseName: 'Node API Essentials',
          instructorName: 'Sara Mohamed',
          category: 'Backend',
          duration: 16,
          price: 1800,
          status: 'Draft',
          description: 'Node backend course',
          createdDate: '2026-05-10T00:00:00.000Z'
        }
      ])
    ),
    deleteById: jasmine
      .createSpy('deleteById')
      .and.returnValue(of(void 0))
  };

  const notificationServiceMock = {
    success: jasmine.createSpy('success'),
    error: jasmine.createSpy('error'),
    info: jasmine.createSpy('info')
  };

  const dialogMock = {
    open: jasmine.createSpy('open')
  };

  beforeEach(async () => {
    courseServiceMock.getAll.calls.reset();
    courseServiceMock.deleteById.calls.reset();
    notificationServiceMock.success.calls.reset();
    notificationServiceMock.error.calls.reset();
    notificationServiceMock.info.calls.reset();
    dialogMock.open.calls.reset();

    dialogResult$ = of(false);
    dialogMock.open.and.returnValue({
      afterClosed: () => dialogResult$
    });

    await TestBed.configureTestingModule({
      imports: [CourseListComponent],
      providers: [
        provideRouter([]),
        {
          provide: CourseService,
          useValue: courseServiceMock
        },
        {
          provide: NotificationService,
          useValue: notificationServiceMock
        },
        {
          provide: MatDialog,
          useValue: dialogMock
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter courses by search term and status', () => {
    component.updateSearchTerm('angular');
    component.updateStatusFilter('Active');

    expect(component.filteredCourses().length).toBe(1);
    expect(
      component.filteredCourses()[0].courseName
    ).toBe('Angular Fundamentals');
  });

  it('should not delete course when dialog is cancelled', () => {
    dialogResult$ = of(false);

    component.onTableAction({
      actionId: 'delete',
      row: component.courses()[0]
    });

    expect(courseServiceMock.deleteById).not.toHaveBeenCalled();
  });

  it('should delete course when dialog is confirmed', () => {
    dialogResult$ = of(true);

    component.onTableAction({
      actionId: 'delete',
      row: component.courses()[0]
    });

    expect(courseServiceMock.deleteById).toHaveBeenCalledWith('1');
    expect(notificationServiceMock.success).toHaveBeenCalledWith(
      'Course deleted successfully.'
    );
  });
});
