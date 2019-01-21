import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {environment} from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    collection: AngularFirestoreCollection<any>;
    data: any;

    constructor(private firestore: AngularFirestore) {
        this.collection = firestore.collection<any>('prueba');
    }

    createUserStorage() {

    }
}
