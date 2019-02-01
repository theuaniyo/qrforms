import {Component, OnInit, OnDestroy} from '@angular/core';
import {QRScanner, QRScannerStatus} from '@ionic-native/qr-scanner/ngx';
import {Dialogs} from '@ionic-native/dialogs/ngx';
import {Vibration} from '@ionic-native/vibration/ngx';

@Component({
    selector: 'app-qr-scanner',
    templateUrl: './qr-scanner.page.html',
    styleUrls: ['./qr-scanner.page.scss'],
})
export class QrScannerPage implements OnInit, OnDestroy {

    data: any;
    scanSub: any;

    constructor(private qrScanner: QRScanner,
                private dialogs: Dialogs,
                private vibration: Vibration) {
    }

    ngOnInit() {
    }

    ionViewWillLeave() {
        window.document.querySelector('ion-app').classList.remove('cameraView');
        this.qrScanner.hide().then(() => {
            this.qrScanner.destroy();
        });
    }

    ngOnDestroy() {
        window.document.querySelector('ion-app').classList.remove('cameraView');
        this.qrScanner.hide().then(() => {
            this.qrScanner.destroy();
        }); // hide camera preview
    }

    ionViewWillEnter() {
        this.data = null;
        this.qrScanner.prepare()
            .then((status: QRScannerStatus) => {
                if (status.authorized) {
                    this.qrScanner.show();
                    window.document.querySelector('ion-app').classList.add('cameraView');
                    this.scanSub = this.qrScanner.scan().subscribe(value => {
                        this.data = JSON.stringify(value);

                    });
                } else if (status.denied) {
                    console.log('denied');
                    this.qrScanner.openSettings();
                } else {
                    // permission was denied, but not permanently. You can ask for permission again at a later time.
                    console.log('other denied');
                }
            })
            .catch((e: any) => console.log('Error is', e));
    }
}
