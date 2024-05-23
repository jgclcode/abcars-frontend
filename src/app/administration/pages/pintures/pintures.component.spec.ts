import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PinturesComponent } from './pintures.component';

describe('PinturesComponent', () => {
  let component: PinturesComponent;
  let fixture: ComponentFixture<PinturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PinturesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PinturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
