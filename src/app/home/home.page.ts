import {Component, ViewChild} from '@angular/core';
import {IonSlides, LoadingController, MenuController, ModalController, ToastController} from '@ionic/angular';
import {AutenticationService} from '../services/firebase/autentication/autentication.service';
import {Router} from '@angular/router';
import {StorageService} from '../services/firebase/storage/storage.service';
import {ShowQrCodePage} from '../show-qr-code/show-qr-code.page';
import {FillFormComponent} from '../fill-form/fill-form.component';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {
    @ViewChild('SwipedTabsSlider') SwipedTabsSlider: IonSlides;

    SwipedTabsIndicator: any = null;
    tabs = ['selectTab(0)', 'selectTab(1)'];
    public category: any = '0';
    ntabs = 2;
    currentUser: any;
    qrId: boolean;
    formID: any;
    pendingForms: any[];
    filledForms: any[];
    filteredFilled: any[];
    filteredPending: any[];

    /**
     * @param fireAuth
     * @param router
     * @param fireStorage
     * @param modalController
     * @param menuCtrl
     * @param loadingController
     * @param toast
     * @param translate
     */
    constructor(private fireAuth: AutenticationService,
                private router: Router,
                private fireStorage: StorageService,
                private modalController: ModalController,
                private menuCtrl: MenuController,
                private loadingController: LoadingController,
                private toast: ToastController,
                private translate: TranslateService) {
    }

    ionViewDidEnter() {
        this.menuCtrl.enable(true);
        this.SwipedTabsIndicator = document.getElementById('indicator');
        this.presentLoading()
            .then(() => {
                this.fireAuth.isLogged()
                    .then(isLogged => {
                        if (isLogged) {
                            this.getCurrentUser()
                                .then(email => {
                                    this.currentUser = email;
                                    this.hasQrId()
                                        .then(hasQrId => {
                                            this.qrId = hasQrId;
                                            this.refreshForms()
                                                .then(dataLoaded => {
                                                    if (!dataLoaded) {
                                                        this.presentToast(this.translate.instant('error_data'));
                                                        this.loadingController.dismiss();
                                                    } else {
                                                        this.loadingController.dismiss();
                                                    }
                                                })
                                                .catch(reason => {
                                                    console.log(reason);
                                                    this.presentToast(this.translate.instant('error_data'));
                                                    this.loadingController.dismiss();
                                                });
                                        })
                                        .catch(reason => {
                                            console.log(reason);
                                            this.presentToast(this.translate.instant('error_data'));
                                            this.loadingController.dismiss();
                                        });
                                })
                                .catch(reason => {
                                    console.log(reason);
                                    this.presentToast(this.translate.instant('unexpected'))
                                        .then(() => {
                                            this.fireAuth.logOut().then(() => {
                                                this.router.navigate(['/login'])
                                                    .then(() => this.loadingController.dismiss());
                                            }).catch(() => {
                                                this.router.navigate(['/login'])
                                                    .then(() => this.loadingController.dismiss());
                                            });
                                        });
                                });
                        } else {
                            this.router.navigate(['/login'])
                                .then(() => this.loadingController.dismiss());
                        }
                    });
            });
    }

    /**
     * Llama a los métodos para cargar los formularios pendientes y terminados
     * @returns Promise<boolean> true si carga los formularios correctamente o false si no los carga
     */
    refreshForms(): Promise<boolean> {
        return new Promise(resolve => {
            this.loadPendingForms()
                .then(pending => {
                    this.pendingForms = pending;
                    if (this.pendingForms.length === 0) {
                        console.log('Pending forms empty!');
                    }
                    this.loadFilledForms()
                        .then(filled => {
                            this.filledForms = filled;
                            if (this.filledForms.length === 0) {
                                console.log('Filled forms empty!');
                            }
                            this.initializeItems();
                            resolve(true);
                        })
                        .catch(reason => {
                            console.log(reason);
                            resolve(false);
                        });
                })
                .catch(reason => {
                    console.log(reason);
                    resolve(false);
                });
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

    /**
     * Devuelve el usuario actual
     * @returns el email del usuario
     */
    getCurrentUser() {
        return this.fireAuth.getCurrentUser();
    }

    /**
     * Comprueba si el usuario tiene configurado su QR ID
     * @returns true si está configurado o false si no
     */
    hasQrId() {
        return this.fireStorage.hasQrID(this.currentUser);
    }

    /**
     * Abre la ventana para configurar el QR ID
     */
    goToQrIdForm() {
        this.router.navigate(['/qr-id-form'])
            .then(value => console.log(value))
            .catch(reason => console.log(reason));
    }

    /**
     * Muestra el código QR del formulario
     * @param type 'qrID' o 'form'
     * @param index el índice del formulario, si se va a mostrar un QR ID pasar 0
     */
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
                this.presentLoading().then(() => {
                    this.presentQrIdModal(this.formID)
                        .then(() => {
                            this.loadingController.dismiss();
                        })
                        .catch(reason => {
                            console.log(reason);
                            this.loadingController.dismiss();
                        });
                });
            });
    }

    /**
     * Abre la ventana que muestra el código qr del QR ID o del formulario
     * @param data un array con los datos del QR ID o del formulario
     */
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

    /**
     * Carga los formularios pendientes
     * @returns un array con los formularios pendientes
     */
    loadPendingForms() {
        return this.fireStorage.loadPendingForms(this.currentUser)
            .then(pending => {
                return pending;
            })
            .catch(reason => console.error(reason));
    }

    /**
     * Carga los formularios terminados
     * @returns un array con los formularios terminados
     */
    loadFilledForms() {
        return this.fireStorage.loadFilledForms(this.currentUser)
            .then(filled => {
                return filled;
            })
            .catch(reason => console.error(reason));
    }

    /**
     * Le pasa a la ventana para rellenar el formulario su título y sus campos
     * @param formData un array con los datos del formulario
     */
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

    /**
     * Abre la ventana para rellenar un formulario
     * @param index el índice del formulario
     */
    openFillForm(index: number) {
        this.presentLoading()
            .then(() => {
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
                        this.loadingController.dismiss();
                    });
            });
    }

    /**
     * Abre el escáner QR
     */
    openQrScanner() {
        this.router.navigate(['/qr-scanner'])
            .then(() => console.log('Opening QR Scanner'));
    }

    /**
     * Abre una ventana de carga
     */
    async presentLoading() {
        const loading = await this.loadingController.create({
            message: this.translate.instant('loading'),
            spinner: 'crescent'
        });
        return await loading.present();
    }

    /**
     * Abre un toast
     * @param msg el mensaje que se quiere mostrar en el toast
     */
    async presentToast(msg) {
        const toast = await this.toast.create({
            message: msg,
            duration: 2000,
            animated: true
        });
        toast.present();
    }

    /**
     * Inicializa las listas que se van a filtrar para las búsquedas
     */
    initializeItems() {
        this.filteredFilled = this.filledForms;
        this.filteredPending = this.pendingForms;
    }

    /**
     * Filtra el listado de formularios terminados
     * @param $event cuando se pulsa una tecla
     */
    async getFilteredFilled($event) {
        this.initializeItems();
        // set val to the value of the searchbar
        const val = $event.target.value;

        // if the value is an empty string don't filter the items
        if (val && val.trim() !== '') {
            this.filteredFilled = this.filledForms.filter((item) => {
                return (item.title.toLowerCase().indexOf(val.toLowerCase()) > -1);
            });
        }
    }

    /**
     * Filtra el listado de formularios pendientes
     * @param $event cuando se pulsa una tecla
     */
    async getFilteredPending($event) {
        this.initializeItems();
        // set val to the value of the searchbar
        const val = $event.target.value;

        // if the value is an empty string don't filter the items
        if (val && val.trim() !== '') {
            this.filteredPending = this.pendingForms.filter((item) => {
                return (item.title.toLowerCase().indexOf(val.toLowerCase()) > -1);
            });
        }
    }
}
