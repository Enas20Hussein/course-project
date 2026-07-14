export const COURSE_STATUSES = [
  'Active',
  'Draft',
  'Archived'
] as const;

export type CourseStatus =
  (typeof COURSE_STATUSES)[number];

export type CourseId = string | number;

export interface CourseFormValue {
  courseName: string;
  instructorName: string;
  category: string;
  duration: number;
  price: number;
  status: CourseStatus;
  description: string;
}

export interface Course extends CourseFormValue {
  id: CourseId;
  createdDate: string;
}

export interface CreateCourseRequest
  extends CourseFormValue {
  createdDate: string;
}

export type UpdateCourseRequest =
  Partial<CourseFormValue>;