import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {StorageService} from '../services/firebase/storage/storage.service';
import {AutenticationService} from '../services/firebase/autentication/autentication.service';

@Component({
    selector: 'app-qr-id-form',
    templateUrl: './qr-id-form.page.html',
    styleUrls: ['./qr-id-form.page.scss'],
})
export class QrIdFormPage implements OnInit {

    qrIdForm: FormGroup;
    data: any;

    constructor(private router: Router,
                private formBuilder: FormBuilder,
                private fireStorage: StorageService,
                private fireAuth: AutenticationService) {
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

    returnToHome() {
        this.router.navigate(['/home'])
            .then(value => console.log(value))
            .catch(reason => console.log(reason));
    }

    onSubmit() {
        this.data = this.saveUserData();
        this.fireStorage.createQrId(this.fireAuth.getCurrentUser(), this.data)
            .then(value => console.log(value))
            .catch(reason => console.log(reason));
    }

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
}
