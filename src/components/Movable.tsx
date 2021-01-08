import React, {Component} from 'react';
import {Animated, PanResponder, StyleSheet} from 'react-native';

interface MovableProps {}

interface MovableState {
  animate: Animated.ValueXY;
}

class Movable extends Component<MovableProps, MovableState> {
  _panResponder;

  constructor(props: MovableProps) {
    super(props);

    // Initialize state
    this.state = {
      // Create instance of Animated.XY, which interpolates
      // X and Y values
      animate: new Animated.ValueXY(), // Inits both x and y to 0
    };

    // Set value of x and y coordinate
    this.state.animate.setValue({x: 0, y: 0});

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
    const MAX_X = 355;
    const MAX_Y = 700;
    const MIN_X = 0;
    const MIN_Y = 0;

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
  }

  render() {
    return (
      <Animated.View
        // Pass all panHandlers to our AnimatedView
        {...this._panResponder.panHandlers}
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
