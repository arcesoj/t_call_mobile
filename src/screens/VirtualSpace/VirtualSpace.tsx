import React, {useEffect, useState} from 'react';
import {SafeAreaView, View, Text, TouchableNativeFeedback} from 'react-native';
import {observer} from 'mobx-react-lite';

import {VIRTUAL_SPACE_TITLE} from '../../common/constants';
import Avatar from '../../components/Avatar';
import Movable from '../../components/Movable';
import VirtualSpaceState from './VirtualSpaceState';
import Participant from '../../data/Model/Participant';
import styles from './styles';

interface VirtualSpaceProps {
  name: string;
  onLeave: () => void;
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

const VirtualSpace = observer(
  ({onLeave, name: participantName}: VirtualSpaceProps) => {
    const [state] = useState(new VirtualSpaceState(participantName));

    useEffect(() => {
      state.connect();

      return function () {
        state.disconnect();
      };
    }, [state]);

    return (
      <SafeAreaView style={styles.container}>
        <NavigationOptions
          onLeave={onLeave}
          name={participantName}
          meetingState={state.call.meetingState()}
        />
        <View style={styles.virtualContainer}>
          {state.participantList.map((item: Participant) => {
            const {id, name, photoUrl, x, y} = item;
            const isLocal = id === state.userId;
            return (
              <Movable
                key={id}
                isLocal={isLocal}
                currentPosition={{x, y}}
                updatePosition={({x: xPosition, y: yPosition}) =>
                  state.updateParticipant({
                    ...item,
                    x: xPosition,
                    y: yPosition,
                  })
                }>
                <Avatar isLocal={isLocal} name={name} photoUrl={photoUrl} />
              </Movable>
            );
          })}
        </View>
      </SafeAreaView>
    );
  },
);

export default VirtualSpace;
