import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {StorageService} from '../services/firebase/storage/storage.service';
import {AutenticationService} from '../services/firebase/autentication/autentication.service';
import {LoadingController, MenuController, ToastController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-qr-id-form',
    templateUrl: './qr-id-form.page.html',
    styleUrls: ['./qr-id-form.page.scss'],
})
export class QrIdFormPage implements OnInit {

    qrIdForm: FormGroup;
    data: any;
    buttonPressed: boolean;

    /**
     * @param router
     * @param formBuilder
     * @param fireStorage
     * @param fireAuth
     * @param menuCtrl
     * @param loadingController
     * @param toast
     * @param translate
     */
    constructor(private router: Router,
                private formBuilder: FormBuilder,
                private fireStorage: StorageService,
                private fireAuth: AutenticationService,
                private menuCtrl: MenuController,
                private loadingController: LoadingController,
                private toast: ToastController,
                private translate: TranslateService) {
    }

    ionViewDidEnter() {
        this.menuCtrl.enable(false);
    }

    ngOnInit() {
        this.qrIdForm = this.formBuilder.group({
            'name': ['', Validators.required],
            'surname': ['', Validators.required],
            'dni': ['', Validators.required],
            'nationality': ['', Validators.required],
            'address': ['', Validators.required],
            'poblacion': ['', Validators.required],
            'provincia': ['', Validators.required],
            'comunidad': ['', Validators.required],
            'zipcode': ['', Validators.required]
        });
    }

    /**
     * Vuelve a la pantalla Home
     */
    returnToHome() {
        this.router.navigate(['/home'])
            .then(value => console.log(value))
            .catch(reason => console.log(reason));
    }

    /**
     * Recoge los datos del formulario y se los pasa al método que los guarda en la base de datos
     */
    onSubmit() {
        this.buttonPressed = true;
        this.presentLoading()
            .then(() => {
                this.data = this.saveUserData();
                this.fireAuth.getCurrentUser()
                    .then(email => {
                        this.fireStorage.createQrId(email, this.data)
                            .then(() => {
                                this.router.navigate(['/home'])
                                    .then(() => {
                                        this.loadingController.dismiss();
                                    })
                                    .catch(() => this.loadingController.dismiss());
                            })
                            .catch(reason => {
                                console.log(reason);
                                this.loadingController.dismiss();
                                this.presentToast(this.translate.instant('db_error'));
                            });
                    })
                    .catch(reason => {
                        console.log(reason);
                        this.loadingController.dismiss();
                        this.presentToast(this.translate.instant('db_error'));
                    });
            })
            .catch(reason => console.log(reason));
        this.buttonPressed = false;
    }

    /**
     * Devuelve los datos introducidos por el usuario en el formulario
     * @returns los datos del usuario en formato JSON
     */
    saveUserData() {
        return {
            nombre: this.qrIdForm.get('name').value,
            apellidos: this.qrIdForm.get('surname').value,
            dni: this.qrIdForm.get('dni').value,
            nacionalidad: this.qrIdForm.get('nationality').value,
            direccion: this.qrIdForm.get('address').value,
            poblacion: this.qrIdForm.get('poblacion').value,
            provincia: this.qrIdForm.get('provincia').value,
            comunidad: this.qrIdForm.get('comunidad').value,
            codigoPostal: this.qrIdForm.get('zipcode').value,
        };
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
}
