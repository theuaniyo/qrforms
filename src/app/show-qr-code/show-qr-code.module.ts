import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {ShowQrCodePage} from './show-qr-code.page';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {setTranslateLoader} from '../app.module';

const routes: Routes = [
    {
        path: '',
        component: ShowQrCodePage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
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
    declarations: []
})
export class ShowQrCodePageModule {
}
