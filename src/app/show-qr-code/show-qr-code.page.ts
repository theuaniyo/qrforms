import {Component, OnInit} from '@angular/core';
import {MenuController, ModalController, NavParams} from '@ionic/angular';

@Component({
    selector: 'app-show-qr-code',
    templateUrl: './show-qr-code.page.html',
    styleUrls: ['./show-qr-code.page.scss'],
})
export class ShowQrCodePage implements OnInit {

    qrData;
    createdQr = null;

    constructor(private modalController: ModalController,
                private navParams: NavParams,
                private menuCtrl: MenuController) {
    }

    ionViewDidEnter() {
        this.menuCtrl.enable(false);
    }

    ngOnInit() {
        this.createCode();
    }

    /**
     * Genera el código QR
     */
    createCode() {
        if (this.navParams.get('type') == 'qrID') {
            this.qrData = {
                docId: this.navParams.get('docId'),
                tag: this.navParams.get('tag')
            };
        } else if (this.navParams.get('type') == 'form') {
            this.qrData = {
                docId: this.navParams.get('docId'),
                index: this.navParams.get('index')
            };
        }
        console.log(this.qrData);

        this.createdQr = JSON.stringify(this.qrData);
    }

    closeModal() {
        this.modalController.dismiss().then(value => console.log(value));
    }
}
