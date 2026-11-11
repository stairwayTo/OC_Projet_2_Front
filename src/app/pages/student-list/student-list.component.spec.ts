import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { StudentListComponent } from './student-list.component';
import {Student} from '../../core/models/Student';
import {StudentService} from '../../core/service/student.service';
import {of, throwError} from 'rxjs';

describe('StudentListComponent', () => {
  let component: StudentListComponent;
  let fixture: ComponentFixture<StudentListComponent>;

  const studentServiceMock = {
    getAll: jest.fn(),
    delete: jest.fn(),
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
    jest.clearAllMocks();
    await TestBed.configureTestingModule({
      imports: [StudentListComponent],
      providers: [
        provideRouter([]),
        { provide: StudentService, useValue: studentServiceMock }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(StudentListComponent);
    component = fixture.componentInstance;
    //fixture.detectChanges();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it("should load student list with correct values", () => {
    //given
    studentServiceMock.getAll.mockReturnValue(of([student]));
    //when
    fixture.detectChanges();
    //then
    expect(studentServiceMock.getAll).toHaveBeenCalled();
    expect(component.students).toEqual([student]);
    expect(fixture.nativeElement.textContent).toContain('Jean');


  });
  it("error on loading student list", () => {
    //given
    studentServiceMock.getAll.mockReturnValue(throwError(() => new Error('Erreur')));
    //when
    fixture.detectChanges();
    //then
    expect(component.errorMessage).toContain("Erreur de chargement des étudiants");
    expect(component.students).toEqual([]);
    expect(fixture.nativeElement.textContent).toContain('Erreur de chargement des étudiants');

  });
  it("delete student list", async () => {
    studentServiceMock.getAll.mockReturnValue(of([student]));
    studentServiceMock.delete.mockReturnValue(of(undefined));

    fixture.detectChanges();
    //button comfrim delete
    jest.spyOn(window, 'confirm').mockReturnValue(true);
    component.deleteStudent(student.id);

    expect(studentServiceMock.delete).toHaveBeenCalledWith(1);
    expect(studentServiceMock.getAll).toHaveBeenCalledTimes(2);
    //pop up confirm
    expect(window.confirm).toHaveBeenCalledWith('Supprimer cet étudiant ?');

  });
  it("delete cancel on confirm", async () => {
    studentServiceMock.getAll.mockReturnValue(of([student]));
    studentServiceMock.delete.mockReturnValue(of(undefined));

    fixture.detectChanges();
    //button comfrim delete
    jest.spyOn(window, 'confirm').mockReturnValue(false);
    component.deleteStudent(student.id);

    expect(studentServiceMock.delete).not.toHaveBeenCalled();
    expect(studentServiceMock.getAll).toHaveBeenCalledTimes(1);
  });
  it("delete student confirmed but error", async () => {
    studentServiceMock.getAll.mockReturnValue(of([student]));
    studentServiceMock.delete.mockReturnValue(throwError(() => new Error('Erreur')));

    jest.spyOn(window, 'confirm').mockReturnValue(true);
    component.deleteStudent(student.id);
    fixture.detectChanges();

    expect(component.errorMessage).toContain("Erreur lors de la suppression");
    expect(studentServiceMock.getAll).toHaveBeenCalledTimes(1);
    expect(fixture.nativeElement.textContent).toContain('Erreur lors de la suppression');
  });
});
