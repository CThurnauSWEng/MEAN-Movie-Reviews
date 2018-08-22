import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddComponent } from './add/add.component';
import { UpdatereviewComponent } from './updatereview/updatereview.component';
import { ShowreviewComponent } from './showreview/showreview.component';
import { AddreviewComponent } from './addreview/addreview.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { path: 'movies/new', component: AddComponent},
  { path: 'movies', component: DashboardComponent},
  { path: 'edit/:id', component: UpdatereviewComponent},
  { path: 'movies/:id', component: ShowreviewComponent},
  { path: 'movies/review/:id', component: AddreviewComponent},
  { path: '', component: DashboardComponent},
  { path: '', pathMatch: 'full', redirectTo: '/movies'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
