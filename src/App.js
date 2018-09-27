import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import convert from 'xml-js';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      schedule: [],
      currentWeek: null
    };
  }

  componentDidMount() {
    axios.get('https://feeds.nfl.com/feeds-rs/currentWeek.json')
      .then((response) => {
        this.setState({currentWeek: response.data});
        console.log(this.state.currentWeek);
        this.getCurrentSchedule();
      })
      .catch((error) => { });    
  }

  getCurrentSchedule() {
    axios.get('http://www.nfl.com/ajax/scorestrip?'+
              'season='+this.state.currentWeek.seasonId+
              '&seasonType='+this.state.currentWeek.seasonType+
              '&week='+this.state.currentWeek.week)
      .then((response) => {
        const result = convert.xml2json(response.data, {compact: true, spaces: 4});
        console.log(result);
        this.setState({ schedule: JSON.parse(result).ss.gms.g });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <div className="App">
        <pre>
          <ul>
            {this.state.schedule.map((item, i)=><li key={i}>{item._attributes.hnn} {item._attributes.hs} vs. {item._attributes.vnn} {item._attributes.vs}</li>)}
          </ul>
        </pre>
      </div>
    );
  }
}

export default App;
