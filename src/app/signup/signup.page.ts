import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../service/firebase.service';
import { Router } from '@angular/router';
import { CommonService } from '../service/common.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  signup:{fname:string, email:string, password:string, cpassword:string};
  constructor(
    private fb: FirebaseService,
    private router: Router,
    private common: CommonService
  ) { }

  ngOnInit() {
    this.init();
  }

  init(){
    this.signup = {
      fname: "",
      email: "",
      password: "",
      cpassword: ""
    }
  }

	async register() {
    let loading = await this.common.loading();
    loading.present();
		if(this.signup.password !== this.signup.cpassword) {
      this.common.presentAlert("Error", "Passwords don't match");
			return console.error("Passwords don't match")
		}
		try {
      const signup = await this.fb.signup(this.signup);
      if(signup.success){
        this.init();
        this.router.navigate(['/login']);
      }
      loading.dismiss();
      this.common.presentAlert(signup.success ? 'Success' : 'Error', signup.value);

		} catch(error) {
			console.error(error)
		}
  }

}
