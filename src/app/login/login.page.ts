import {Component, OnInit} from '@angular/core';
import {AutenticationService} from '../services/firebase/autentication/autentication.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {LoadingController} from '@ionic/angular';


@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    logInForm: FormGroup;
    userData: any;

    constructor(private auth: AutenticationService,
                private formBuilder: FormBuilder,
                private router: Router,
                private loadingController: LoadingController) {
    }

    ngOnInit() {
        this.logInForm = this.formBuilder.group({
            'email': ['', [Validators.required]],
            'password': ['', [Validators.required]]
        });
        if (this.userWasLogged()) {
            this.presentLoading().then(() => {
                this.router.navigate(['/home'])
                    .then(() => {
                        this.loadingController.dismiss();
                    });
            });
        }
    }

    onSubmit() {
        this.userData = this.saveUserData();
        this.auth.logIn(this.userData)
            .then(() => {
                this.router.navigate(['/home'])
                    .catch(reason => console.log(reason));
            })
            .catch(reason => console.log(reason));
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
}
