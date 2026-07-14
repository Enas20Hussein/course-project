import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTableComponent } from './data-table.component';

describe('DataTableComponent', () => {
  let component: DataTableComponent<any>;
  let fixture: ComponentFixture<DataTableComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(
      DataTableComponent
    ) as ComponentFixture<DataTableComponent<any>>;
    component = fixture.componentInstance as DataTableComponent<any>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should append actions column when actions are provided', () => {
    fixture.componentRef.setInput('columns', [
      {
        key: 'id',
        header: 'ID'
      },
      {
        key: 'name',
        header: 'Name'
      }
    ]);
    fixture.componentRef.setInput('actions', [
      {
        id: 'view',
        label: 'View',
        icon: 'visibility'
      }
    ]);
    fixture.detectChanges();

    expect(component.displayedColumns()).toEqual([
      'id',
      'name',
      'actions'
    ]);
  });
});
