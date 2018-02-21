import {Component, ViewChild, EventEmitter, Output, Input, OnChanges, SimpleChanges, SimpleChange} from '@angular/core';

@Component({
  selector: 'elastic-textarea',
  inputs: ['lineHeight'],
  template:
  `
  <ion-textarea #ionTxtArea    
    [(ngModel)]="content"
    (ngModelChange)='onChange($event)'></ion-textarea>
  `,
  queries: {
    ionTxtArea: new ViewChild('ionTxtArea')
  }
})
export class ElasticTextarea implements OnChanges{

    lineHeight: string = "22px";
    content: string = "";
    txtArea;
    ionTxtArea;

    @Output() notify: EventEmitter<string> = new EventEmitter<string>();

    @Input() recievedMessage: string;

    constructor() {
      this.content = "";
      this.lineHeight = "22px";
    }

    ngAfterViewInit(){
      this.txtArea = this.ionTxtArea._elementRef.nativeElement.children[0];
      this.txtArea.style.height = this.lineHeight + "px";
    }

    onChange(newValue){
      this.txtArea.style.height = this.lineHeight + "px";
      this.txtArea.style.height =  this.txtArea.scrollHeight + "px";
      this.notify.emit(this.content);
    }

    ngOnChanges(changes: SimpleChanges) {
      const recievedMessage: SimpleChange = changes.recievedMessage;
      if(!recievedMessage.firstChange)
      {
        this.content = recievedMessage.currentValue;
        if(recievedMessage.currentValue == "")
          this.txtArea.style.height = this.lineHeight + "px";
      }
    }
}