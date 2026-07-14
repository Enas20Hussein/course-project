import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

import { CourseService } from '../../features/courses/services/course.service';
import { NotificationService } from '../services/notification.service';

export const courseExistsGuard: CanActivateFn = (
  route
) => {
  const courseService = inject(CourseService);
  const router = inject(Router);
  const notifications = inject(NotificationService);

  const courseId = route.paramMap.get('id');

  if (!courseId) {
    notifications.error('Course ID is missing.');
    return router.createUrlTree(['/courses']);
  }

  return courseService.getById(courseId).pipe(
    map(() => true),
    catchError((error) => {
      console.error('Course guard API error:', error);
      notifications.error(
        'This course could not be found.'
      );
      return of(router.createUrlTree(['/courses']));
    })
  );
};
