import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsideCoursesComponent } from './inside-courses.component';

describe('InsideCoursesComponent', () => {
  let component: InsideCoursesComponent;
  let fixture: ComponentFixture<InsideCoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InsideCoursesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsideCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
