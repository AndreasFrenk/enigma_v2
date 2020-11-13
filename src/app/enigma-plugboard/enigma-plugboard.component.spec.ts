import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnigmaPlugboardComponent } from './enigma-plugboard.component';

describe('EnigmaPlugboardComponent', () => {
  let component: EnigmaPlugboardComponent;
  let fixture: ComponentFixture<EnigmaPlugboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnigmaPlugboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnigmaPlugboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
