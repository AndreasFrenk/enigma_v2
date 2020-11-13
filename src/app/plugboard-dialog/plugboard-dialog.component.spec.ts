import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlugboardDialogComponent } from './plugboard-dialog.component';

describe('PlugboardDialogComponent', () => {
  let component: PlugboardDialogComponent;
  let fixture: ComponentFixture<PlugboardDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlugboardDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlugboardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
