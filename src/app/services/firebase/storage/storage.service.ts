import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, QuerySnapshot} from '@angular/fire/firestore';
import {environment} from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    usersCollection: AngularFirestoreCollection<any>;
    formsCollection: AngularFirestoreCollection<any>;
    data: any;

    constructor(private firestore: AngularFirestore) {
        this.usersCollection = firestore.collection<any>(environment.firebaseConfig.appUsers);
        this.formsCollection = firestore.collection<any>(environment.firebaseConfig.appForms);
    }

    createUserStorage(email) {
        const userData = {'email': email};
        return this.usersCollection.add(userData);
    }

    getUserData(currentUser) {
        return this.usersCollection.ref.where('email', '==', currentUser).get();
    }

    hasQrID(currentUser) {
        this.usersCollection.ref.where('email', '==', currentUser).firestore.doc('qrId').get()
            .then(docSnapshot => {
                console.log(docSnapshot);
                if (docSnapshot.exists) {
                    return true;
                } else {
                    return false;
                }
            });
    }
}

