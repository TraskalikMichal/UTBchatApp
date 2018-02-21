import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { Storage } from '@ionic/storage';

import { ChatPage } from '../chat/chat'
import { RegisterPage } from '../register/register'
import { User } from '../../models/user';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  user = {} as User;

  constructor(
    private afAuth: AngularFireAuth,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    private storage: Storage
  )
  {
    storage.get('username').then((value)=>{
      if (value != null)
      {
        this.user.username = value;
        this.navCtrl.setRoot('ChatsHistoryPage', {
          username: this.user.username
        });
      }
    });
  }

  async loginUser(user: User) {
    try {
      const result = this.afAuth.auth.signInWithEmailAndPassword(user.username, user.password)
      .then((data) => {
        this.storage.set('uid', data.uid);
        this.storage.set('username',this.user.username);
        this.navCtrl.setRoot('ChatsHistoryPage', {
          username: this.user.username
        });
      }).catch(()=>{
        this.showAlert('Error!','Wrong username or password!');
      });
    }
    catch(e) {
      console.error(e);
    };
  }

  public showAlert(title: string, message: string) {
    let alert = this.alertCtrl.create({
    title: title,
    subTitle: message,
    buttons: ['OK']
    });
    alert.present();
  }


  registerUser() {
    this.navCtrl.push(RegisterPage);
  }

}
