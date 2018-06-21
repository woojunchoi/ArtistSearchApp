import React, { Component } from 'react';
import './App.css';
import Spotify from 'spotify-web-api-js'

const spotifyWebApi = new Spotify()

class App extends Component {
  constructor(props) {
    super(props)
    const params = this.getHashParams()
    this.state = {
      loggedin: params.access_token ? true : false,
      artist:'',
      loaded:false,
      LoadedArtist: {
        image:[],
        name:'',
        followers:0,
        genre:''
      },
      nowPlaying: {
        name: 'Not Checked',
        image: ''
      }
    }
    if (params.access_token) {
      spotifyWebApi.setAccessToken(params.access_token)
    }
  }

  getHashParams = () => {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    while (e = r.exec(q)) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  searchArtist = () => {
    spotifyWebApi.searchArtists(this.state.artist)
    .then((response) => {
      console.log(response.artists.items[0].images)
      this.setState({
        loaded:true,
        LoadedArtist:{
          image:response.artists.items[0].images,
          name:response.artists.items[0].name,
          followers:response.artists.items[0].followers.total,
          // genre:response.artists.items[0].genre[0]
        }
      })
    })
  }

  getNowPlaying = () => {
    console.log(spotifyWebApi)
    spotifyWebApi.getMyCurrentPlaybackState()
      .then((response) => {
        this.setState({
          nowPlaying: {
            name: response.item.name,
            image: response.item.album.images[0].url
          }
        })
      }).catch((error) => { console.log(error) })
  }

  loginText = () => {
    if (this.state.loggedin) {
      return <p>You are LoggedIn!</p>
    }
    else {
      return (
        <a href='http://localhost:8888'>
          <button>Login</button>
        </a>
      )
    }
  }

  picture = () => {
    if(this.state.loaded) {
      return <img src={this.state.LoadedArtist.image[0].url} />
    }
    return;
  }

  render() {
    return (
      <div className="App">
        {this.loginText()}
        <div>Now Playing {this.state.nowPlaying.name} </div>
        <div>
          <img src={this.state.nowPlaying.image} style={{ width: 100 }} />
        </div>
        <input onChange={(e) => this.setState({
          artist:e.target.value
        })} />
        <button onClick={this.searchArtist}> search artist </button>
        <button onClick={() => this.getNowPlaying()}>
          Check Now Playing
      </button>
        {this.picture()}
      </div>
    );
  }
}

export default App;
