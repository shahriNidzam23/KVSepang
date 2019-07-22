import { Component, OnInit } from '@angular/core';
import { CommonService } from '../service/common.service';
import { StorageService } from '../service/storage.service';
import { FirebaseService } from '../service/firebase.service';
import { OCR, OCRSourceType, OCRResult } from '@ionic-native/ocr/ngx';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  result:any;
  details:{store:string, date:string, place:string, category:string, tags:Array<[]>, total: string, uid:string, img:string};
  tag:any;
  detaildId:any;
  constructor(
    private common : CommonService,
    private ocr: OCR,
    private fb:FirebaseService,
    private storage:StorageService,
    private afstorage:AngularFireStorage
    ) { }

  ngOnInit() {
    this.initValue();
    if(this.detaildId == '0' || this.detaildId == 0){
      this.readImage();
    } else {

    }
  }

  initValue(){
    this.detaildId = this.common.getDetailId();
    let scope = this;
    this.details = {
      store: "",
      date: "",
      place: "",
      category: "",
      tags: [],
      total: "",
      uid: "",
      img: new Date().getTime().toString()
    };
    this.storage.getUser().then(function(user){
      scope.details.uid = user.uid; 
    });
  }

  deletIf(){
    return this.detaildId == '0' ? false : true;
  }

  rmTags(i){
    this.details.tags.splice(i, 1)
  }

  addTags(){
    if(this.tag.length > 0){
      this.details.tags.push(this.tag);
    }
  }

  async save(){
    let loading = await this.common.loading();
    loading.present();
    switch(this.detaildId){
      case 0:
      case "0":
        try{
          const rec = this.fb.createReceipt(this.details);
          if(rec.success){
            await rec.value.putString(this.common.getImage(), 'base64', {contentType: 'image/png'});
            this.details.img = await rec.value.getDownloadURL();
            const receipt = await this.fb.uploadToDB(this.details);
            if(receipt.success){
              loading.dismiss();
              this.common.presentAlert("Success", "Receipt details successfully");
            } else {
              loading.dismiss();
              this.common.presentAlert("Error", receipt.value);
            }
          } else {
            loading.dismiss();
            this.common.presentAlert("Error", rec.value);
          }
        } catch (err){
          loading.dismiss();
          this.common.presentAlert("Error", err.message);
        }
        break;
      default:
          const update = await this.fb.updateReceipt(this.details, this.detaildId);
          loading.dismiss();
        break;
    }
    console.log(this.details);
  }

  delete(){
    console.log(this.details);
  }

  getURL(){
    return 'data:image/jpeg;base64,' + this.common.getImage();
    //return this.wv.convertFileSrc(this.common.getImage());
  }

  readImage(){
    this.ocr.recText(OCRSourceType.BASE64, this.common.getImage())
    .then((res: OCRResult) => {
      this.result = res;
      this.details.store = this.store(this.result.blocks.blocktext);
      this.details.total = this.total(this.result.blocks.blocktext);
      this.details.date = this.date(this.result.blocks.blocktext);
      this.details.place = this.place(this.result.blocks.blocktext);
    }).catch((err:any) => {
      console.log(err);
    });
  }
  
  split(fulltext, rmtext){
    let temp = [];
    temp = fulltext.split(rmtext);
    for(let i = 0; i < temp.length; i++){
      if(temp[i].length > 0){
        return temp[i];
      }
    }
  }

  store(arr){
    for(let i = 0; i < arr.length; i++){
      if(arr[i].includes("Company:")){
        arr[i] = this.split(arr[i], "Company:");
        if(arr[i].includes("Address:")){
          return this.split(arr[i], "Address:");
        } else {
          return arr[i];
        }
      } 
    }
  }

  place(arr){
    let all = [];
    for(let i = 0; i < arr.length; i++){
      let a = arr[i].split(" ");
      all = all.concat(a);
    }
    let start = 0, end = 0; 
    for(let i = 0; i <  all.length; i++){
      if(all[i].includes("Address:")){
        start = i + 1;
      }

      if(all[i].includes("Date:")){
        end = i;
      }
    }
     let place = "";
    for(let i = start; i <=  end; i++){
      place += " " + all[i];
    }

    if(place.includes("Date:")){
      let a = place.split("Date:");
      place = a[0];
    }

    return place;
  }

  date(arr){
    let all = [];
    for(let i = 0; i < arr.length; i++){
      let a = arr[i].split(" ");
      all = all.concat(a);
    }

    for(let i = 0; i <  all.length; i++){
      if(all[i].includes("Date:")){
        return all[i + 1];
      }
    }

  }

  total(arr){
    let temp = [];
    for(let i = 0; i < arr.length; i++){
      if(!isNaN(arr[i])){
        temp.push(arr[i]);
      }
    }
    
    let h = 0;
    for(let i = 0; i < temp.length; i++){
      h = h < parseInt(temp[i]) ? parseInt(temp[i]) : h;
    }

    return h.toString();
  }

}
