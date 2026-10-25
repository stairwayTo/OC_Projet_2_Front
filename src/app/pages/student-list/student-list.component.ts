import {Component, DestroyRef, inject} from '@angular/core';
import {StudentService} from '../../core/service/student.service';
import {Student} from '../../core/models/Student';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-student-list',
  imports: [RouterLink],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.css'
})
export class StudentListComponent {
  private studentService = inject(StudentService);
  private destroyRef = inject(DestroyRef);
  students: Student[] = [];
  errorMessage: string = '';

  ngOnInit() {
    this.loadStudents();
  }
  loadStudents(): void {
    this.studentService.getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data: Student[]) => {
          this.students = data;
        },
        error: () => {
          this.errorMessage = 'Erreur de chargement des étudiants';
        }
      });
  }
  deleteStudent(id : number): void {
    if (!confirm('Supprimer cet étudiant ?')) {
      return;
    }
    this.studentService.delete(id)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: () => {this.loadStudents();},
      error:() => {this.errorMessage = 'Erreur lors de la suppression'}
    })
  }

}
