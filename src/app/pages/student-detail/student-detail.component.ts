import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {StudentService} from '../../core/service/student.service';
import {Student} from '../../core/models/Student';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-student-detail',
  imports: [RouterLink, DatePipe],
  templateUrl: './student-detail.component.html',
  styleUrl: './student-detail.component.css'
})
export class StudentDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private studentService = inject(StudentService);
  private destroyRef = inject(DestroyRef);
  student: Student | null = null;
  errorMessage: string = "";

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.studentService.getById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data: Student) => {
          this.student = data;
        },
        error: () => {
          this.errorMessage = 'Étudiant introuvable';
        }
      });
  }
}
