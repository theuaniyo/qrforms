import {Component, ViewChild} from '@angular/core';
import {IonSlides, ModalController} from '@ionic/angular';
import {AutenticationService} from '../services/firebase/autentication/autentication.service';
import {Router} from '@angular/router';
import {StorageService} from '../services/firebase/storage/storage.service';
import {ShowQrCodePage} from '../show-qr-code/show-qr-code.page';

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
    formID: any = [];

    constructor(private fireAuth: AutenticationService,
                private router: Router,
                private fireStorage: StorageService,
                private modalController: ModalController) {
    }

    ionViewDidEnter() {
        this.SwipedTabsIndicator = document.getElementById('indicator');
        // PARA QUE CUANDO RECARGUE EL EMULADOR DEL MÓVIL VUELVA A LA PÁGINA DE LOGIN ¿CÓMO SE MANTIENE LA SESIÓN INICIADA?
        this.fireAuth.isLogged()
            .subscribe(isLogged => {
                if (isLogged) {
                    this.currentUser = this.getCurrentUser();
                    this.hasQrId();
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

    showQrIdCode() {
        this.fireStorage.getDocId(this.currentUser)
            .then(value => {
                this.formID = {
                    docId: value,
                    tag: 'qrId'
                };
            });
        this.presentModal(this.formID)
            .then(value => console.log(value))
            .catch(reason => console.log(reason));
    }

    async presentModal(data) {
        const modal = await this.modalController.create({
            component: ShowQrCodePage,
            componentProps: {
                docId: data.docId,
                tag: data.tag
            }

        });
        await modal.present();
    }
}
