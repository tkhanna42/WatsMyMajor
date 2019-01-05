import React, { Component } from 'react';
import PropTypes from 'prop-types';

import DayView from './DayView';
import MultipleDaysView from './MultipleDaysView';
import { addDays } from './dateUtils';
import { arrayEquals } from '../../../utils/arrays';
import { MODE_DAY, MODE_WEEK, DAYS_IN_WEEK, DAYS_IN_THREE_DAYS } from '../constants';

// TODO: set 'NODE_PATH=src/' in .env file to get below to work, (and then refactor a bunch of files):
// import { arrayEquals } from 'utils/arrays';

const SWIPE_THRESHOLD = 20;

const styles = {
  container: {
    height: '100%',
    willChange: 'transform',
  },
  slide: {
    height: '100%'
  },
  slideContainer: {
    position: 'relative',
    height: '100%',
    width: '100%',
  }
};

// const debugLog = () => {
//   return (console.log("2") || true);
// }

function getEventsFromChildren(children) {
  if(children == null) {
    return [];
  } else if (!Array.isArray(children)) {
    return [children];
  } else {
    return children;
  }
}

function getTimeOrDefault(date) {
  return date == null ? 0 : date.getTime();
}

class Calendar extends Component {

  static propTypes = {
    date: PropTypes.instanceOf(Date).isRequired,
    referenceDate: PropTypes.instanceOf(Date).isRequired,
    mode: PropTypes.string.isRequired,
    getIndex: PropTypes.func.isRequired,
    children: PropTypes.array.isRequired,
    style: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    const index = props.getIndex();

    this.state = {
      scrollPosition: 630,
      index,
      startXPos: null,
      startYPos: null,
    };
  }

  componentDidMount = () => {
    console.log("componentDidMount", {
      index: this.props.getIndex(),
      referenceDate: this.props.referenceDate,
      addDays: addDays(this.props.referenceDate, this.props.getIndex()),
      date: this.props.date
    });
  }

  componentDidUpdate = (prevProps, prevState) => {
    console.log(`componentDidUpdate`, {
      index: this.props.getIndex(),
      nextIndex: prevProps.getIndex(),
      stateIndex: this.state.index,
      prevStateIndex: prevState.index,
      date: this.props.date,
      prevDate: prevProps.date,
    });

    Object.keys(this.props).forEach((key) => {
      const propKey = this.props[key];
      const prevPropKey = prevProps[key];
      if (prevPropKey !== propKey) {
        if (key === "children") {
          console.log({ key: !arrayEquals(prevProps.children, this.props.children) });
        }
        console.log( { "diff": key, prevPropKey, propKey } );
      }
    });


    Object.keys(this.state).forEach((key) => {
      const propKey = this.state[key];
      const prevPropKey = prevState[key];
      if (prevPropKey !== propKey) {
        console.log( { "diff": key, prevPropKey, propKey } );
      }
    });

    if (getTimeOrDefault(prevProps.date) !== getTimeOrDefault(this.props.date)) {
      this.setState((state) =>  {
        const newIndex = this.props.getIndex();
        console.log(`update index ${(state.index !== prevState.index)}, ${getTimeOrDefault(prevProps.date) !== getTimeOrDefault(this.props.date)}, ${newIndex}`);
        return { index: newIndex };
      });

      return;
    }
    // const index = this.props.getIndex();
    // if (index !== this.state.index) {
    //   this.setState((state) => {
    //     const newIndex = (state.index != prevState.index)
    //       ? state.index
    //       : index;
    //     console.log(`update index ${(state.index != prevState.index)}, ${getTimeOrDefault(prevProps.date) !== getTimeOrDefault(this.props.date)}, ${newIndex}`);
    //     return {
    //       index: newIndex,
    //     };
    //   });
    //   // if (this.state.index != prevState.index) {
    //   //   console.log(`update index ${this.state.index} != ${prevState.index}`);
    //   // }
    // }
  }

  // shouldComponentUpdate = (nextProps, nextState) => {
  //   console.log("shouldComponentUpdate", {
  //     referenceDateProp: this.props.date,
  //     referenceDateNextProp: nextProps.date,
  //     index: this.props.getIndex(),
  //     nextIndex: nextProps.getIndex(),
  //     stateIndex: this.state.index,
  //     nextStateIndex: nextState.index,
  //   });

