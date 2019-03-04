import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';

@Injectable({
    providedIn: 'root'
})
export class AutenticationService {
    /**
     *
     * @param fireAuth
     */
    constructor(public fireAuth: AngularFireAuth) {
    }

    /**
     * Crea un nuevo usuario
     * @param userData los datos del usuario
     * @returns un promise con las credenciales del usuario
     */
    signUp(userData: any) {
        return this.fireAuth.auth.createUserWithEmailAndPassword(userData.email, userData.password);
    }

    /**
     * Inicia sesión
     * @param userData los datos de inicio de sesión del usuario
     * @returns un promise con las credenciales del usuario
     */
    logIn(userData: any) {
        return this.fireAuth.auth.signInWithEmailAndPassword(userData.email, userData.password);
    }

    /**
     * Cierra la sesión del usuario
     * @returns Promise<void>
     */
    logOut() {
        return this.fireAuth.auth.signOut();
    }

    /**
     * Comprueba si el usuario tiene una sesión iniciada
     * @returns Promise<boolean> true si hay una sesión iniciada, false si no
     */
    isLogged(): Promise<boolean> {
        return new Promise(resolve => {
            this.fireAuth.authState.subscribe(authState => {
                console.log(authState);
                if (authState) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }

    /**
     * Devuelve el email del usuario actual
     * @returns Promise<string> el email del usuario
     */
    getCurrentUser(): Promise<string> {
        return new Promise(resolve => {
            resolve(this.fireAuth.auth.currentUser.email);
        });
    }
}
