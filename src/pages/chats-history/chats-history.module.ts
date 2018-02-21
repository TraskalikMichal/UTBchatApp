import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatsHistoryPage } from './chats-history';

@NgModule({
  declarations: [
    ChatsHistoryPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatsHistoryPage),
  ],
})
export class ChatsHistoryPageModule {}
