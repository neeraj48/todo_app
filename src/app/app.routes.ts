import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'kanban-board', pathMatch: 'full' },
  {
    path: 'kanban-board',
    loadComponent: () =>
      import('./kanban-board/kanban-board.component').then(
        (m) => m.KanbanBoardComponent
      ),
  },
  {
    path: 'not-found',
    loadComponent: () =>
      import('./not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
  { path: '**', redirectTo: 'not-found' },
];
