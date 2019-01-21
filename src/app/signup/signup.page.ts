import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AutenticationService} from '../services/firebase/autentication/autentication.service';
import {Router} from '@angular/router';
import {StorageService} from '../services/firebase/storage/storage.service';

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
                private fireStorage: StorageService
    ) {
    }

    ngOnInit() {
        this.signUpForm = this.formBuilder.group({
            'email': ['', [Validators.required]],
            'password': ['', [Validators.required]]
        });
    }

    onSubmit() {
        this.userData = this.saveUserdata();
        this.authentication.signUp(this.userData)
            .then(() => {
                this.fireStorage.createUserStorage(this.userData.email)
                    .then(() => {
                        this.router.navigate(['/home'])
                            .catch(reason => console.log(reason));
                    })
                    .catch(reason => console.log(reason));
            })
            .catch(reason => console.log(reason));
    }

    saveUserdata() {
        return {
            email: this.signUpForm.get('email').value,
            password: this.signUpForm.get('password').value,
        };
    }
}
