import Daily, {DailyCall, DailyEvent} from '@daily-co/react-native-daily-js';
import Config from 'react-native-config';
import io from 'socket.io-client';
import faker from 'faker';
import {action, makeObservable, observable} from 'mobx';

import {MAX_X, MAX_Y} from '../../common/constants';
import Participant from '../../data/Model/Participant';

class VirtualSpaceState {
  call: DailyCall;
  participantList: Participant[];
  socket: SocketIOClient.Socket;

  public userId?: string;
  public userName: string;

  constructor(userName: string) {
    this.call = Daily.createCallObject();
    this.socket = io(Config.NODE_SERVER);
    this.participantList = [];
    this.userName = userName;

    makeObservable(this, {
      call: observable,
      participantList: observable,
      connect: action,
      disconnect: action,
      updateParticipant: action,
    });
  }

  async connect() {
    this.socket?.on('virtual_space', (msg: any) => {
      this.participantList = msg;
    });

    // Start joining a call
    const response = await this.call.join({
      url: Config.DAILY_URL,
    });

    this.userId = response?.local?.user_id;
    const photoUrl = faker.image.avatar();

    const newParticipant = {
      id: this.userId,
      name: this.userName,
      x: Math.floor(Math.random() * MAX_X),
      y: Math.floor(Math.random() * MAX_Y),
      photoUrl,
    };

    this.socket?.emit('add', newParticipant);

    const events: DailyEvent[] = [
      'participant-joined',
      'participant-updated',
      'participant-left',
    ];

    for (const event of events) {
      // subscribe all events
      this.call.on(event, () => {
        console.log('Daily Event :: ', event);
      });
    }
  }

  disconnect() {
    this.call.leave();
    this.socket?.emit('delete', {id: this.userId});
  }

  updateParticipant(participant: Participant) {
    this.socket?.emit('update', participant);
  }
}

export default VirtualSpaceState;
