import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';

import { StudentFormComponent } from './student-form.component';
import { StudentService } from '../../core/service/student.service';
import { Student } from '../../core/models/Student';

describe('StudentFormComponent', () => {
  let component: StudentFormComponent;
  let fixture: ComponentFixture<StudentFormComponent>;
  let router: Router;

  // Faux StudentService : chaque méthode est une fonction espion (jest.fn)
  const studentServiceMock = {
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };

  const student: Student = {
    id: 1,
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean@mail.com',
    created_at: '2026-11-06T10:00:00',
    updated_at: '2026-11-06T10:00:00',
  };

  // Fabrique le composant avec un id dans l'URL (mode modif) ou sans (mode ajout)
  async function setup(id: string | null) {
    jest.clearAllMocks();
    await TestBed.configureTestingModule({
      imports: [StudentFormComponent],
      providers: [
        provideRouter([]),
        { provide: StudentService, useValue: studentServiceMock },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap(id ? { id } : {}) } },
        },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture = TestBed.createComponent(StudentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // déclenche ngOnInit
  }

  describe('mode ajout (pas d\'id dans l\'URL)', () => {
    beforeEach(async () => {
      await setup(null);
    });

    it('should start with an empty form and no studentId', () => {
      expect(component.studentId).toBeNull();
      expect(studentServiceMock.getById).not.toHaveBeenCalled();
      expect(component.studentForm.value).toEqual({ firstName: '', lastName: '', email: '' });
    });

    it('should not call the service when the form is invalid', () => {
      component.onSubmit();
      fixture.detectChanges(); // met à jour le HTML après le clic

      expect(component.submitted).toBe(true);
      expect(studentServiceMock.create).not.toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
      expect(fixture.nativeElement.textContent).toContain('Le prénom est obligatoire');
    });

    it('should create the student and go back to the list when the form is valid', () => {
      studentServiceMock.create.mockReturnValue(of(undefined));
      component.studentForm.setValue({ firstName: 'Jean', lastName: 'Dupont', email: 'jean@mail.com' });

      component.onSubmit();

      expect(studentServiceMock.create).toHaveBeenCalledWith({
        firstName: 'Jean', lastName: 'Dupont', email: 'jean@mail.com',
      });
      expect(studentServiceMock.update).not.toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/students']);
    });
  });

  describe('mode modification (id = 1 dans l\'URL)', () => {
    beforeEach(async () => {
      studentServiceMock.getById.mockReturnValue(of(student));
      await setup('1');
    });

    it('should load the student and pre-fill the form', () => {
      expect(component.studentId).toBe(1);
      expect(studentServiceMock.getById).toHaveBeenCalledWith(1);
      expect(component.studentForm.value).toEqual({
        firstName: 'Jean', lastName: 'Dupont', email: 'jean@mail.com',
      });
    });

    it('should update the student and go back to the list', () => {
      studentServiceMock.update.mockReturnValue(of(student));
      component.studentForm.patchValue({ firstName: 'Paul' });

      component.onSubmit();

      expect(studentServiceMock.update).toHaveBeenCalledWith(1, {
        firstName: 'Paul', lastName: 'Dupont', email: 'jean@mail.com',
      });
      expect(studentServiceMock.create).not.toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/students']);
    });
  });
});
