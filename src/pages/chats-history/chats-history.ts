import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Friend } from '../../models/friend';

/**
 * Generated class for the ChatsHistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chats-history',
  templateUrl: 'chats-history.html',
})
export class ChatsHistoryPage{

  username: string;
  friends: Array<Friend> = [];
  items;
  userId: string;
  resultArray: any;
  friendsCopy: Array<Friend> = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public db: AngularFireDatabase,
    private storage: Storage,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController
  )
  {

    this.username = this.navParams.get('username');

    if(this.username==undefined)
    {
      storage.get('username').then((val) => {
        this.username = val;
      })
    }

    this.items = this.db.object('users').valueChanges().subscribe(users => {
      this.resultArray = Object.keys(users).map(function(index){
        return {"uid": index, "username": users[index].username};
      });
    });

    storage.get('uid').then((val) => {
      this.userId = val;
      this.db.object('users/'+this.userId).valueChanges().subscribe((data: any) => {
        let mappedFriends = Object.keys(data.friends).map(function(index){
          return {"uid": index, "chats": data.friends[index]};
        });
        data.friends = mappedFriends;
        this.friends = new Array<Friend>();
        for(let datafriend of data.friends)
        {
          let lastChat = Object.keys(datafriend.chats.chat).map(function(index){
            return datafriend.chats.chat[index];
          });
          datafriend.chats.chat = lastChat[lastChat.length-1];

          var tempFriend: Friend = {lastMessage: "", username: "", uid: "", seen: false};
          tempFriend.username = datafriend.chats.username;
          tempFriend.uid = datafriend.uid;
          tempFriend.lastMessage = datafriend.chats.chat.username == this.username
            ? "Já: " + datafriend.chats.chat.message
            : datafriend.chats.chat.message;
          tempFriend.seen = datafriend.chats.seen;

          this.friends.push(tempFriend);
        }
        this.friendsCopy = this.friends;
      });
    });
  }

  newMessage() {
    this.showPrompt();
  }

  chat(friend: Friend) {
    this.navCtrl.push('ChatPage', {
      uid: this.userId,
      friend: friend.uid,
      usernameOfFriend: friend.username,
      seen: friend.seen
    });
  }

  showPrompt() {
    var founded: boolean = false;
    let prompt = this.alertCtrl.create({
      title: 'New message',
      message: "Enter a name",
      inputs: [
        {
          name: 'username',
          placeholder: 'Username'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
          }
        },
        {
          text: 'Save',
          handler: data => {
              var friend;
              for(let user of this.resultArray)
              {
                if(user.username === data.username)
                {
                  founded = true;
                  friend = user.uid;
                }
              }
              console.log(friend);
              if(founded)
              {
                this.navCtrl.push('ChatPage', {
                  uid: this.userId,
                  friend: friend,
                  usernameOfFriend: data.username
                });
              }
              else
              {
                let toast = this.toastCtrl.create({
                  message: 'User not founded',
                  duration: 3000
                });
                toast.present();
              }
          }
        }
      ]
    });
    prompt.present();
  }
}
