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

    /**
     *
     * @param firestore
     * @param fireAuth
     */
    constructor(private firestore: AngularFirestore,
                private fireAuth: AutenticationService) {
        this.usersCollection = firestore.collection<any>(environment.firebaseConfig.appUsers);
        this.formsCollection = firestore.collection<any>(environment.firebaseConfig.appForms);
    }

    /**
     * Crea un documento dentro de la base de datos para un usuario
     * @param email el email del usuario
     * @returns Promise<DocumentReference> la referencia al documento recién creado
     */
    createUserStorage(email) {
        const userData = {'email': email, 'pending': [], 'filled': []};
        return this.usersCollection.add(userData);
    }

    /**
     * Devuelve los datos almacenados del usuario
     * @param currentUser el email del usuario
     * @returns Promise<QuerySnapshot> los datos del usuario
     */
    getUserData(currentUser) {
        return this.usersCollection.ref.where('email', '==', currentUser).get();
    }

    /**
     * Comprueba si el usuario tiene configurado su QR ID
     * @param currentUser el email del usuario actual
     * @returns Promise<boolean> true si lo tiene configurado, false si no
     */
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

    /**
     * Crea la clave QR ID dentro del documento del usuario y le asigna los valores que haya introducido
     * @param currentUser el usuario actual
     * @param data los datos del usuario
     * @returns Promise<void>
     */
    createQrId(currentUser, data): Promise<any> {
        return new Promise((resolve) => {
            this.getUserDocId(currentUser).then(value => {
                resolve(this.firestore.doc('Users/' + value).update({'qrId': data}));
            });
        });
    }

    /**
     * Devuelve el ID del documento del usuario
     * @param currentUser el usuario actual
     * @returns Promise<any> el email del usuario actual
     */
    getUserDocId(currentUser): Promise<any> {
        return new Promise((resolve) => {
            this.getUserData(currentUser).then(value => {
                resolve(value.docs[0].ref.id);
            });
        });
    }

    /**
     * Carga los formularios pendientes desde la base de datos del usuario actual
     * @param currentUser el usuario actual
     * @returns un array con los formularios pendientes del usuario
     */
    loadPendingForms(currentUser): Promise<any> {
        return new Promise((resolve) => {
            this.getUserData(currentUser).then(value => {
                resolve(value.docs[0].data()['pending']);
            });
        });
    }

    /**
     * Carga los formularios terminados desde la base de datos del usuario actual
     * @param currentUser el usuario actual
     * @returns Promise<any> un array con los formularios terminados del usuario
     */
    loadFilledForms(currentUser): Promise<any> {
        return new Promise((resolve) => {
            this.getUserData(currentUser).then(value => {
                resolve(value.docs[0].data()['filled']);
            });
        });
    }

    /**
     * Pasa un formulario pendiente a terminado dentro de la base de datos y le inserta los datos introducidos por el usuario.
     * @param data un array con los campos del formulario rellenos por el usuario
     * @returns Promise<any>
     */
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

    /**
     * Actualiza los formularios pendientes del usuario, se usa cuando se quiere pasar un formulario de pendiente a terminado
     * @param data un array con la nueva lista de formularios
     * @returns Promise<any>
     */
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

    /**
     * Añade un formulario nuevo a la lista de pendientes del usuario
     * @param data un array con el título y los campos del formulario
     */
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

    /**
     * Devuelve la lista de formularios de un documento concreto
     * @param docId el id del documento al que pertenece el formulario
     * @returns Promise<any> la lista con los formularios
     */
    getPendingForm(docId): Promise<any> {
        return new Promise(resolve => {
            this.formsCollection.doc(docId).get()
                .subscribe(forms => {
                    resolve(forms.data());
                });
        });
    }
}

