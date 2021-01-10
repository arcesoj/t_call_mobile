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

import {MAX_X, MAX_Y, VIRTUAL_SPACE_TITLE} from '../common/constants';
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
      participantList: [],
      call,
    };
  }

  componentDidMount() {
    this.join();
  }

  componentWillUnmount() {
    this.leave();
  }

  async join() {
    this.socket?.on('virtual_space', (msg: any) => {
      this.setState({participantList: msg});
    });

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
      call.on(event, () => {
        console.log('Daily Event :: ', event);
      });
    }
  }

  async leave() {
    await this.state.call.leave();
    this.socket?.emit('delete', {id: this.userId});
  }

  render() {
    const {onLeave, name: participantName} = this.props;
    const {call, participantList} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <NavigationOptions
          onLeave={onLeave}
          name={participantName}
          meetingState={call.meetingState()}
        />
        <View style={styles.virtualContainer}>
          {participantList.map((item) => {
            const {id, name, photoUrl, x, y} = item;
            const isLocal = id === this.userId;
            return (
              <Movable
                key={id}
                isLocal={isLocal}
                currentPosition={{x, y}}
                updatePosition={({x, y}: {x: number; y: number}) => {
                  const updateParticipant = {...item, x, y};
                  this.socket?.emit('update', updateParticipant);
                }}>
                <Avatar isLocal={isLocal} name={name} photoUrl={photoUrl} />
              </Movable>
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
