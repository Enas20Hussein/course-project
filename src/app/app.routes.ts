import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'courses'
  },
  {
    path: 'courses',
    loadChildren: () =>
      import('./features/courses/courses.routes').then(
        (module) => module.COURSES_ROUTES
      )
  },
  {
    path: '**',
    redirectTo: 'courses'
  }
];
