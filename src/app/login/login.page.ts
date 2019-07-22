import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../service/firebase.service';
import { Router } from '@angular/router';
import { CommonService } from '../service/common.service';
import { StorageService } from '../service/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  user:{email:string, password:string};
  constructor(
    private fb: FirebaseService,
    private router: Router,
    private common: CommonService,
    private storage: StorageService
  ) { }

  ngOnInit() {
    this.init();
  }

  init(){
    this.user = {
      email: "",
      password: ""
    }
  }

  async login(){
    let loading = await this.common.loading();
    loading.present();
    try{
      const log = await this.fb.login(this.user);
      if(log.success){
        this.init();
        this.fb.getUser(log.value).subscribe(res => {
            this.storage.setUser({
              uid: log.value,
              email: res["email"],
              fullname: res["fname"]
            });
            loading.dismiss();
            this.router.navigate(['/home']);
          });
      } else {
        loading.dismiss();
        this.common.presentAlert("Error", log.value);
      }
    } catch (e) {
      loading.dismiss();
      this.common.presentAlert("Error", e.message);
    }
  }

}
