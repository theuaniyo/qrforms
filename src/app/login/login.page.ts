import {Component, OnInit} from '@angular/core';
import {AutenticationService} from '../services/firebase/autentication/autentication.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {LoadingController, MenuController, ToastController} from '@ionic/angular';


@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    logInForm: FormGroup;
    userData: any;
    buttonPressed: boolean;

    constructor(private auth: AutenticationService,
                private formBuilder: FormBuilder,
                private router: Router,
                private loadingController: LoadingController,
                private toast: ToastController,
                private menuCtrl: MenuController) {
    }

    ionViewDidEnter() {
        this.menuCtrl.enable(false);
    }

    ngOnInit() {
        this.logInForm = this.formBuilder.group({
            'email': ['', [Validators.required]],
            'password': ['', [Validators.required]]
        });
        this.userWasLogged().then(authState => {
            if (authState) {
                console.log(authState);
                this.presentLoading().then(() => {
                    this.router.navigate(['/home'])
                        .then(() => {
                            this.loadingController.dismiss();
                        })
                        .catch(reason => {
                            console.log(reason);
                            this.loadingController.dismiss();
                        });
                });
            }
        });
    }

    onSubmit() {
        this.buttonPressed = true;
        this.userData = this.saveUserData();
        this.presentLoading().then(() => {
            this.auth.logIn(this.userData)
                .then(() => {
                    this.router.navigate(['/home'])
                        .then(() => this.loadingController.dismiss())
                        .catch(reason => console.log(reason));
                })
                .catch(reason => {
                    console.log(reason);
                    switch (reason.code) {
                        case 'auth/invalid-email':
                            this.presentToast('Formato de email no válido.');
                            break;
                        case 'auth/wrong-password':
                            this.presentToast('Email o contraseña incorrecto.');
                            break;
                        default:
                            console.log(reason.code);
                            this.presentToast('Error inesperado.');
                            break;
                    }
                    this.loadingController.dismiss();
                });
            this.buttonPressed = false;
        });
    }

    saveUserData() {
        return {
            email: this.logInForm.get('email').value,
            password: this.logInForm.get('password').value,
        };
    }

    userWasLogged() {
        return this.auth.isLogged();
    }

    async presentLoading() {
        const loading = await this.loadingController.create({
            message: 'Iniciando sesión',
            spinner: 'crescent'
        });
        return await loading.present();
    }

    async presentToast(msg) {
        const toast = await this.toast.create({
            message: msg,
            duration: 2000,
            animated: true
        });
        toast.present();
    }
}
