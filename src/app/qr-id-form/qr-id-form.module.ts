import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {QrIdFormPage} from './qr-id-form.page';
import {NgxQRCodeModule} from 'ngx-qrcode2';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {setTranslateLoader} from '../app.module';

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
        RouterModule.forChild(routes),
        HttpClientModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: (setTranslateLoader),
                deps: [HttpClient]
            }
        })
    ],
    declarations: [QrIdFormPage]
})
export class QrIdFormPageModule {
}
