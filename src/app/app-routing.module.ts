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
    {
        path: 'qr-scanner',
        loadChildren: './qr-scanner/qr-scanner.module#QrScannerPageModule'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
