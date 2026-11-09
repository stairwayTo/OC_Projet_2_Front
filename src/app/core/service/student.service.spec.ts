// Outils de test Angular : TestBed = mini-application de test
import { TestBed } from '@angular/core/testing';
// Fournit HttpClient (nécessaire car StudentService l'injecte)
import { provideHttpClient } from '@angular/common/http';
// provideHttpClientTesting : remplace le vrai réseau par un FAUX serveur
// HttpTestingController    : la télécommande de ce faux serveur
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { StudentService } from './student.service';
import { Student } from '../models/Student';
import { StudentRequest } from '../models/StudentRequest';

// describe = groupe de tests (équivalent d'une classe de test JUnit)
describe('StudentService', () => {
  // Le service testé (le vrai, pas un mock)
  let service: StudentService;
  // La télécommande du faux serveur HTTP
  let httpMock: HttpTestingController;

  // Données de test : ce que le back RENVOIE (avec id et dates)
  const student: Student = {
    id: 1,
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean@mail.com',
    created_at: '2026-11-06T10:00:00',
    updated_at: '2026-11-06T10:00:00',
  };

  // Données de test : ce que le front ENVOIE (sans id ni dates)
  const studentRequest: StudentRequest = {
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean@mail.com',
  };

  // Exécuté AVANT CHAQUE test (équivalent de @BeforeEach)
  beforeEach(() => {
    // Construit le "magasin" (injecteur) de la mini-application de test
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),        // HttpClient disponible...
        provideHttpClientTesting(), // ...mais branché sur le faux serveur
      ]
    });
    // On récupère le service au magasin (providedIn: 'root' → pas besoin de le déclarer)
    service = TestBed.inject(StudentService);
    // On récupère la télécommande du faux serveur
    httpMock = TestBed.inject(HttpTestingController);
  });

  // Exécuté APRÈS CHAQUE test (équivalent de @AfterEach)
  afterEach(() => {
    // Échoue s'il reste une requête à laquelle personne n'a répondu
    // → détecte les appels HTTP en trop ou inattendus
    httpMock.verify();
  });

  // it = un test (équivalent de @Test). La description se lit comme une phrase.
  it('getAll should GET /api/students and return the list', () => {
    // WHEN : on appelle la méthode et on S'ABONNE
    // (sans subscribe, un Observable HTTP n'envoie rien)
    service.getAll().subscribe(students => {
      // THEN : ce code ne s'exécute qu'au moment du flush() plus bas,
      // quand le faux serveur a répondu
      expect(students).toEqual([student]); // toEqual compare le CONTENU
    });

    // THEN : exactement UNE requête doit être partie vers cette URL
    // (0 ou 2 requêtes → le test échoue)
    const req = httpMock.expectOne('/api/students');
    // On vérifie le verbe HTTP utilisé
    expect(req.request.method).toBe('GET');

    // Le faux serveur répond avec cette liste
    // → déclenche le code du subscribe() ci-dessus
    req.flush([student]);
  });

  it('create should POST /api/students with the body', () => {
    // WHEN : on envoie un étudiant. subscribe() vide : on ne lit pas la réponse,
    // mais il faut quand même s'abonner pour que la requête parte
    service.create(studentRequest).subscribe();

    // THEN : une requête vers la bonne URL...
    const req = httpMock.expectOne('/api/students');
    // ...avec le bon verbe...
    expect(req.request.method).toBe('POST');
    // ...et le bon contenu envoyé au back
    expect(req.request.body).toEqual(studentRequest);
    // Le faux serveur répond "vide" (le POST du back ne renvoie pas de body)
    req.flush(null);
  });

  it('update should PUT /api/students/id with the body & return updated student', () => {
    service.update(student.id, studentRequest).subscribe( updatedStudent=> {
      expect(updatedStudent).toEqual([student]);
    });
    const req = httpMock.expectOne(`/api/students/${student.id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(studentRequest);
    req.flush(student);
  });

  it('getByID should GET /api/students with the body', () => {
    service.getById(student.id).subscribe( foundStudent=> {
      expect(foundStudent).toEqual([student]);
    });
    const req = httpMock.expectOne(`/api/students/${student.id}`);
    expect(req.request.method).toBe('GET');
    req.flush(student);
  });

  it('delete should DELETE /api/students with the body', () => {
    service.delete(student.id).subscribe();
    const req = httpMock.expectOne(`/api/students/${student.id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
