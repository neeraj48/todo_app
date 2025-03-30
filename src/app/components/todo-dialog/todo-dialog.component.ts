import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Todo } from '../../models/todo.model';
// import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-dialog',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './todo-dialog.component.html',
  styleUrl: './todo-dialog.component.css'
})
export class TodoDialogComponent {
  todoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TodoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Todo | null
  ) {
    this.todoForm = this.fb.group({
      todo: [data?.todo || '', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.todoForm.valid) {
      this.dialogRef.close(this.todoForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
