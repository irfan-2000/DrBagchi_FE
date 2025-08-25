import { TestBed } from '@angular/core/testing';

import { LoginSignUpService } from './login-sign-up.service';

describe('LoginSignUpService', () => {
  let service: LoginSignUpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginSignUpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
