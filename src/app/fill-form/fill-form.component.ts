import {Component, OnInit} from '@angular/core';
import {LoadingController, ModalController, NavParams, ToastController} from '@ionic/angular';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {StorageService} from '../services/firebase/storage/storage.service';
import {AutenticationService} from '../services/firebase/autentication/autentication.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-fill-form',
    templateUrl: './fill-form.component.html',
    styleUrls: ['./fill-form.component.scss']
})
export class FillFormComponent implements OnInit {

    title: string;
    fields: any[];
    filledForm: FormGroup;
    formData: any[];

    constructor(private modalController: ModalController,
                private navParams: NavParams,
                private router: Router,
                private formBuilder: FormBuilder,
                private fireStorage: StorageService,
                private fireAuth: AutenticationService,
                private loadingController: LoadingController,
                private toast: ToastController,
                private translate: TranslateService) {
    }

    ngOnInit() {
        this.title = this.navParams.get('title');
        this.fields = this.navParams.get('fields');
        const data = [];
        if (this.fields.length > 0) {
            this.fields.forEach((value: string) => {
                data[value] = ['', Validators.required];
            });
        }
        this.filledForm = this.formBuilder.group(data);
    }

    closeModal() {
        this.modalController.dismiss().then(value => console.log(value));
    }

    onSubmit() {
        this.formData = this.saveFormData();
        this.presentLoading().then(() => {
            this.fireStorage.fillForm(this.formData)
                .then(() => {
                    console.log('Filled forms updated.');
                    this.fireAuth.getCurrentUser()
                        .then(email => {
                            this.fireStorage.loadPendingForms(email)
                                .then(pending => {
                                    const pendingForms: any[] = pending;
                                    pendingForms.splice(this.navParams.get('index'), 1);
                                    this.fireStorage.updatePendingForms(pendingForms)
                                        .then(() => {
                                            console.log('Pending forms updated');
                                            this.loadingController.dismiss()
                                                .then(() => {
                                                    this.closeModal();
                                                });
                                        });
                                });
                        });
                })
                .catch(reason => {
                    console.log('Error updating filled forms.');
                    console.error(reason);
                });
        });
    }

    saveFormData() {
        const data = [];
        const fields = {};
        this.fields.forEach(value => {
            fields[value] = this.filledForm.get(value).value;
        });
        data.push({title: this.navParams.get('title'), fields});
        return data;
    }

    async presentLoading() {
        const loading = await this.loadingController.create({
            message: this.translate.instant('loading'),
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
