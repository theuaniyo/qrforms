import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AutenticationService} from '../services/firebase/autentication/autentication.service';
import {Router} from '@angular/router';
import {StorageService} from '../services/firebase/storage/storage.service';
import {LoadingController, MenuController, ToastController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.page.html',
    styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

    signUpForm: FormGroup;
    userData: any;
    buttonPressed: boolean;

    constructor(private formBuilder: FormBuilder,
                private authentication: AutenticationService,
                private router: Router,
                private fireStorage: StorageService,
                private loadingController: LoadingController,
                private menuCtrl: MenuController,
                private toast: ToastController,
                private translate: TranslateService) {
    }

    ionViewDidEnter() {
        this.menuCtrl.enable(false);
    }

    ngOnInit() {
        this.signUpForm = this.formBuilder.group({
            'email': ['', [Validators.required]],
            'password': ['', [Validators.required]],
            'repeatPassword': ['', [Validators.required]]
        });
    }

    onSubmit() {
        this.buttonPressed = true;
        this.passwordCheck().then(passwordCheck => {
            if (passwordCheck) {
                this.presentLoading().then(() => {
                    console.log('Loading opens');
                    this.userData = this.saveUserData();
                    this.authentication.signUp(this.userData)
                        .then(() => {
                            this.fireStorage.createUserStorage(this.userData.email)
                                .then(() => {
                                    this.router.navigate(['/home'])
                                        .catch(reason => {
                                            console.log(reason);
                                            this.loadingController.dismiss();
                                        });
                                    this.loadingController.dismiss().then(() => console.log('Loading closes'));
                                })
                                .catch(reason => console.log(reason));
                        })
                        .catch(reason => {
                            console.log(reason.code);
                            switch (reason.code) {
                                case 'auth/invalid-email':
                                    this.loadingController.dismiss()
                                        .then(() => {
                                            this.presentToast(this.translate.instant('invalid_email'));
                                        });
                                    break;
                                case 'auth/weak-password':
                                    this.loadingController.dismiss()
                                        .then(() => {
                                            this.presentToast(this.translate.instant('password_err'));
                                        });
                                    break;
                                case 'auth/email-already-in-use':
                                    this.loadingController.dismiss()
                                        .then(() => {
                                            this.presentToast(this.translate.instant('in_use'));
                                        });
                                    break;
                                default:
                                    this.loadingController.dismiss()
                                        .then(() => {
                                            this.presentToast(this.translate.instant('unexpected'));
                                        });
                                    break;
                            }
                        });
                });
            } else {
                this.presentToast(this.translate.instant('psw_match'));
            }
        });
        this.buttonPressed = false;
    }

    saveUserData() {
        return {
            email: this.signUpForm.get('email').value,
            password: this.signUpForm.get('password').value,
        };
    }

    passwordCheck(): Promise<boolean> {
        return new Promise(resolve => {
            if (this.signUpForm.get('password').value === this.signUpForm.get('repeatPassword').value) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    }

    async presentLoading() {
        const loading = await this.loadingController.create({
            message: this.translate.instant('logging'),
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

    changeLang(e) {
        // console.log(e.detail.checked);
        if (e.detail.checked) {
            this.translate.use('en');
        } else {
            this.translate.use('es');
        }
    }
}
