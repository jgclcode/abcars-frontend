import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportPhotoComponent } from './report-photo.component';

describe('ReportPhotoComponent', () => {
  let component: ReportPhotoComponent;
  let fixture: ComponentFixture<ReportPhotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportPhotoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportPhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
