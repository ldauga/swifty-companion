import { Animated } from "react-native";
import { Component } from "react";

export class SplashScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opacity: new Animated.Value(1),
      show: 'block',
    };
  }

  show = (duration) => {
    this.state.opacity.setValue(0);
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: duration,
      useNativeDriver: true,
    }).start();
  };

  unshow = (duration) => {
    this.state.opacity.setValue(1);
    Animated.timing(this.state.opacity, {
      toValue: 0,
      duration: duration,
      useNativeDriver: true,
    }).start();
  };

  render() {
    const opacity = this.state.opacity.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    return (
      <Animated.View style={{ opacity: opacity, display: this.props.display ? 'block' : 'none'}}>
        {this.props.children}
      </Animated.View>
    );
  }
}
