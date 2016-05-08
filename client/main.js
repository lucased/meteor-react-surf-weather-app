import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

class App extends Component {
  render() {
    return <TestMap />
  }
}

class TestMap extends TrackerReact(Component) {
  constructor() {
    super();
    this.state = {
      lat: -37.8136,
      lng: 144.9631
    }
  }

  componentDidMount() {
    GoogleMaps.load({v: '3', key: 'AIzaSyCNWe5bxCRFvXKo2X3zomcd0gK-QoaVFbY'});
  }

  mapsLoaded() {
    return GoogleMaps.loaded();
  }

  _mapOptions() {
    if(this.mapsLoaded()) {
      return {
        center: new google.maps.LatLng(this.state.lat, this.state.lng),
        zoom: 8
      };
    }
  }

  render() {
    console.log(this._mapOptions());
    if (this.mapsLoaded()) {
      return <GoogleMap name="myapp" options={this._mapOptions()}/>
    }
    return <div>Loading ...</div>
  }
}

class GoogleMap extends Component {
  componentDidMount() {
    GoogleMaps.create({
      name: this.props.name,
      element: ReactDOM.findDOMNode(this),
      options: this.props.options
    });

    GoogleMaps.ready(this.props.name, function (map) {
      var marker = new google.maps.Marker({
        position: map.options.center,
        map: map.instance
      });
      google.maps.event.addListener(map.instance, 'click', function (e) {
        console.log(e.latLng.lat() + " : " + e.latLng.lng());
      } )
    });
    
  }

  componentWillUnmount() {
    if (GoogleMaps.maps[this.props.name]) {
      google.maps.event.clearInstanceListeners(GoogleMaps.maps[this.props.name].instance);
      delete GoogleMaps.maps[this.props.name];
    }
  }

  render() {
    return <div className="map-container"></div>;
  }
}


if (Meteor.isClient) {
  Meteor.startup(function () {
    ReactDOM.render(<App/>, document.getElementById('app'));
  });
}