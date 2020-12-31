import React from 'react';
import {SafeAreaView, View, Text, StyleSheet, Button} from 'react-native';
import Daily, {
  DailyCall,
  DailyEvent,
  DailyParticipant,
} from '@daily-co/react-native-daily-js';

import {VIRTUAL_SPACE_TITLE} from '../common/constants';
import Avatar from '../components/Avatar';

interface VirtualSpaceProps {
  name: string;
  onLeave: () => void;
}
interface VirtualSpaceState {
  participants: Map<string, DailyParticipant>;
  participantList: DailyParticipant[];
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
    <Button onPress={onLeave} title={'X'} color="#000000" />
    <Text
      style={
        styles.title
      }>{`${VIRTUAL_SPACE_TITLE} ${name}\n${meetingState}`}</Text>
    <Button onPress={() => {}} title={''} color="#000000" />
  </View>
);

class VirtualSpace extends React.Component<
  VirtualSpaceProps,
  VirtualSpaceState
> {
  constructor(props: VirtualSpaceProps) {
    super(props);

    const call = Daily.createCallObject();
    this.state = {
      participants: new Map<string, DailyParticipant>(),
      participantList: [],
      call,
    };
  }

  componentDidMount() {
    this.join();
  }

  componentWillUnmount() {
    this.state.call.leave();
  }

  async join() {
    // Start joining a call
    await this.state.call.join({
      url: 'https://tchallenge.daily.co/allhands', // move to env file
    });

    const events: DailyEvent[] = [
      'participant-joined',
      'participant-updated',
      'participant-left',
    ];

    for (const event of events) {
      // subscribe all events
      this.state.call.on(event, () => {
        const currentParticipants: string[] = [];
        const {participants} = this.state;

        // check all participants
        for (const participant of Object.values(
          this.state.call.participants(),
        )) {
          currentParticipants.push(participant.user_id);

          // add new participant
          if (!participants.has(participant.user_id)) {
            participants.set(participant.user_id, participant);
          }
        }

        // verify current participants
        const keys = Array.from(participants, ([key]) => key);
        keys.forEach((key) => {
          if (!currentParticipants.includes(key)) {
            participants.delete(key);
          }
        });

        this.setState({
          participants: participants,
          participantList: Array.from(participants, ([, value]) => value),
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
        <View>
          {participantList.map((item) => (
            <Avatar
              key={item.user_id}
              name={item.user_id}
              isLocal={item.local}
            />
          ))}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
});

export default VirtualSpace;
