import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableNativeFeedback,
} from 'react-native';
import Daily, {DailyCall, DailyEvent} from '@daily-co/react-native-daily-js';
import Config from 'react-native-config';
import {io} from 'socket.io-client';
import faker from 'faker';

import {VIRTUAL_SPACE_TITLE} from '../common/constants';
import Avatar from '../components/Avatar';
import Movable from '../components/Movable';

interface VirtualSpaceProps {
  name: string;
  onLeave: () => void;
}

interface Participant {
  name: string;
  id: string;
  photoUrl: string;
  x: number;
  y: number;
}
interface VirtualSpaceState {
  participants: Map<string, Participant>;
  participantList: Participant[];
  call: DailyCall;
}

const NavigationOptions = ({
  onLeave,
  name,
  meetingState,
}: {
  onLeave: () => void;
  name: string;
  meetingState: string;
}) => (
  <View style={styles.navigationContainer}>
    <TouchableNativeFeedback onPress={onLeave}>
      <Text style={styles.closeButton}>{'X'}</Text>
    </TouchableNativeFeedback>
    <Text
      style={
        styles.title
      }>{`${VIRTUAL_SPACE_TITLE} ${name}\n${meetingState}`}</Text>
    <View />
  </View>
);

class VirtualSpace extends React.Component<
  VirtualSpaceProps,
  VirtualSpaceState
> {
  socket: any;
  userId?: string;

  constructor(props: VirtualSpaceProps) {
    super(props);

    const call = Daily.createCallObject();
    this.socket = io(Config.NODE_SERVER);
    this.state = {
      participants: new Map<string, Participant>(),
      participantList: [],
      call,
    };
  }

  componentDidMount() {
    this.join();
    this.socket?.on('virtual_space', (msg: any) => {
      this.setState({participantList: msg});
    });
  }

  async componentWillUnmount() {
    await this.state.call.leave();
    this.socket?.emit('delete', {id: this.userId});
  }

  async join() {
    const {call} = this.state;
    // Start joining a call
    const response = await call.join({
      url: Config.DAILY_URL,
    });

    this.userId = response?.local?.user_id;
    const photoUrl = faker.image.avatar();

    const newParticipant = {
      id: this.userId,
      name: this.props.name,
      x: 0,
      y: 0,
      photoUrl,
    };
    this.socket?.emit('add', newParticipant);
    const {participants} = this.state;
    if (this.userId && !participants.has(this.userId)) {
      participants.set(this.userId, newParticipant);
    }

    const events: DailyEvent[] = [
      'participant-joined',
      'participant-updated',
      'participant-left',
    ];

    for (const event of events) {
      // subscribe all events
      call.on(event, () => {
        const currentParticipants: string[] = [];

        // check all participants
        for (const {user_id} of Object.values(call.participants())) {
          currentParticipants.push(user_id);
        }

        // verify current participants
        const keys = Array.from(participants, ([key]) => key);
        keys.forEach((key) => {
          if (!currentParticipants.includes(key)) {
            participants.delete(key);
          }
        });
      });
    }
  }

  render() {
    const {call, participantList} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <NavigationOptions
          onLeave={this.props.onLeave}
          name={this.props.name}
          meetingState={call.meetingState()}
        />
        <View style={styles.virtualContainer}>
          {participantList.map((item) => {
            const {id, name, photoUrl} = item;
            const isLocal = id === this.userId;
            return isLocal ? (
              <Movable key={id}>
                <Avatar isLocal={isLocal} name={name} photoUrl={photoUrl} />
              </Movable>
            ) : (
              <Avatar
                key={id}
                isLocal={isLocal}
                name={name}
                photoUrl={photoUrl}
              />
            );
          })}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ccc',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
  },
  navigationContainer: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  closeButton: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  virtualContainer: {
    backgroundColor: 'white',
    flex: 1,
  },
});

export default VirtualSpace;
