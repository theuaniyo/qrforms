import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {environment} from '../../../../environments/environment';
import {AutenticationService} from '../autentication/autentication.service';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    usersCollection: AngularFirestoreCollection<any>;
    formsCollection: AngularFirestoreCollection<any>;

    constructor(private firestore: AngularFirestore,
                private fireAuth: AutenticationService) {
        this.usersCollection = firestore.collection<any>(environment.firebaseConfig.appUsers);
        this.formsCollection = firestore.collection<any>(environment.firebaseConfig.appForms);
    }

    createUserStorage(email) {
        const userData = {'email': email, 'pending': [], 'filled': []};
        return this.usersCollection.add(userData);
    }

    getUserData(currentUser) {
        console.log(currentUser);
        return this.usersCollection.ref.where('email', '==', currentUser).get();
    }

    hasQrID(currentUser): Promise<boolean> {
        return new Promise((resolve) => {
            this.getUserData(currentUser)
                .then((d) => {
                    if (d.docs.length > 0) {
                        const data = d.docs[0].data()['qrId'];
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
            this.getUserDocId(currentUser).then(value => {
                resolve(this.firestore.doc('Users/' + value).update({'qrId': data}));
            });
        });
    }

    getUserDocId(currentUser): Promise<any> {
        return new Promise((resolve) => {
            this.getUserData(currentUser).then(value => {
                resolve(value.docs[0].ref.id);
            });
        });
    }

    loadPendingForms(currentUser): Promise<any> {
        return new Promise((resolve) => {
            this.getUserData(currentUser).then(value => {
                resolve(value.docs[0].data()['pending']);
            });
        });
    }

    loadFilledForms(currentUser): Promise<any> {
        return new Promise((resolve) => {
            this.getUserData(currentUser).then(value => {
                resolve(value.docs[0].data()['filled']);
            });
        });
    }

    fillForm(data: any[]): Promise<any> {
        return new Promise(resolve => {
            this.fireAuth.getCurrentUser().then(email => {
                this.usersCollection.ref.where('email', '==', email).get()
                    .then(userData => {
                        this.loadFilledForms(email).then(filled => {
                            const filledForms: any[] = filled;
                            console.log(filledForms);
                            filledForms.push(...data);
                            console.log(filledForms);
                            resolve(this.firestore.doc('Users/' + userData.docs[0].id).ref.update({'filled': filledForms}));
                        });
                    });
            });
        });
    }

    updatePendingForms(data: any[]): Promise<any> {
        return new Promise(resolve => {
            this.fireAuth.getCurrentUser()
                .then(email => {
                    this.usersCollection.ref.where('email', '==', email).get()
                        .then(userData => {
                            resolve(this.firestore.doc('Users/' + userData.docs[0].id).ref.update({'pending': data}));
                        });
                });
        });
    }

    addForm(data): Promise<boolean> {
        return new Promise(resolve => {
            this.fireAuth.getCurrentUser()
                .then(email => {
                    this.loadPendingForms(email)
                        .then(pending => {
                            const pendingForms: any[] = pending;
                            pendingForms.push(JSON.parse(data));
                            this.getUserDocId(email)
                                .then(docId => {
                                    this.firestore.doc('Users/' + docId).ref.update({'pending': pendingForms})
                                        .then(() => {
                                            resolve(true);
                                        })
                                        .catch(reason => {
                                            console.error(reason);
                                            resolve(false);
                                        });
                                })
                                .catch(reason => {
                                    console.error(reason);
                                    resolve(false);
                                });
                        })
                        .catch(reason => {
                            console.error(reason);
                            resolve(false);
                        });
                })
                .catch(reason => {
                    console.error(reason);
                    resolve(false);
                });
        });
    }

    getPendingForm(docId): Promise<any> {
        return new Promise(resolve => {
            this.formsCollection.doc(docId).get()
                .subscribe(forms => {
                    resolve(forms.data());
                });
        });
    }
}

