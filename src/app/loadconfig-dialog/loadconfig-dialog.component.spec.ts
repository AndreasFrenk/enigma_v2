import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadconfigDialogComponent } from './loadconfig-dialog.component';

describe('LoadconfigDialogComponent', () => {
  let component: LoadconfigDialogComponent;
  let fixture: ComponentFixture<LoadconfigDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadconfigDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadconfigDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
