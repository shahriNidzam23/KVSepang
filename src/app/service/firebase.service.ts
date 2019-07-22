import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { CommonService } from './common.service';
import { first } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    private afauth: AngularFireAuth,
    private afstore: AngularFirestore,
    private common: CommonService,
    private afstorage: AngularFireStorage
  ) { }

  async getUID(){
    const user = await this.afauth.authState.pipe(first()).toPromise();
    if(user === null){
      return false;
    } 

    return true;
  }

  async signup(user){
    try{
      const res = await this.afauth.auth.createUserWithEmailAndPassword(user.email, user.password);
      delete user.cpassword;
      delete user.password;
      await this.afstore.doc(`users/${res.user.uid}`).set(user);
      return {
        success: true,
        value: user.email
      };
    } catch(e){
      return {
        success: false,
        value: e.message
      };
    }
  }

  async login(user){
    try{
      const res = await this.afauth.auth.signInWithEmailAndPassword(user.email, user.password)
      return {
        success: true,
        value: res.user.uid
      }
    } catch(e){
      return {
        success: false,
        value: e.message
      }
    }
  }

  getUser(uid){
    return this.afstore.doc("users/" + uid).valueChanges();
  }
  

	logout(){
		return this.afauth.auth.signOut();
  }
  
  async uploadToDB(details){
    try{
      const receipt = await this.afstore.collection('receipts').add(details); 
      return {
        value: receipt.id,
        success: true
      } 
    } catch (err){
      return {
        value: err.message,
        success: false
      }
    }
  }

  createReceipt(details){
    try{
      let rec = this.afstorage.storage.ref('receipts/' + details.uid + "/" + details.img + ".png");
      return {
        value: rec,
        success: true
      }
    } catch (err){
      return {
        value: err.message,
        success: false
      }
    }
  }

  readReceipt(uid){
    return this.afstore.collection("receipts", ref =>ref.where("uid", "==", uid)).valueChanges();
  }

  updateReceipt(details, id){
    return this.afstore.doc('receipts/' + id).set(details);
  }

  deleteReceipt(){

  }


}
