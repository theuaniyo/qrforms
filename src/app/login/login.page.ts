import {Component, OnInit} from '@angular/core';
import {AutenticationService} from '../services/firebase/autentication/autentication.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {NativeStorage} from '@ionic-native/native-storage/ngx';


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
                private nativeStorage: NativeStorage) {
    }

    ngOnInit() {
        this.userWasLogged();
        this.logInForm = this.formBuilder.group({
            'email': ['', [Validators.required]],
            'password': ['', [Validators.required]]
        });
    }

    onSubmit() {
        this.userData = this.saveUserData();
        this.auth.logIn(this.userData)
            .then(() => {
                this.router.navigate(['/home'])
                    .catch(reason => console.log(reason));
                this.auth.getTokenId().then(idToken => {
                    // console.log(idToken);
                    this.nativeStorage.setItem('idToken', idToken)
                        .then(value => console.log(value),
                            error => console.error(error));
                });
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
        this.nativeStorage.getItem('idToken')
            .then(value => {
                if (value) {
                    this.auth.getTokenId().then(idToken => {
                        console.log('Stored:' + value);
                        console.log('Received: ' + idToken);
                        if (idToken == value.idToken) {
                            this.router.navigate(['/home'])
                                .then(value1 => console.log(value1));
                        }
                    });
                }
            })
            .catch(reason => console.error(reason));
    }
}
