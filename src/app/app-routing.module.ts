import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadChildren: './login/login.module#LoginPageModule'
    },
    {
        path: 'home',
        loadChildren: './home/home.module#HomePageModule'
    },
    {
        path: 'signup',
        loadChildren: './signup/signup.module#SignupPageModule'
    },
    {
        path: 'qr-id-form',
        loadChildren: './qr-id-form/qr-id-form.module#QrIdFormPageModule'
    },
  { path: 'show-qr-code', loadChildren: './show-qr-code/show-qr-code.module#ShowQrCodePageModule' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
