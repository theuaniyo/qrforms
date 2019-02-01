import {Component} from '@angular/core';

import {Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {AutenticationService} from './services/firebase/autentication/autentication.service';
import {Router} from '@angular/router';
import {NativeStorage} from '@ionic-native/native-storage/ngx';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent {
    public appPages = [
        {
            title: 'Principal',
            url: '/home',
            icon: 'home'
        }
    ];

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private firebaseAuth: AutenticationService,
        private router: Router,
        private nativeStorage: NativeStorage
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }

    logOut() {
        this.firebaseAuth.logOut()
            .then(() => {
                this.nativeStorage.remove('idToken')
                    .then(() => {
                        this.router.navigate(['/login'])
                            .catch(reason => console.log(reason));
                    });
            })
            .catch(reason => console.log(reason));
    }
}
