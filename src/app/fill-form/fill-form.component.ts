import {Component, OnInit} from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {StorageService} from '../services/firebase/storage/storage.service';

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
                private fireStorage: StorageService) {
    }

    ngOnInit() {
        this.title = this.navParams.get('title');
        this.fields = this.navParams.get('fields');
        const data = [];
        if (this.fields.length > 0) {
            this.fields.forEach((value: string) => {
                data[value] = '';
            });
        }
        this.filledForm = this.formBuilder.group(data);
    }

    closeModal() {
        this.modalController.dismiss().then(value => console.log(value));
    }

    onSubmit() {
        this.formData = this.saveFormData();
        this.fireStorage.fillForm(this.formData)
            .then(() => {
                console.log('Filled forms updated.');
                this.closeModal();
            })
            .catch(reason => {
                console.log('Error updating filled forms.');
                console.error(reason);
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
}
