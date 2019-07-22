import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../service/firebase.service';
import { CommonService } from '../service/common.service';
import { StorageService } from '../service/storage.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  user:{fullname:string, email:string, uid:string};
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
    let scope = this;
    this.user = {
      fullname: "Nadia Asyiqin",
      email: "nadia.asyiqin@gmail.com",
      uid:""
    }

    this.storage.getUser().then(function(user){
      scope.user = user;
    });
  }

  async logout(){
    let scope = this;
    const loading = await this.common.loading();
    loading.present();
    this.fb.logout().then(function(){
      scope.storage.clear();
      loading.dismiss();
      scope.router.navigate(['/login']);
    });
  }

}
