import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(
    private storage: Storage
  ) { }

  setUser(user){
    this.storage.set('user', user);
  }

  getUser(){
    return this.storage.get('user');
  }

  clear(){
  	return this.storage.clear();
  }
}
