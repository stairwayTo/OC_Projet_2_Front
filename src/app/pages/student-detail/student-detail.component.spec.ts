import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ActivatedRoute, convertToParamMap, provideRouter} from '@angular/router';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';

import {StudentDetailComponent} from './student-detail.component';
import {Student} from '../../core/models/Student';
import {StudentService} from '../../core/service/student.service';
import {of, throwError} from 'rxjs';

describe('StudentDetailComponent', () => {
  let component: StudentDetailComponent;
  let fixture: ComponentFixture<StudentDetailComponent>;

  // Faux StudentService : chaque méthode est une fonction espion (jest.fn)
  const studentServiceMock = {
    getById: jest.fn(),
  };

  const student: Student = {
    id: 1,
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean@mail.com',
    created_at: '2026-11-06T10:00:00',
    updated_at: '2026-11-06T10:00:00',
  };

  beforeEach(async () => {
    jest.clearAllMocks(); // remet les compteurs d'appels à zéro entre les tests
    await TestBed.configureTestingModule({
      imports: [StudentDetailComponent],
      providers: [
        provideRouter([]),
        { provide: StudentService, useValue: studentServiceMock },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ id: '1' }) } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it("should find student detail by ID", () => {
    studentServiceMock.getById.mockReturnValue(of(student));

    fixture.detectChanges();

    expect(studentServiceMock.getById).toHaveBeenCalledWith(1);
    expect(component.student).toEqual(student);
    expect(component.errorMessage).toBe("");
    expect(fixture.nativeElement.textContent).toContain('Jean');
    expect(fixture.nativeElement.textContent).toContain('jean@mail.com');
  });

  it("should throw error when student is not found", () => {
    //given
    studentServiceMock.getById.mockReturnValue(throwError(() => new Error('Erreur')));
    //when
    fixture.detectChanges();
    //then
    expect(component.errorMessage).toContain("Étudiant introuvable");
    expect(component.student).toEqual(null);
    expect(fixture.nativeElement.textContent).toContain('Étudiant introuvable');

  });

});
