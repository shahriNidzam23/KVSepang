import { Component } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Router } from '@angular/router';
import { CommonService } from '../service/common.service';
import { LoadingController, ActionSheetController } from '@ionic/angular';
import { FirebaseService } from '../service/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  receipts:any;
  constructor(
    private camera: Camera,
    private router: Router,
    private common : CommonService,
    public loadingController: LoadingController,
    private actionSheetController: ActionSheetController,
    private fb: FirebaseService
    ) {
      this.subscribeToReceipt();
    }

    async subscribeToReceipt(){
      let loading = await this.common.loading();
      loading.present();
      this.receipts = [];
      let receipt = await this.fb.readReceipt();

      receipt.subscribe(res => {
        console.log(res);
        this.receipts = [];  
        res.map(r => {        
          let temp = Object.assign({id:r.payload.doc.id}, r.payload.doc.data());
          console.log(temp);
          this.receipts.push(temp);
        });
        loading.dismiss();
        // this.receipts = res;
        console.log(this.receipts)
      });
    }

  toDetails(obj){
    this.common.setDetailId(obj.id);
    this.common.setReceipt(obj);
    this.router.navigate(['/details']);
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Camera Options',
      buttons: [{
        text: 'Camera',
        icon: 'camera',
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.CAMERA);
        }
      }, {
        text: 'Gallery',
        icon: 'images',
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      }]
    });
    await actionSheet.present();
  }

  async takePicture(sourceType) {
    let loading = await this.common.loading();
    loading.present();

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: sourceType,
      correctOrientation: true
    }

    this.camera.getPicture(options).then((imageData) => {
      this.common.setImage(imageData);
      this.common.setDetailId("0");
      this.router.navigate(['/details']);
      loading.dismiss();
    }, (err) => {
     // Handle error
     console.log("Camera issue:" + err);
    });
  }

}
