import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { GradesFormComponent } from './grades-form/grades-form.component';
import { GradesResultsComponent } from './grades-results/grades-results.component';
import { HomeComponent } from './home/home.component';
import { LoginPageComponent } from './login-page/login-page.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'gradesCalculator', component: GradesFormComponent },
  { path: 'gradesResults', component: GradesResultsComponent },
  { path: 'login', component:  LoginPageComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
