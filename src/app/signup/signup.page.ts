import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AutenticationService} from '../services/firebase/autentication/autentication.service';
import {Router} from '@angular/router';
import {StorageService} from '../services/firebase/storage/storage.service';
import {LoadingController} from '@ionic/angular';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.page.html',
    styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

    signUpForm: FormGroup;
    userData: any;

    constructor(private formBuilder: FormBuilder,
                private authentication: AutenticationService,
                private router: Router,
                private fireStorage: StorageService,
                private loadingController: LoadingController) {
    }

    ngOnInit() {
        this.signUpForm = this.formBuilder.group({
            'email': ['', [Validators.required]],
            'password': ['', [Validators.required]],
            'repeatPassword': ['', [Validators.required]]
        });
    }

    onSubmit() {
        this.presentLoading().then(() => {
            console.log('Loading opens');
            this.userData = this.saveUserData();
            this.authentication.signUp(this.userData)
                .then(() => {
                    this.fireStorage.createUserStorage(this.userData.email)
                        .then(() => {
                            this.router.navigate(['/home'])
                                .catch(reason => console.log(reason));
                            this.loadingController.dismiss().then(() => console.log('Loading closes'));
                        })
                        .catch(reason => console.log(reason));
                })
                .catch(reason => console.log(reason));
        });
    }

    saveUserData() {
        return {
            email: this.signUpForm.get('email').value,
            password: this.signUpForm.get('password').value,
        };
    }

    async presentLoading() {
        const loading = await this.loadingController.create({
            message: 'Iniciando sesión',
            spinner: 'crescent'
        });
        return await loading.present();
    }
}
