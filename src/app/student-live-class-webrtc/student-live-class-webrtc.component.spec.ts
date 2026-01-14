import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentLiveClassWebrtcComponent } from './student-live-class-webrtc.component';

describe('StudentLiveClassWebrtcComponent', () => {
  let component: StudentLiveClassWebrtcComponent;
  let fixture: ComponentFixture<StudentLiveClassWebrtcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentLiveClassWebrtcComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentLiveClassWebrtcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
