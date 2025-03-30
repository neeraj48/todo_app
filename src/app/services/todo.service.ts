import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private apiUrl = 'https://dummyjson.com/todos';

  constructor(private http: HttpClient) {}

  getTodos(): Observable<Todo[]> {
    return this.http.get<{ todos: Todo[] }>(`${this.apiUrl}`).pipe(
      map((response) =>
        response.todos.map((todo) => ({
          ...todo,
          status: todo.completed ? 'completed' : 'pending',
        }))
      )
    );
  }

  addTodo(todo: Partial<Todo>): Observable<Todo> {
    return this.http.post<Todo>(`${this.apiUrl}/add`, todo);
  }

  updateTodo(id: number, todo: Partial<Todo>): Observable<Todo> {
    return this.http.put<Todo>(`${this.apiUrl}/${id}`, todo);
  }

  deleteTodo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
