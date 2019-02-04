import {Component, OnDestroy, OnInit} from '@angular/core';
import {QRScanner, QRScannerStatus} from '@ionic-native/qr-scanner/ngx';
import {Dialogs} from '@ionic-native/dialogs/ngx';
import {Vibration} from '@ionic-native/vibration/ngx';
import {Router} from '@angular/router';
import {StorageService} from '../services/firebase/storage/storage.service';

@Component({
    selector: 'app-qr-scanner',
    templateUrl: './qr-scanner.page.html',
    styleUrls: ['./qr-scanner.page.scss'],
})
export class QrScannerPage implements OnInit, OnDestroy {

    data: any;
    scanSub: any;

    constructor(private qrScanner: QRScanner,
                private router: Router,
                private fireStorage: StorageService) {
    }

    ionViewWillLeave() {
        // Es llamado cuando realizamos una navegación porque ya hemos escaneado el QR
        window.document.querySelector('ion-app').classList.remove('cameraView');
        this.qrScanner.hide().then(() => {
            this.qrScanner.destroy();
        });
    }

    ngOnDestroy() {
        // Es llamado cuando salimos de la página pulsando el botón atrás.
        window.document.querySelector('ion-app').classList.remove('cameraView');
        this.qrScanner.hide().then(() => {
            this.qrScanner.destroy().then(() => console.log('Destroying QR Scanner'));
        });
    }

    ngOnInit() {
    }

    ionViewWillEnter() {
        this.qrScanner.prepare()
            .then((status: QRScannerStatus) => {
                // Cámara preparada
                if (status.authorized) {
                    this.qrScanner.show();  // Mostramos cámara
                    window.document.querySelector('ion-app').classList.add('cameraView');  // ocultamos vista de la app
                    this.scanSub = this.qrScanner.scan().subscribe((d) => {
                        console.log('Read something: ', d);  // Hemos leído un QR y vamos a analizarlo
                        this.readQrCode(d).then(result => {
                            if (result) {
                                console.log('Form added');
                                this.router.navigate(['/home'])
                                    .then(() => {
                                        console.log('Returning to home page');
                                    });
                            } else {
                                console.log('Failed to add form');
                            }
                        });
                    });
                } else if (status.denied) {
                    /* No hay permisos, abrimos configuración de permisos*/
                    console.log('denied');
                    this.qrScanner.openSettings();
                } else {
                    // permission was denied, but not permanently. You can ask for permission again at a later time.
                    console.log('other denied');
                }
            })
            .catch((e: any) => console.log('Error is', e));
    }

    pauseQR() {
        this.qrScanner.hide();
        this.qrScanner.pausePreview();
        window.document.querySelector('ion-app').classList.remove('cameraView');
    }

    resumeQR() {
        this.qrScanner.show();
        this.qrScanner.resumePreview();
        this.scanSub = this.qrScanner.scan().subscribe((d) => {
            console.log('Read something', d);
        });
        window.document.querySelector('ion-app').classList.add('cameraView');
    }

    closeQR() {
        window.document.querySelector('ion-app').classList.remove('cameraView');
        this.qrScanner.hide().then(() => {
            this.qrScanner.destroy();
        });
        this.scanSub.unsubscribe(); // stop scanning
    }

    returnToHomePage() {
        this.router.navigate(['/home'])
            .then(() => {
                console.log('Leaving QR Scanner');
                this.qrScanner.destroy();
            });
    }

    readQrCode(data) {
        return this.fireStorage.addForm(data);
    }
}
