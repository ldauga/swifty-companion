import { Animated } from 'react-native';
import { Component } from 'react';

export class ShakeDiv extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shake: new Animated.Value(0),
    };
  }

  startShake = () => {
    this.state.shake.setValue(0);
    Animated.timing(this.state.shake, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  render() {

	const shake = this.state.shake.interpolate({
      inputRange: [0, 0.25, 0.5, 0.75, 1],
      outputRange: [0, -5, 0, 5, 0],
    });

    return (
      <Animated.View
        style={[
          { transform: [{ translateX: shake }]},
        ]}
      >
        {this.props.children}
      </Animated.View>
    );
  }
}
