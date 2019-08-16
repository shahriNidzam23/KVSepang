import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  image:any;
  deatildId:any;
  receipt:any;
  constructor(
    private alertController: AlertController,
    private loadingController: LoadingController
  ) { }

  async presentAlert(title: string, content: string) {
		const alert = await this.alertController.create({
			header: title,
			message: content,
			buttons: ['OK']
		})

		await alert.present();
  }
  
  async loading(){
    const loading = await this.loadingController.create({
      message: 'Loading...'
    });

    return loading;
  }

  getImage(){
    if(!this.image){
      this.image = "assets/image/receipt.jpg";
    }

    return this.image;
  }

  setImage(base64){
    this.image = base64;
  }

  setDetailId(deatildId){
    this.deatildId = deatildId;
  }

  setReceipt(receipt){
    this.receipt = receipt;
  }

  getReceipt(){
    return this.receipt;
  }

  getDetailId(){
    return this.deatildId;
  }
}
