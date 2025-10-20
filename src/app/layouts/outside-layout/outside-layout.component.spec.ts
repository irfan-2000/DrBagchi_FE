import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutsideLayoutComponent } from './outside-layout.component';

describe('OutsideLayoutComponent', () => {
  let component: OutsideLayoutComponent;
  let fixture: ComponentFixture<OutsideLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OutsideLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutsideLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
