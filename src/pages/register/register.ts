import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { User } from '../../models/user';
import { AngularFireAuth } from 'angularfire2/auth';
import { Storage } from '@ionic/storage';
import { AngularFireDatabase } from 'angularfire2/database';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  user = {} as User;

  constructor(
    private afAuth: AngularFireAuth,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private storage: Storage,
    public db: AngularFireDatabase
  )
  {
    storage.get('username').then((value)=>{
      if (value != null)
      {
        this.user.username = value;
        this.navCtrl.setRoot('ChatPage', {
          username: this.user.username
        });
      }
    });
  }

  async register(user: User) {
    try {
      const result = await this.afAuth.auth.createUserWithEmailAndPassword(user.username, user.password);
      console.log(result);
      if (result)
      {
        this.storage.set('username', this.user.username);
        this.storage.set('uid', result.uid);
        this.navCtrl.setRoot('ChatsHistoryPage', {
          username: this.user.username
        });

        this.db.object(`users/${result.uid}/username`).set(this.user.username)

        // this.db.object('users/'+result.uid+'/friends').set('');

      }
    }
    catch (e) {
      console.error(e);
      this.showAlert("Error!",e.message);
    }
  }

  public showAlert(title: string, message: string) {
    let alert = this.alertCtrl.create({
    title: title,
    subTitle: message,
    buttons: ['OK']
    });
    alert.present();
  }
}
