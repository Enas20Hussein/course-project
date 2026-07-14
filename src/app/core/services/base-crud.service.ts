import { HttpClient, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';

export abstract class BaseCrudService<
  TEntity extends { id: TId },
  TCreate,
  TUpdate = Partial<TCreate>,
  TId extends string | number = number
> {
  protected readonly http = inject(HttpClient);

  protected abstract readonly resourceUrl: string;

  getAll(params?: HttpParams): Observable<TEntity[]> {
    return this.http.get<TEntity[]>(
      this.resourceUrl,
      { params }
    );
  }

  getById(id: TId): Observable<TEntity> {
    return this.http.get<TEntity>(
      `${this.resourceUrl}/${id}`
    );
  }

  create(payload: TCreate): Observable<TEntity> {
    return this.http.post<TEntity>(
      this.resourceUrl,
      payload
    );
  }

  update(
    id: TId,
    payload: TCreate
  ): Observable<TEntity> {
    return this.http.put<TEntity>(
      `${this.resourceUrl}/${id}`,
      payload
    );
  }

  patch(
    id: TId,
    payload: TUpdate
  ): Observable<TEntity> {
    return this.http.patch<TEntity>(
      `${this.resourceUrl}/${id}`,
      payload
    );
  }

  deleteById(id: TId): Observable<void> {
    return this.http.delete<void>(
      `${this.resourceUrl}/${id}`
    );
  }
}