  //   // const index = nextProps.getIndex();
  //   // if (index !== this.state.index) {
  //   //   console.log("update index");
  //   //   this.setState({index});
  //   // }
  //   return (getTimeOrDefault(nextProps.date) !== getTimeOrDefault(this.props.date) && (console.log("1") || true))
  //     || (nextProps.mode !== this.props.mode && (console.log("2") || true))
  //     || (this.props.getIndex() !== nextState.index && (console.log("3") || true))
  //     || (!arrayEquals(nextProps.children, this.props.children) && (console.log("4") || true));
  // }

  onChangeIndex = (index, indexLatest, meta) => {
    console.log("onChangeIndex", index, indexLatest, meta);
    this.setState({ index });
  }

  // slideRenderer = (slide) => {
  slideRenderer = () => {
  // slideRenderer = (slideIndex) => {
    const slideIndex = this.state.index;
    // const slideIndex = this.props.getIndex();
    // const slideIndex = slide.index;
    // console.log("slideRender", this.props.date, slide);
    console.log("slideRender");
    const { scrollPosition } = this.state;
    const { mode, referenceDate, children } = this.props;

    const viewProps = {
      onScrollChange: this.onScrollChange,
      scrollPosition,
      children: getEventsFromChildren(children),
      style: styles.container,
    }

    return (
      <div key={ slideIndex } style={ styles.slideContainer }>
        {
          mode === MODE_DAY
            ? <DayView
              { ...viewProps }
              date={ addDays(referenceDate, slideIndex) } />
            : <MultipleDaysView
              { ...viewProps }
              dates={ mode === MODE_WEEK ? this.getWeekDates(slideIndex) : this.getThreeDaysDates(slideIndex) } />
        }
      </div>
    );
  }

  getWeekDates = (index) => {
    const currentDay = addDays(this.props.referenceDate, index * DAYS_IN_WEEK);
    return [
      ...Array(DAYS_IN_WEEK)
    ].map((_, i) => addDays(currentDay, i - currentDay.getDay()));
  }

  getThreeDaysDates = (index) => {
    const currentDay = addDays(this.props.referenceDate, index * DAYS_IN_THREE_DAYS);
    return [
      ...Array(DAYS_IN_THREE_DAYS)
    ].map((_, i) => addDays(currentDay, i));
  }

  onScrollChange = (scrollPosition) => {
    console.log(`onScrollChange: ${scrollPosition}`);
    this.setState({ scrollPosition });
  }


  // TODO:
  // move onTouchStart, onTouchEnd functionality into HOC (maybe withSwipeable)

  onTouchStart = e => {
    const { screenX: startXPos, screenY: startYPos } = e.changedTouches[0];
    this.setState({ startXPos, startYPos });

    console.log(`onTouchStart`);
  }

  // Note: onTouchMove has built in threshold
  // update to use it that way,
  // might alsp help when animating a transition,
  // but avoid that if possible...seems expensive

  onTouchEnd = e => {
    const { startXPos, startYPos } = this.state;
    const { screenX: endXPos, screenY: endYPos } = e.changedTouches[0];

    const xDelta = Math.abs(endXPos - startXPos);
    const yDelta = Math.abs(endYPos - startYPos);
    const horizontalSwipe = (xDelta > SWIPE_THRESHOLD) && (xDelta >= yDelta);

    // console.log(`onTouchEnd diff ${xDiff}, ${yDiff}, ${hSwipe ? 's': 'np'} ${ hSwipe && (endXPos > startXPos ? 'r' : 'l') }`);
    // might replace with hammer.js
    if (horizontalSwipe) {
      if (endXPos > startXPos) {
        // call onSwipeRight
        console.log('onSwipeRight');
      }
      else {
        // call onSwipeLeft
        console.log('onSwipeLeft');
      }
    }
  }

  // TODO: spent too much time on this, so putting it on hold
  // should either:
  // - implement custom swipe handling w/ animations
  // but seems tricky to get completely right
  // - look into a different third party library to handle swipeable animations
  // but couldn't find a suitable replacement react-swipeable-views
  // - wait for react-swipeablt-views to get better
  // maintainer is focusing on Material UI so it hasn't been updated in a while

  render() {
    return (
      <div
        style={ this.props.style }
        onTouchStart={ this.onTouchStart }
        onTouchEnd={ this.onTouchEnd }
      >
        {this.slideRenderer()}
      </div>
    );
  }
}

export default Calendar;
