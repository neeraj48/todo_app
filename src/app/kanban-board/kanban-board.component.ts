import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Todo } from '../models/todo.model';
import { TodoService } from '../services/todo.service';
import { TodoDialogComponent } from '../components/todo-dialog/todo-dialog.component';

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatSnackBarModule,
    DragDropModule,
  ],
  templateUrl: './kanban-board.component.html',
  styleUrl: './kanban-board.component.css',
})
export class KanbanBoardComponent {
  todos: Todo[] = [];
  lanes = [
    { title: 'Pending', status: 'pending' },
    { title: 'In Progress', status: 'in-progress' },
    { title: 'Completed', status: 'completed' },
  ];

  constructor(
    private todoService: TodoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadTodos();
  }

  loadTodos() {
    this.todoService
      .getTodos()
      .pipe(
        catchError((error) => {
          this.showError('Failed to load todos');
          return of([]);
        })
      )
      .subscribe((todos) => {
        console.log(todos);
        this.todos = todos;
      });
  }

  getTodosByStatus(status: string): Todo[] {
    return this.todos.filter((todo) => todo.status === status);
  }

  getConnectedLists(): string[] {
    return this.lanes.map((lane) => lane.status);
  }

  drop(event: CdkDragDrop<Todo[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      const todo = event.item.data as Todo;
      const newStatus = event.container.id;

      this.todoService
        .updateTodo(todo.id, {
          ...todo,
          status: newStatus as 'pending' | 'in-progress' | 'completed',
        })
        .pipe(
          catchError((error) => {
            // this.showError('Failed to update todo status');
            return of(null);
          })
        )
        .subscribe((updatedTodo) => {
          // if (updatedTodo) {
          transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex
          );
          const index = this.todos.findIndex((t) => t.id === todo.id);
          if (index !== -1) {
            this.todos[index] = {
              ...todo,
              status: newStatus as 'pending' | 'in-progress' | 'completed',
            };
          }
          this.showSuccess('Todo status updated successfully');
          // }
        });
    }
  }

  addTodo() {
    const dialogRef = this.dialog.open(TodoDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.todoService
          .addTodo({
            ...result,
            id: this.todos.length + 1,
            userId: this.todos.length + 1,
            completed: false,
            status: 'pending',
          })
          .pipe(
            catchError((error) => {
              this.showError('Failed to add todo');
              return of(null);
            })
          )
          .subscribe((newTodo) => {
            let tempDoto: any = {
              ...newTodo,
              id: this.todos.length + 1,
              userId: this.todos.length + 1,
              completed: false,
              status: 'in-progress',
            };
            if (newTodo) {
              this.todos.push(tempDoto);
              this.showSuccess('Todo added successfully');
            }
          });
      }
    });
  }

  editTodo(todo: Todo) {
    const dialogRef = this.dialog.open(TodoDialogComponent, {
      data: todo,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.todoService
          .updateTodo(todo.id, {
            ...result,
            userId: todo?.userId,
            completed: todo?.completed,
            status: todo?.status,
          })
          .pipe(
            catchError((error) => {
              this.showError('Failed to update todo');
              return of(null);
            })
          )
          .subscribe((updatedTodo) => {
            if (updatedTodo) {
              const index = this.todos.findIndex((t) => t.id === todo.id);
              if (index !== -1) {
                this.todos[index] = { ...updatedTodo, status: todo.status };
                this.showSuccess('Todo updated successfully');
              }
            }
          });
      }
    });
  }

  deleteTodo(todo: Todo) {
    this.todoService
      .deleteTodo(todo.id)
      .pipe(
        catchError((error) => {
          this.showError('Failed to delete todo');
          return of(null);
        })
      )
      .subscribe((response) => {
        if (response !== null) {
          this.todos = this.todos.filter((t) => t.id !== todo.id);
          this.showSuccess('Todo deleted successfully');
        }
      });
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['error-snackbar'],
    });
  }

  private showSuccess(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar'],
    });
  }
}
