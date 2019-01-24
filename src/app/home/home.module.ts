import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule, ModalController} from '@ionic/angular';
import {RouterModule} from '@angular/router';

import {HomePage} from './home.page';
import {ShowQrCodePage} from '../show-qr-code/show-qr-code.page';
import {NgxQRCodeModule} from 'ngx-qrcode2';

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
        ])
    ],
    declarations: [HomePage, ShowQrCodePage],
    entryComponents: [ShowQrCodePage]
})
export class HomePageModule {
}
