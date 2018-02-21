import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatPage } from './chat';
import { ElasticTextarea } from './elastic-textarea';

@NgModule({
  declarations: [
    ChatPage,
    ElasticTextarea
  ],
  imports: [
    IonicPageModule.forChild(ChatPage),
  ],
})
export class ChatPageModule {}
