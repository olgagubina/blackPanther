import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import SearchForm from './SearchForm';
import ArtistBox from './ArtistBox';

class App extends Component {
  constructor(props) {
    super(props);
    this.searchArtist = this.searchArtist.bind(this);
    this.searchRelated = this.searchRelated.bind(this);
    this.state = { artistId: "", artistName: "", relArtists: [] };
  }
  searchArtist(artistName) {
    const baseUrl = `http://api.musixmatch.com/ws/1.1/`;
    const apikey = `&apikey=9a1d5a8de6743ba0370a953a471dc3b9`;
    const artistSearch = `artist.search?q_artist=${artistName}&page_size=1`;
    // const relatedSearch = `artist.related.get?artist_id=${this.state.artistId}&page_size=3&page=1`;
    let that = this;
    axios({
      type: "GET",
      method: "GET",
      url: `${baseUrl}${artistSearch}${apikey}`, // 
      headers: {
        'apikey': "9a1d5a8de6743ba0370a953a471dc3b9",
        'format': "jsonp",
        'callback': "jsonp_callback",
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      dataType: "jsonp",
      jsonpCallback: 'jsonp_callback',
    })
      .then(function (response) {
        console.log(response.data);
        that.setState(
          {
            artistId: response.data.message.body.artist_list[0].artist.artist_id,
            artistName: response.data.message.body.artist_list[0].artist.artist_name
          }
        );
      })
      .then(function () {
        that.searchRelated();
      })
      .catch(error => {
        alert('Ooops, try again');
        console.log('Error fetching and parsing data', error);
      });
  }
  searchRelated() {
    let that = this;
    axios({
      type: "GET",
      method: "GET",
      url: `http://api.musixmatch.com/ws/1.1/artist.related.get?artist_id=${this.state.artistId}&page_size=3&page=1&apikey=9a1d5a8de6743ba0370a953a471dc3b9`,
      headers: {
        'apikey': "9a1d5a8de6743ba0370a953a471dc3b9",
        'format': "jsonp",
        'callback': "jsonp_callback",
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      dataType: "jsonp",
      jsonpCallback: 'jsonp_callback',
    })
      .then(function (response) {
        console.log(response.data);
        let relatedArray = response.data.message.body.artist_list;
        let relArtists = [];
        for (let obj of relatedArray) {
          let singleRelArtist = {
            relArtistId: obj.artist.artist_id,
            relArtistName: obj.artist.artist_name
          };
          relArtists.push(singleRelArtist);
        }
        that.setState({ relArtists: relArtists });
      })
  }

  render() {
    if (this.state.artistName) {
      return (
        <div className="App">
          <p className="App-title">BLACK PANTHER</p>
          <SearchForm onSubmitSearchForm={this.onSubmitSearchForm} />
          <ArtistBox artistInfo={this.state} searchArtist={this.searchArtist}/>
        </div>
      )
    } else return (
      <div className="App">
        <p className="App-title">BLACK PANTHER</p>
        <SearchForm searchArtist={this.searchArtist} />
      </div>
    );
  }
}

export default App;
