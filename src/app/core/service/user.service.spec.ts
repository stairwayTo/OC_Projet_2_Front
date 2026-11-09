import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {Register} from '../models/Register';
import {Login} from '../models/Login';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;


  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  // Exécuté APRÈS CHAQUE test (équivalent de @AfterEach)
  afterEach(() => {
    // Échoue s'il reste une requête à laquelle personne n'a répondu
    // → détecte les appels HTTP en trop ou inattendus
    httpMock.verify();
  });

  const user: Register = {
    firstName: 'toto',
    lastName: 'bob',
    login: 'login',
    password: 'password'
  }
  const credentials: Login = {
    login: 'login',
    password: 'password'
  }

  it('register should POST /api/register with user as boby', () => {
    service.register(user).subscribe();

    const req = httpMock.expectOne('/api/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(user);
    req.flush(null); // le back renvoie "rien" (HTTP Code) donc null
  });

  it('login should POST /api/login with credentials as boby', () => {
    service.login(credentials).subscribe(response => {
      expect(response.token).toEqual('fake-token')
    });
    const req = httpMock.expectOne('/api/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(credentials);
    req.flush({ token: 'fake-token' });
  })
});
