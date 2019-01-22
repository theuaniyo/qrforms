import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';

@Injectable({
    providedIn: 'root'
})
export class AutenticationService {

    constructor(public fireAuth: AngularFireAuth) {
    }

    signUp(userData: any) {
        return this.fireAuth.auth.createUserWithEmailAndPassword(userData.email, userData.password);
    }

    logIn(userData: any) {
        return this.fireAuth.auth.signInWithEmailAndPassword(userData.email, userData.password);
    }

    logOut() {
        return this.fireAuth.auth.signOut();
    }

    isLogged() {
        return this.fireAuth.authState;
    }

    getCurrentUser() {
        return this.fireAuth.auth.currentUser.email;
    }

    getTokenId() {
        return this.fireAuth.idToken;
    }
}
