import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    data: any;

    constructor(private fireStore: AngularFirestore) {
    }

    createUserStorage() {

    }
}
