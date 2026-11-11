import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  provideRouter,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';

import { authGuard } from './auth.guard';

describe('authGuard', () => {
  // Fourni par Angular : exécute le guard dans un "contexte d'injection",
  // pour que son inject(Router) fonctionne
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  // Le guard ne lit pas la route ni l'état : de faux objets vides suffisent
  const route = {} as ActivatedRouteSnapshot;
  const state = {} as RouterStateSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],   // le guard injecte Router
    });
    localStorage.clear();               // chaque test part sans token
  });

  afterEach(() => {
    localStorage.clear();               // on ne laisse rien traîner pour les autres tests
  });

  it('should allow access when a token is present', () => {
    // GIVEN
    localStorage.setItem('token', 'fake-token');

    // WHEN
    const result = executeGuard(route, state);

    // THEN
    expect(result).toBe(true);
  });

  it('should redirect to /login when there is no token', () => {
    // GIVEN : pas de token (localStorage vidé dans beforeEach)

    // WHEN
    const result = executeGuard(route, state);

    // THEN : le guard renvoie une redirection (UrlTree) vers /login
    expect(result).toBeInstanceOf(UrlTree);
    expect((result as UrlTree).toString()).toBe('/login');
  });
});
