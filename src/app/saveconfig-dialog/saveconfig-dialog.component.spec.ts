import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveconfigDialogComponent } from './saveconfig-dialog.component';

describe('SaveconfigDialogComponent', () => {
  let component: SaveconfigDialogComponent;
  let fixture: ComponentFixture<SaveconfigDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveconfigDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveconfigDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
