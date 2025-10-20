import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsideCourseDetailsComponent } from './inside-course-details.component';

describe('InsideCourseDetailsComponent', () => {
  let component: InsideCourseDetailsComponent;
  let fixture: ComponentFixture<InsideCourseDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InsideCourseDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsideCourseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
