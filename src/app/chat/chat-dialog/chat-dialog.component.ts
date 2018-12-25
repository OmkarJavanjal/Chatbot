import { Component, OnInit,AfterViewChecked ,OnDestroy, ElementRef, ViewChild} from '@angular/core';
import { SpeechRecognitionService } from './speech-recognition.service';
import { ChatService, Message } from '../../chat.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/scan';


@Component({
  selector: 'app-chat-dialog',
  templateUrl: './chat-dialog.component.html',
  styleUrls: ['./chat-dialog.component.css']
})
//OnDestroy
export class ChatDialogComponent implements OnInit,AfterViewChecked , OnDestroy{

  messages: Observable<Message[]>;
  formValue: string;
  showSearchButton: boolean;
  buttonText: string;
  speechData: string;
  visible: boolean;
   @ViewChild('scrollMe') private myScrollContainer: ElementRef;
    constructor(private speechRecognitionService: SpeechRecognitionService, public chat: ChatService) {
        this.showSearchButton = true;
        this.formValue = "";
        this.visible = false;
        this.buttonText = 'Click to Start Speech Recognition';
    }

  //constructor(public chat: ChatService) { }

  ngOnInit() {
    // appends to array after each new message is added to feedSource
    this.messages = this.chat.conversation.asObservable()
        .scan((acc, val) => acc.concat(val) );

    console.log("hello");
     this.scrollToBottom();
  }

    ngAfterViewChecked() {        
        this.scrollToBottom();        
    } 

   ngOnDestroy() {
         this.speechRecognitionService.DestroySpeechObject();
     }


    scrollToBottom(): void {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch(err) { }                 
    }
  sendMessage() {
    if(this.formValue){
      this.chat.converse(this.formValue);
      this.formValue = '';
    }
  }

  toggleStartStop(){
    this.visible = !this.visible;
    console.log("toggle start stop");
    if(this.visible) {
      console.log(this.visible);
      this.buttonText = 'Click to Stop Speech Recognition';
      this.speechRecognitionService.speechRecognitionStart();
    }
    else{
      console.log(this.visible);
      this.buttonText = 'Click to Start Speech Recognition';
      this.speechRecognitionService.speechRecognitionStop();
    }
    //this.speechRecognitionService.toggleStartStop2();
  }

//setInterval(sendMessage() 500);


    // activateSpeechSearchMovie(): void {
        
    //     this.speechRecognitionService.record()
    //         .subscribe(
    //         //listener
    //         (value) => {
    //             this.formValue = value;
    //             console.log(value);
    //             setTimeout(this.sendMessage(),3000);
    //             //this.sendMessage();
    //         },
    //         //errror
    //         (err) => {
    //             console.log(err);
    //             if (err.error == "no-speech") {
    //                 console.log("--restatring service--");
    //                 this.activateSpeechSearchMovie();
    //             }
    //         },
    //         //completion
    //         () => {
    //             this.showSearchButton = true;
    //             console.log("--complete--");
    //             this.activateSpeechSearchMovie();
    //         });
    // }

}