import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule, ModalController} from '@ionic/angular';
import {RouterModule} from '@angular/router';

import {HomePage} from './home.page';
import {ShowQrCodePage} from '../show-qr-code/show-qr-code.page';
import {NgxQRCodeModule} from 'ngx-qrcode2';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {setTranslateLoader} from '../app.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        NgxQRCodeModule,
        RouterModule.forChild([
            {
                path: '',
                component: HomePage
            }
        ]),
        HttpClientModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: (setTranslateLoader),
                deps: [HttpClient]
            }
        })
    ],
    declarations: [HomePage, ShowQrCodePage],
    entryComponents: [ShowQrCodePage]
})
export class HomePageModule {
}
