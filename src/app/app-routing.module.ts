import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './aut/register/register.component';
import { LoginComponent } from './auth/login/login.component';

const routes: Routes = [
{
  path:'login',
  component:LoginComponent
},
{
 path:'register',
 component:RegisterComponent 
},
{
  path:'admin',
  loadChildren:()=>import('./admin/admin.module').then(mod=>mod.AdminModule)
},
{
  path:'',
  pathMatch:'full',
  redirectTo:'/login'
}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
