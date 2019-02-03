import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AutenticationService} from './services/firebase/autentication/autentication.service';
import {AngularFireAuth} from '@angular/fire/auth';
import {NgxQRCodeModule} from 'ngx-qrcode2';
import {QRScanner} from '@ionic-native/qr-scanner/ngx';
import {Dialogs} from '@ionic-native/dialogs/ngx';
import {Vibration} from '@ionic-native/vibration/ngx';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import { FillFormComponent } from './fill-form/fill-form.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
    declarations: [AppComponent, FillFormComponent],
    entryComponents: [FillFormComponent],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFirestoreModule,
        NgxQRCodeModule,
        FormsModule,
        ReactiveFormsModule
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
        AutenticationService,
        AngularFireAuth,
        QRScanner,
        Dialogs,
        Vibration,
        NativeStorage
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
