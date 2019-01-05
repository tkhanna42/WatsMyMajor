import React, { Component } from 'react';
import PropTypes from 'prop-types';
import verticalHours from './verticalHours';
import renderDayEvents from './DayEvents';
import DayHeader from './DayHeader';

// import { arrayEquals } from '../../../utils/arrays';

const height = 1800;
const firstColumnWidth = '60px';
const headerHeight = '60px';
const bigBorder = 'solid 2px #bababa';

const styles = {
  container: {
    height: '100%',
    width: '100%',
    position: 'relative',
    overflowX: 'hidden'
  },
  dayHeader: (count, i) => ({
    position: 'absolute',
    left: `${(100 / count) * i}%`,
    width: `${100 / count}%`,
    height: headerHeight,
    borderLeft: 'solid 1px #e2e2e2',
    borderBottom: bigBorder,
    padding: '5px',
    boxSizing: 'border-box'
  }),
  dayEvent: (count, i) => ({
    position: 'absolute',
    height: '100%',
    left: `${(100 / count) * i}%`,
    width: `${100 / count}%`,
    borderLeft: 'solid 1px #e2e2e2'
  }),
  firstColumn: {
    height: headerHeight,
    position: 'absolute',
    left: '0',
    top: '0',
    width: firstColumnWidth,
    borderBottom: bigBorder,
    boxSizing: 'border-box'
  },
  headerContainer: {
    height: headerHeight,
    position: 'absolute',
    right: 20,
    left: firstColumnWidth,
    top: '0'
  },
  bodyContainer: {
    height: `calc(100% - ${headerHeight})`,
    position: 'absolute',
    left: '0',
    right: '0',
    top: headerHeight,
    bottom: '0',
    overflowX: 'hidden'
  },
  hoursContainer: {
    height,
    position: 'absolute',
    left: '0',
    top: '0',
    borderTop: '1px solid #e2e2e2'
  },
  daysContainer: {
    height,
    position: 'absolute',
    right: '0',
    left: firstColumnWidth,
    top: '0'
  }
}

const renderDaysHeader = (dates) => {
  return dates.map((date,i) => (
    <DayHeader
      key={ i }
      style={ styles.dayHeader(dates.length, i) }
      date={ date } />
  ));
}

const renderDays = (dates, children) => {
  return dates.map((date,i) => (
    <div
      key={ i }
      style={ styles.dayEvent(dates.length, i) }
    >
      {
        renderDayEvents({
          events: children,
          date: date,
        })
      }
    </div>
  ));
}


// function getTimeOrDefault(date) {
//   return date == null ? 0 : date.getTime();
// }

export default class MultipleDaysView extends Component {
  static propTypes = {
    dates: PropTypes.array.isRequired,
    scrollPosition: PropTypes.number.isRequired,
    onScrollChange: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired
  };

  constructor(props) {
    // console.log({ scrollPosition: props.scrollPosition });
    super(props);
    this.scrollViewer = React.createRef();
  }


  // componentDidUpdate = (prevProps) => {
  //   console.log(`componentDidUpdate`, {prevProps});
  //   Object.keys(this.props).forEach((key) => {
  //     const propKey = this.props[key];
  //     const prevPropKey = prevProps[key];
  //     if (prevPropKey !== propKey) {
  //       if (key === "children") {
  //         console.log({ key2: !arrayEquals(prevProps.children, this.props.children) });
  //       }
  //       console.log( { "diff": key, prevPropKey, propKey } );
  //     }
  //   });

  // }

  // shouldComponentUpdate = (nextProps) => {
  //   const shouldUpdate = nextProps.dates.every((date, idx) => getTimeOrDefault(date) !== getTimeOrDefault(this.props.dates[idx]));

  //   console.log("shouldComponentUpdate", shouldUpdate, nextProps.dates, this.props.dates);

  //   return shouldUpdate;

  // }
  
  componentDidMount = () => {
    this.scrollViewer.current.scrollTop = this.props.scrollPosition;
  }

  componentWillUnmount = () => {
    const scrollPosition = this.scrollViewer.current.scrollTop;
    // console.log("componentWillUnmount", scrollPosition);
    this.props.onScrollChange(scrollPosition);
  }

  render() {
    const {
      dates,
      children
    } = this.props;

    return (
      <div style={ styles.container }>
        <div style={ styles.firstColumn } />
        <div style={ styles.headerContainer }>
          {
            renderDaysHeader(dates)
          }
        </div>
        <div
          ref={ this.scrollViewer }
          style={ styles.bodyContainer }>
          <div style={ styles.hoursContainer }>
            {
              verticalHours()
            }
          </div>
          <div style={ styles.daysContainer }>
            {
              renderDays(dates, children)
            }
          </div>
        </div>
      </div>
    );
  }
}
