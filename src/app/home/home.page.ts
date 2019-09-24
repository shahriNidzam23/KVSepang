import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../service/common.service';
import { FirebaseService } from '../service/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  receipts:any;
  constructor(
    private router: Router,
    private common : CommonService,
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

  goToDetails() {
    this.common.setDetailId("0");
    this.router.navigate(['/details']);
  }

}
