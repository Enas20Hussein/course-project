import { Routes } from '@angular/router';

import { courseExistsGuard } from '../../core/guards/course-exists.guard';
import { pendingChangesGuard } from '../../core/guards/pending-changes.guard';
import { CourseListComponent } from './pages/course-list/course-list.component';
import { CourseDetailsComponent } from './pages/course-details/course-details.component';
import { CourseFormComponent } from './pages/course-form/course-form.component';

export const COURSES_ROUTES: Routes = [
  {
    path: '',
    component: CourseListComponent
  },
  {
    path: 'new',
    component: CourseFormComponent,
    canDeactivate: [pendingChangesGuard]
  },
  {
    path: ':id',
    component: CourseDetailsComponent,
    canActivate: [courseExistsGuard]
  },
  {
    path: ':id/edit',
    component: CourseFormComponent,
    canActivate: [courseExistsGuard],
    canDeactivate: [pendingChangesGuard]
  }
];
