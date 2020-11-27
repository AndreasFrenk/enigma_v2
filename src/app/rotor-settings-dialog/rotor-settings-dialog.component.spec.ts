import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RotorSettingsDialogComponent } from './rotor-settings-dialog.component';

describe('RotorSettingsDialogComponent', () => {
  let component: RotorSettingsDialogComponent;
  let fixture: ComponentFixture<RotorSettingsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RotorSettingsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RotorSettingsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
