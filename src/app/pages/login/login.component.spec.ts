import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { provideHttpClient } from '@angular/common/http';
import { UserService } from '../../core/service/user.service';
import { UserMockService } from '../../core/service/user-mock.service';
import {provideRouter, Router} from '@angular/router';
import {of, throwError} from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;

  const userServiceMock = {
    login: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    localStorage.clear(); // attention au storage durant les tests
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]),
        { provide: UserService, useValue: userServiceMock },
      ],
    })
    .compileComponents();

    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate').mockResolvedValue(true); // on ne navigue pas pour de vrai

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('login success Should store token', () => {
    userServiceMock.login.mockReturnValue(of({token: 'token-toto'}));
    component.loginForm.setValue({ login: 'test', password: 'password' });

    component.onSubmit();

    expect(userServiceMock.login).toHaveBeenCalledWith({ login: 'test', password: 'password' });
    expect(localStorage.getItem('token')).toBe('token-toto');
    expect(router.navigate).toHaveBeenCalledWith(['/students']);
  });

  it('error when login fails', () => {
    userServiceMock.login.mockReturnValue(throwError(()=> new Error('NOP')));
    component.loginForm.setValue({ login: 'non', password: 'bad' });

    component.onSubmit();
    fixture.detectChanges();

    expect(component.errorMessage).toBe('Erreur de connexion');
    expect(localStorage.getItem('token')).toBe(null);
    expect(router.navigate).not.toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('Erreur de connexion');
  })
});
