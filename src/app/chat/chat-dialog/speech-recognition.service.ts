import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import * as _ from "lodash";
import { ChatDialogComponent } from './chat-dialog.component';
import { ChatService, Message } from '../../chat.service';

interface IWindow extends Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
}

@Injectable()
export class SpeechRecognitionService {
  speechRecognition: any;
  messages: Observable<Message[]>;
  formValue: string;
  showSearchButton: boolean;
  buttonText: string;
  speechData: string;
  visible: boolean;
  recognizing: boolean;


    constructor(private zone: NgZone, public chat: ChatService) {
       const { webkitSpeechRecognition } : IWindow = <IWindow>window;
    this.speechRecognition = new webkitSpeechRecognition();
    
    }
            
    speechRecognitionStop() {
        console.log("speechRecognitionStop method");
         this.speechRecognition.stop();
         console.log("speechRecognition Stop ");
    }

    speechRecognitionStart() {
        console.log("speechRecognitionStart method");
         this.speechRecognition.start();    
          console.log("speechRecognition Start");     
         this.activateSpeechSearchMovie();
    }

    //   toggleStartStop2() {
    //    if (this.recognizing) {
    //        console.log(this.recognizing);
    //      this.speechRecognition.stop();
    //      this.recognizing = false;
    //    } else {
    //        console.log(this.recognizing);
    //      this.speechRecognition.start();
    //      this.recognizing = true;
    //      this.activateSpeechSearchMovie();
    //    }
    //  }

    sendMessage() {
    if(this.formValue){
      this.chat.converse(this.formValue);
      this.formValue = '';
    }
  }

     activateSpeechSearchMovie(): void {
         console.log("activateSpeechSearchMovie method");
        this.record()
            .subscribe(
            //listener
            (value) => {
                console.log("listener method");
                this.formValue = value;
                console.log(value);
                setTimeout(this.sendMessage(),3000);
                //this.sendMessage();
            },
            //errror
            (err) => {
                console.log(err);
                if (err.error == "no-speech") {
                    console.log("--restatring service--");
                    this.activateSpeechSearchMovie();
                }
            },
            //completion
            () => {
                this.showSearchButton = true;
                console.log("--complete--");
                this.activateSpeechSearchMovie();
            });
    }




    record(): Observable<string> {
    console.log("record method");
        return Observable.create(observer => {
           // const { webkitSpeechRecognition }: IWindow = <IWindow>window;
            //this.speechRecognition = new webkitSpeechRecognition();
            this.speechRecognition.continuous = true;
            //this.speechRecognition.interimResults = true;
            //for hindi use hi
            this.speechRecognition.lang = 'en-us';
            this.speechRecognition.maxAlternatives = 1;
            
            this.speechRecognition.onresult = speech => {
                let term: string = "";
                if (speech.results) {
                    var result = speech.results[speech.resultIndex];
                    var transcript = result[0].transcript;
                    if (result.isFinal) {
                        if (result[0].confidence < 0.3) {
                            console.log("Unrecognized result - Please try again");
                        }
                        else {
                            term = _.trim(transcript);
                            console.log("Did you said? -> " + term + " , If not then say something else...");
                        }
                    }
                }
                this.zone.run(() => {
                    observer.next(term);
                });
            };

            this.speechRecognition.onerror = error => {
                observer.error(error);
                console.log("onerror method");
            };

            this.speechRecognition.onend = () => {
                observer.complete();
                console.log("onend method");
            };

            //this.speechRecognition.start();
           
            console.log("Say something - We are listening !!!");
        });
    }

    DestroySpeechObject() {
        if (this.speechRecognition)
            this.speechRecognition.stop();
            console.log("DestroySpeechObject method");
    }
}
