import {Component, ViewChild} from '@angular/core';
import {IonSlides, ModalController} from '@ionic/angular';
import {AutenticationService} from '../services/firebase/autentication/autentication.service';
import {Router} from '@angular/router';
import {StorageService} from '../services/firebase/storage/storage.service';
import {ShowQrCodePage} from '../show-qr-code/show-qr-code.page';
import {FillFormComponent} from '../fill-form/fill-form.component';

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

    constructor(private fireAuth: AutenticationService,
                private router: Router,
                private fireStorage: StorageService,
                private modalController: ModalController) {
    }

    ionViewDidEnter() {
        this.SwipedTabsIndicator = document.getElementById('indicator');
        // PARA QUE CUANDO RECARGUE EL EMULADOR DEL MÓVIL VUELVA A LA PÁGINA DE LOGIN ¿CÓMO SE MANTIENE LA SESIÓN INICIADA?
        this.fireAuth.isLogged()
            .then(isLogged => {
                if (isLogged) {
                    this.getCurrentUser().then(email => {
                        this.currentUser = email;
                        this.hasQrId();
                        this.refreshForms();
                    });
                } else {
                    this.router.navigate(['/login'])
                        .catch(reason => console.log(reason));
                    this.qrId = false;
                }
            });
    }

    refreshForms() {
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
            console.log('Opening form');
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

    async presentFillFormModal(formData) {
        const modal = await this.modalController.create({
            component: FillFormComponent,
            componentProps: {
                title: formData.title,
                fields: formData.fields
            }
        });
        await modal.present();
        await modal.onDidDismiss()
            .then(() => {
                this.refreshForms();
            });
    }

    openFillForm(index: number) {
        this.fireStorage.getPendingForm(this.pendingForms[index].docId)
            .then(formsDoc => {
                const form = {
                    title: this.pendingForms[index].title,
                    fields: formsDoc.forms[this.pendingForms[index].title]
                };
                this.presentFillFormModal(form)
                    .then(() => {
                        console.log('Opening fill form modal');
                    })
                    .catch(reason => console.error(reason));
            });
    }

    openQrScanner() {
        this.router.navigate(['/qr-scanner'])
            .then(() => console.log('Opening QR Scanner'));
    }
}
