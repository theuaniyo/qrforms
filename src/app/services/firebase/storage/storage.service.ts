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

    hasQrID(currentUser): Promise<boolean> {
        return new Promise((resolve) => {
            this.getUserData(currentUser)
                .then((d) => {
                    // console.log(d.docs);
                    if (d.docs.length > 0) {
                        // console.log(d.docs[0]);
                        // console.log(d.docs[0].data());
                        const data = d.docs[0].data()['qrId'];
                        // console.log(data);
                        if (data != null) {
                            resolve(true);
                        } else {
                            resolve(false);
                        }
                    } else {
                        resolve(false);
                    }
                });
        });
    }

    createQrId(currentUser, data): Promise<any> {
        return new Promise((resolve) => {
            this.getUserData(currentUser).then(value => {
                const docID = value.docs[0].ref.id;
                resolve (this.firestore.doc('Users/' + docID).update({'qrId': data}));
            });
        });
    }
}

