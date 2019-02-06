import {Component} from '@angular/core';

import {MenuController, Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {AutenticationService} from './services/firebase/autentication/autentication.service';
import {Router} from '@angular/router';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {TranslateService} from '@ngx-translate/core';
import {environment} from '../environments/environment';

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

    langMenu: any;

    constructor(private platform: Platform,
                private splashScreen: SplashScreen,
                private statusBar: StatusBar,
                private firebaseAuth: AutenticationService,
                private router: Router,
                private nativeStorage: NativeStorage,
                private menuController: MenuController,
                private translate: TranslateService) {
        this.initializeApp();
        this.langMenu = (environment.defaultLanguage != 'es');
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();

            /*Gestionamos el idioma del sistema: en función del lenguaje por defecto o
      el idioma del navegador si está disponible.
      */
            this.translate.addLangs(environment.currentLanguages);  // add all languages
            this.translate.setDefaultLang(environment.defaultLanguage); // use default language
            if (this.translate.getBrowserLang) {  // if browsers's language is available is set up as default
                if (environment.currentLanguages.includes(this.translate.getBrowserLang())) {
                    this.translate.use(this.translate.getBrowserLang());
                }
            }
        });
    }

    logOut() {
        this.firebaseAuth.logOut()
            .then(() => {
                this.nativeStorage.remove('idToken')
                    .then(() => {
                        this.menuController.close().then(() => {
                            this.router.navigate(['/login'])
                                .catch(reason => console.log(reason));
                        });
                    });
            })
            .catch(reason => console.log(reason));
    }

    changeLang(e) {
        // console.log(e.detail.checked);
        if (e.detail.checked) {
            this.translate.use('en');
        } else {
            this.translate.use('es');
        }
    }
}
