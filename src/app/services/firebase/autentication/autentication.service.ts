import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {auth} from 'firebase/app';

@Injectable({
    providedIn: 'root'
})
export class AutenticationService {

    constructor(public afAuth: AngularFireAuth) {
    }

    signUp(userData: any) {
        return this.afAuth.auth.createUserWithEmailAndPassword(userData.email, userData.password);
    }

    logIn(userData: any) {
        return this.afAuth.auth.signInWithEmailAndPassword(userData.email, userData.password);
    }

    logOut() {
        return this.afAuth.auth.signOut();
    }
}
