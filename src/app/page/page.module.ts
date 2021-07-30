import { FormsModule } from '@angular/forms';
import { ProfileComponent } from './profile/profile.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageComponent } from './page.component';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CoursesComponent } from './courses/courses.component';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AutosizeModule } from 'ngx-autosize';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  {
    path: '',
    component: PageComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'courses',
        component: CoursesComponent,
      },
      {
        path: 'users',
        component: UsersComponent,
      },
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
      }
    ]
  }
]

@NgModule({
  declarations: [
    PageComponent,
    HomeComponent,
    ProfileComponent,
    CoursesComponent,
    NavbarComponent,
    UsersComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    NgbModule,
    FormsModule,
    AutosizeModule,
    CommonModule
  ],
})
export class PageModule { }
