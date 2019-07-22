import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { StorageService } from './service/storage.service';
import { FirebaseService } from './service/firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: StorageService,
    private router: Router,
    private fb: FirebaseService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {

      let scope = this;
      const isLogFb = this.fb.getUID();
      if(isLogFb){
        this.storage.getUser().then(function(user){
          if(user){
            scope.router.navigate(['/home']);
          } else {
            this.storage.clear();
            scope.router.navigate(['/login']);
          }
        });
      } else {
        this.storage.clear();
        scope.router.navigate(['/login']);
      }
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
