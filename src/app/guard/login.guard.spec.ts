import { TestBed } from '@angular/core/testing';


import { loginGuard } from './login.guard';

describe('LoginGuard', () => {
  let guard: loginGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(loginGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
