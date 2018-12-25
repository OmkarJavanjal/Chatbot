import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

import { ApiAiClient } from 'api-ai-javascript';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

// Message class for displaying messages in the component
export class Message {
  constructor(public content: string, public sentBy: string) {}
}

@Injectable()
export class ChatService {

  readonly token = environment.dialogflow.angularBot;
  readonly client = new ApiAiClient({ accessToken: this.token });

  conversation = new BehaviorSubject<Message[]>([]);

  constructor() {}

  // Sends and receives messages via DialogFlow
  converse(msg: string) {
    const userMessage = new Message(msg, 'user');
    this.update(userMessage);

    return this.client.textRequest(msg)
               .then(res => {
                  const speech = res.result.fulfillment.speech;
                  console.log(speech);

                  var chatReadMsg = new SpeechSynthesisUtterance(speech);
                  chatReadMsg.rate = 1.0;
                  var synth = window.speechSynthesis;
                  var voices = synth.getVoices();
                  chatReadMsg.voice = voices[0];

                  window.speechSynthesis.speak(chatReadMsg);

                  const botMessage = new Message(speech, 'bot');
                  this.update(botMessage); 
               });
  }

  // Adds message to source
  update(msg: Message) {
    
    this.conversation.next([msg]);
    var botMessage = msg.toString(); 
  
  }

}