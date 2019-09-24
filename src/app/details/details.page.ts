import { Component, OnInit } from '@angular/core';
import { CommonService } from '../service/common.service';
import { FirebaseService } from '../service/firebase.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  result:any;
  details:{title:string, desc:string};
  tag:any;
  detaildId:any;
  constructor(
    private common : CommonService,
    private fb:FirebaseService,
    private navCtrl: NavController
    ) { }

  ngOnInit() {
    this.initValue();
    if(!(this.detaildId == '0' || this.detaildId == 0)){
      this.details = this.common.getReceipt();
    }
  }

  initValue(){
    this.detaildId = this.common.getDetailId();
    this.details = {
      title: "",
      desc: ""
    };
  }

  deletIf(){
    return this.detaildId == '0' ? false : true;
  }

  async save(){
    let loading = await this.common.loading();
    loading.present();
    switch(this.detaildId){
      case 0:
      case "0":
        this.create(loading);
        break;
      default:
        this.update(loading);
        break;
    }

    console.log(this.details);
  }

  async create(loading){
    try{
      const rec = await this.fb.create(this.details);
      console.log(rec);
      if(rec.success){
        loading.dismiss();
        this.common.presentAlert("Success", "TODO details successfully saved");
        this.navCtrl.back();
      } else {
        loading.dismiss();
        this.common.presentAlert("Error", rec.value);
      }
    } catch (err){
      loading.dismiss();
      this.common.presentAlert("Error", err.message);
    }
  }

  async update(loading){
    const update = await this.fb.update(this.details, this.detaildId);
    if(update.success){
      loading.dismiss();
      this.common.presentAlert("Success", "TODO details successfully updated");
      this.navCtrl.back();
    } else {
      loading.dismiss();
      this.common.presentAlert("Error", update.value);
    }
    loading.dismiss();
  }

  async delete(){
    this.common.deleteConfirm(async ()=>{
        let loading = await this.common.loading();
        loading.present();
        const update = await this.fb.delete(this.detaildId);
        if(update.success){
          loading.dismiss();
          this.common.presentAlert("Success", "TODO details successfully deleted");
          this.navCtrl.back();
        } else {
          loading.dismiss();
          this.common.presentAlert("Error", update.value);
        }
        loading.dismiss();
    }, this.details.title);
  }
}
