import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {QrIdFormPage} from './qr-id-form.page';
import {NgxQRCodeModule} from 'ngx-qrcode2';

const routes: Routes = [
    {
        path: '',
        component: QrIdFormPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        NgxQRCodeModule,
        RouterModule.forChild(routes)
    ],
    declarations: [QrIdFormPage]
})
export class QrIdFormPageModule {
}
