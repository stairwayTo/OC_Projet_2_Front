import { ComponentFixture, TestBed } from '@angular/core/testing';
import {provideRouter, Router} from '@angular/router';

import { RegisterComponent } from './register.component';
import { UserService } from '../../core/service/user.service';
import {of} from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let router: Router;

  const userServiceMock = {
    register: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        provideRouter([]),
        { provide: UserService, useValue: userServiceMock },
      ],
    })
      .compileComponents();

    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should register user and go login page', () => {
    userServiceMock.register.mockReturnValue(of(null));
    const user = { firstName: 'Jean', lastName: 'Dupont', login: 'jdupont', password: 'secret' };
    component.registerForm.setValue(user);

    component.onSubmit();

    expect(userServiceMock.register).toHaveBeenCalledWith(user);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

});
