import React, {Component} from 'react';
import {Animated, PanResponder, StyleSheet} from 'react-native';

import {MAX_X, MAX_Y, MIN_X, MIN_Y} from '../common/constants';

interface MovableProps {
  updatePosition: ({x, y}: {x: number; y: number}) => void;
  isLocal: boolean;
  currentPosition: {x: number; y: number};
}

interface MovableState {
  animate: Animated.ValueXY;
}

class Movable extends Component<MovableProps, MovableState> {
  _panResponder;

  constructor(props: MovableProps) {
    super(props);

    const {x, y} = props.currentPosition;
    // Initialize state
    this.state = {
      // Create instance of Animated.XY, which interpolates
      // X and Y values
      animate: new Animated.ValueXY({x, y}), // Inits both x and y to 0
    };

    // Set value of x and y coordinate
    // this.state.animate.setValue({x: 0, y: 0});

    // Initialize panResponder and configure handlers
    this._panResponder = PanResponder.create({
      //
      // Asks to be the touch responder for a
      // press on the View
      //
      onMoveShouldSetPanResponder: () => true,
      //
      // Actions taken when the View has begun
      // responding to touch events
      //
      onPanResponderGrant: () => {
        //
        // Set offset state.animate to prevent
        // Animated.View from returning to 0
        // coordinates when it is moved again.
        //
        this.state.animate.setOffset({
          x: this.state.animate.x._value,
          y: this.state.animate.y._value,
        });
        //
        // Set value to 0/0 to prevent AnimatedView
        // from "jumping" on start of
        // animate. Stabilizes the component.
        //
        this.state.animate.setValue({x: 0, y: 0});
      },
      //
      // The user is moving their finger
      //
      onPanResponderMove: (e, gesture) => {
        //
        // Set value of state.animate x/y to the
        // delta value of each
        //
        this.state.animate.setValue({
          x: gesture.dx,
          y: gesture.dy,
        });
      },
      //
      // Fired at the end of the touch
      //
      onPanResponderRelease: () => {
        //
        // Merges the offset value into the
        // base value and resets the offset
        // to zero
        //
        this.state.animate.flattenOffset();
        this.checkBoundaries();
      },
    });
  } // End of constructor

  checkBoundaries() {
    const {
      top: {_value: topValue},
      left: {_value: leftValue},
    } = this.state.animate.getLayout();

    if (topValue < MIN_Y && leftValue < MIN_X) {
      this.state.animate.setValue({
        x: 0,
        y: 0,
      });
    }

    let position = {x: leftValue, y: topValue};

    if (topValue < MIN_Y || leftValue < MIN_X) {
      if (leftValue < MIN_X) {
        position.y = topValue;
        position.x = MIN_X;
      }
      if (topValue < MIN_Y) {
        position.y = MIN_Y;
        position.x = leftValue;
      }
    }

    if (topValue > MAX_Y || leftValue > MAX_X) {
      if (topValue > MAX_Y) {
        position.y = MAX_Y;
        position.x = leftValue;
      }

      if (leftValue > MAX_X) {
        position.y = topValue;
        position.x = MAX_X;
      }
    }
    this.state.animate.setValue(position);
    this.props.updatePosition(position);
  }

  componentDidUpdate(preProps: MovableProps, preState: MovableState) {
    const {x, y} = preState.animate;
    const {x: currentX, y: currentY} = this.props.currentPosition;
    if (x._value === currentX && y._value === currentY) {
      return;
    }
    this.setState({animate: new Animated.ValueXY({x: currentX, y: currentY})});
  }

  render() {
    const {isLocal} = this.props;
    const properties = isLocal ? {...this._panResponder.panHandlers} : {};
    return (
      <Animated.View
        // Pass all panHandlers to our AnimatedView
        {...properties}
        //
        // getLayout() converts {x, y} into
        // {left, top} for use in style
        //
        style={[styles.container, this.state.animate.getLayout()]}>
        {this.props.children}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 70,
    height: 70,
    zIndex: 2,
    padding: 5,
  },
});

export default Movable;
