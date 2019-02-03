import {Component, ViewChild} from '@angular/core';
import {IonSlides, ModalController, NavController, NavParams} from '@ionic/angular';
import {AutenticationService} from '../services/firebase/autentication/autentication.service';
import {Router} from '@angular/router';
import {StorageService} from '../services/firebase/storage/storage.service';
import {ShowQrCodePage} from '../show-qr-code/show-qr-code.page';
import {QRScanner, QRScannerStatus} from '@ionic-native/qr-scanner/ngx';
import {FillFormComponent} from '../fill-form/fill-form.component';
import {NativeStorage} from '@ionic-native/native-storage/ngx';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {
    @ViewChild('SwipedTabsSlider') SwipedTabsSlider: IonSlides;

    SwipedTabsIndicator: any = null;
    tabs = ['selectTab(0)', 'selectTab(1)', 'selectTab(2)'];
    public category: any = '0';
    ntabs = 3;
    currentUser: any;
    qrId: boolean;
    formID: any;
    pendingForms: any[];
    filledForms: any[];
    fillingForm: any;

    constructor(private fireAuth: AutenticationService,
                private router: Router,
                private fireStorage: StorageService,
                private modalController: ModalController,
                private qrScanner: QRScanner,
                private nativeStorage: NativeStorage) {
    }

    ionViewDidEnter() {
        this.SwipedTabsIndicator = document.getElementById('indicator');
        // PARA QUE CUANDO RECARGUE EL EMULADOR DEL MÓVIL VUELVA A LA PÁGINA DE LOGIN ¿CÓMO SE MANTIENE LA SESIÓN INICIADA?
        this.fireAuth.isLogged()
            .subscribe(isLogged => {
                if (isLogged) {
                    this.getCurrentUser().then(email => {
                        this.currentUser = email;
                        this.hasQrId();
                        this.loadPendingForms()
                            .then(pending => {
                                this.pendingForms = pending;
                                if (this.pendingForms.length === 0) {
                                    console.log('Pending forms empty!');
                                }
                            });
                        this.loadFilledForms()
                            .then(filled => {
                                this.filledForms = filled;
                                if (this.filledForms.length === 0) {
                                    console.log('Filled forms empty!');
                                }
                            });
                    });
                } else {
                    this.router.navigate(['/login'])
                        .catch(reason => console.log(reason));
                    this.qrId = false;
                }
            });
    }

    /* Actualiza la categoría que esté en ese momento activa*/
    updateCat(cat: Promise<any>) {
        cat.then(dat => {
            this.category = dat;
            this.category = +this.category;
        });
    }

    /* El método que permite actualizar el indicado cuando se cambia de slide*/
    updateIndicatorPosition() {
        this.SwipedTabsSlider.getActiveIndex()
            .then(i => {
                if (this.ntabs > i) {  // this condition is to avoid passing to incorrect index
                    this.SwipedTabsIndicator.style.webkitTransform = 'translate3d(' + (i * 100) + '%,0,0)';
                }
            });
    }

    /* El método que anima la "rayita" mientras nos estamos deslizando por el slide*/
    animateIndicator(e) {
        // console.log(e.target.swiper.progress);
        if (this.SwipedTabsIndicator) {
            this.SwipedTabsIndicator.style.webkitTransform = 'translate3d(' +
                ((e.target.swiper.progress * (this.ntabs - 1)) * 100) + '%,0,0)';
        }
    }

    getCurrentUser() {
        return this.fireAuth.getCurrentUser();
    }

    hasQrId() {
        this.fireStorage.hasQrID(this.currentUser)
            .then(value => {
                this.qrId = value;
            });
    }

    goToQrIdForm() {
        this.router.navigate(['/qr-id-form'])
            .then(value => console.log(value))
            .catch(reason => console.log(reason));
    }

    showQrCode(type, index) {
        this.fireStorage.getUserDocId(this.currentUser)
            .then(docId => {
                if (type == 'qrID') {
                    this.formID = {
                        type: 'qrID',
                        docId: docId,
                        tag: 'qrId'
                    };
                } else if (type == 'form') {
                    this.formID = {
                        type: 'form',
                        docId: docId,
                        index: index
                    };
                }
                this.presentQrIdModal(this.formID)
                    .catch(reason => console.log(reason));
            });
    }

    async presentQrIdModal(data) {
        if (data.type == 'qrID') {
            console.log('Mostrando QR ID');
            const modal = await this.modalController.create({
                component: ShowQrCodePage,
                componentProps: {
                    type: data.type,
                    docId: data.docId,
                    tag: data.tag
                }
            });
            await modal.present();
        } else if (data.type == 'form') {
            console.log('Mostrando formulario');
            const modal = await this.modalController.create({
                component: ShowQrCodePage,
                componentProps: {
                    type: data.type,
                    docId: data.docId,
                    index: data.index
                }
            });
            await modal.present();
        }
    }

    loadPendingForms() {
        return this.fireStorage.loadPendingForms(this.currentUser)
            .then(pending => {
                return pending;
            })
            .catch(reason => console.error(reason));
    }

    loadFilledForms() {
        return this.fireStorage.loadFilledForms(this.currentUser)
            .then(filled => {
                return filled;
            })
            .catch(reason => console.error(reason));
    }

    async presentFillFormModal(form) {
        const modal = await this.modalController.create({
            component: FillFormComponent,
            componentProps: {
                title: form.title,
                fields: form.fields
            }
        });
        await modal.present();
        await modal.onDidDismiss()
            .then(() => {
                this.getCurrentUser()
                    .then(email => {
                        console.log(email);
                        this.currentUser = email;
                        this.loadPendingForms()
                            .then(pending => {
                                console.log(pending);
                                this.pendingForms = pending;
                                console.log(this.pendingForms);
                                this.nativeStorage.getItem('fillingFormIndex')
                                    .then(index => {
                                        this.pendingForms.splice(index, 1);
                                        console.log(this.pendingForms);
                                        this.fireStorage.updatePendingForms(this.pendingForms)
                                            .then(() => {
                                                console.log('Pending forms updated');
                                            });
                                    });
                            });
                    });
            });
    }

    openFillForm(index: number) {
        this.presentFillFormModal(this.pendingForms[index])
            .then(() => {
                this.nativeStorage.setItem('fillingFormIndex', index)
                    .catch(reason => console.error(reason));
                console.log('Opening fill form modal');
            })
            .catch(reason => console.error(reason));
    }
}
