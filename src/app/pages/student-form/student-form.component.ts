import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from '../../shared/material.module';
import {StudentService} from '../../core/service/student.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Student} from '../../core/models/Student';
import {StudentRequest} from '../../core/models/StudentRequest';

@Component({
  selector: 'app-student-form',
  imports: [CommonModule, MaterialModule, RouterLink],
  templateUrl: './student-form.component.html',
  styleUrl: './student-form.component.css'
})
export class StudentFormComponent implements OnInit {
  private studentService = inject(StudentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private formBuilder = inject(FormBuilder);
  studentForm: FormGroup = new FormGroup({});
  submitted: boolean = false;
  studentId: number | null = null;

  ngOnInit() {
    this.studentForm = this.formBuilder.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
      },
    );
    const id = this.route.snapshot.paramMap.get('id'); // pas number ici sinon jamais null
    if (id) {
      this.studentId = Number(id);
      this.studentService.getById(this.studentId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((student: Student) => {
          this.studentForm.patchValue(student);
        });
    }
  }

  get form() {
    return this.studentForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.studentForm.invalid) {
      return;
    }
      const studentRequest: StudentRequest = {
        firstName: this.studentForm.get('firstName')?.value,
        lastName: this.studentForm.get('lastName')?.value,
        email: this.studentForm.get('email')?.value,
      };
    if (this.studentId !== null) {
      this.studentService.update(this.studentId, studentRequest)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.goBackToList());
    } else {
      this.studentService.create(studentRequest)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.goBackToList());
    }
  }
  private goBackToList(): void {
    this.router.navigate(['/students']);
  }
}


