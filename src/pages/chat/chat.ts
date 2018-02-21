import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';

import { AngularFireDatabase } from 'angularfire2/database';

import { ElasticTextarea } from './elastic-textarea';
import { Storage } from '@ionic/storage';

import { HomePage } from '../home/home'
import { Observable } from '@firebase/util';

/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
  queries: {
    ionChatContent: new ViewChild('ionChatContent'),
    ionFooter: new ViewChild('ionFooter')
  }
})
export class ChatPage {

  @ViewChild(Content) content: Content

  message: string = "";
  username: string = "";
  items;
  messages: object[] = [];
  ionChatContent;
  ionFooter;
  chatContent;
  chatFooter;
  friend: string = "";
  uid: string = "";
  friendUsername: string = "";

  constructor(
    public db: AngularFireDatabase,
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage
  )
  {
    storage.get('username').then((value)=>{
      if (value == null)
      {
        this.navCtrl.setRoot(HomePage);
      }
      else
      {
        this.username = value;
      }
    });

    this.uid = this.navParams.get('uid');
    this.friend = this.navParams.get('friend');
    this.friendUsername = this.navParams.get('usernameOfFriend');



    this.items = this.db.list('users/'+this.uid+'/friends/'+this.friend+'/chat').valueChanges().subscribe(data => {
      this.messages = data;
      // setTimeout(() => {
      //   this.content.scrollToBottom(0);
      // }, 500);
    });
  }

  sendMessage() {
    if(this.message != "")
    {
      this.db.list('users/'+this.uid+'/friends/'+this.friend+'/chat').push({
        username: this.username,
        message: this.message
      }).then(()=>{
        this.chatContent.style.marginBottom = this.chatFooter.clientHeight + "px";
        //this.content.scrollToBottom(0);
      });
      this.db.list('users/'+this.friend+'/friends/'+this.uid+'/chat').push({
        username: this.username,
        message: this.message
      }).then(()=>{
        this.chatContent.style.marginBottom = this.chatFooter.clientHeight + "px";
        //this.content.scrollToBottom(0);
      });
      this.db.object('users/'+this.uid+'/friends/'+this.friend+'/username').set(this.friendUsername);
      this.db.object('users/'+this.friend+'/friends/'+this.uid+'/username').set(this.username);
    }

    this.message="";
  }

  ionViewDidEnter() {
    this.content.scrollToBottom(0);
  }

  ionViewWillEnter() {
    this.content.scrollToBottom(0);
  }

  ionViewDidLoad() {
    this.content.scrollToBottom(0);
  }

  recieve(event) {
    this.message=event;
    this.chatContent.style.marginBottom = this.chatFooter.clientHeight + "px";
    this.content.scrollToBottom(0);
  }

  ngAfterViewInit(){
    this.chatContent = this.ionChatContent._elementRef.nativeElement.children[1];
    this.chatFooter = this.ionFooter._elementRef.nativeElement.children[0];
    this.content.scrollToBottom(0);
  }

  logout() {
    this.storage.clear();
    this.navCtrl.setRoot(HomePage);
  }
}
