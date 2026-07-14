import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseCrudService } from '../../../core/services/base-crud.service';

import {
  Course,
  CourseFormValue,
  CourseId,
  CourseStatus,
  CreateCourseRequest,
  UpdateCourseRequest
} from '../models/course.model';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CourseService extends BaseCrudService<
  Course,
  CreateCourseRequest,
  UpdateCourseRequest,
  CourseId
> {
  protected override readonly resourceUrl =
    `${environment.apiUrl}/courses`;

  createCourse(
    formValue: CourseFormValue
  ): Observable<Course> {
    const payload: CreateCourseRequest = {
      ...formValue,
      createdDate: new Date().toISOString()
    };

    return this.create(payload);
  }

  updateCourse(
    id: CourseId,
    formValue: CourseFormValue
  ): Observable<Course> {
    return this.patch(id, formValue);
  }

  getCoursesByStatus(
    status: CourseStatus
  ): Observable<Course[]> {
    const params = new HttpParams()
      .set('status', status);

    return this.getAll(params);
  }
}