import { TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import {
    AuthService,
    GlobalMessageService,
    I18nTestingModule,
    WindowRef
} from '@spartacus/core';
import { LoginFormComponentService } from 'feature-libs/user/account/components/login-form/login-form-component.service';
import { CdcJsService } from 'integration-libs/cdc/root';
import { FormErrorsModule } from 'projects/storefrontlib/shared';
import { of } from 'rxjs';
import { CdcLoginComponentService } from './cdc-login-component.service';
import createSpy = jasmine.createSpy;

class MockWinRef {
  get nativeWindow(): Window {
    return {} as Window;
  }
}

class MockAuthService implements Partial<AuthService> {
  loginWithCredentials = createSpy().and.returnValue(of({}));
  isUserLoggedIn = createSpy().and.returnValue(of(true));
}

class MockGlobalMessageService {
  add = createSpy().and.stub();
  remove = createSpy().and.stub();
}

class MockCDCJsService implements Partial<CdcJsService> {
  didLoad = createSpy().and.returnValue(of(true));
  registerUserWithoutScreenSet = createSpy().and.callFake((user: any) => of(user));
  loginUserWithoutScreenSet = createSpy();
}

class MockLoginFormComponentService implements Partial<LoginFormComponentService> {
  login = createSpy();
}

describe('CdcLoginComponentService', () => {
  let cdcLoginService: CdcLoginComponentService;
  let loginFormService: LoginFormComponentService;
  let cdcJsService: CdcJsService;
  // let winRef: WindowRef;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          ReactiveFormsModule,
          RouterTestingModule,
          I18nTestingModule,
          FormErrorsModule,
        ],
        declarations: [],
        providers: [
          CdcLoginComponentService,
          { provide: WindowRef, useClass: MockWinRef },
          { provide: AuthService, useClass: MockAuthService },
          { provide: GlobalMessageService, useClass: MockGlobalMessageService },
          { provide: CdcJsService, useClass: MockCDCJsService },
          {
            provide: LoginFormComponentService,
            useClass: MockLoginFormComponentService,
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    cdcLoginService = TestBed.inject(CdcLoginComponentService);
    cdcJsService = TestBed.inject(CdcJsService);
    loginFormService = TestBed.inject(LoginFormComponentService);
  });

  it('should create service', () => {
    expect(cdcLoginService).toBeTruthy();
  });

  describe('login', () => {
    const userId = 'test@email.com';
    const password = 'secret';

    it('should happen with CDC', () => {
      cdcLoginService.form.setValue({
        userId: userId,
        password: password,
      });
      cdcLoginService.login();
      expect(cdcJsService.loginUserWithoutScreenSet).toHaveBeenCalledWith(
        userId,
        password,
        true
      );
    });

    it('should happen without CDC', () => {
      cdcLoginService.form.setValue({
        userId: userId,
        password: password,
      });
      cdcJsService.didLoad = createSpy().and.returnValue(of(false));
      Object.setPrototypeOf(cdcLoginService, loginFormService);
      cdcLoginService.login();
      expect(cdcJsService.loginUserWithoutScreenSet).not.toHaveBeenCalled();
      expect(loginFormService.login).toHaveBeenCalled();
    });
  });
});
