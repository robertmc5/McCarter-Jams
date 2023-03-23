import React from 'react';
import './app.css';

import SearchBar from '../searchBar/SearchBar';
import SearchResults from '../searchResults/SearchResults';
import Playlist from '../playlist/Playlist';

import Spotify from '../../util/Spotify';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [],
      playlistName : 'My Playlist',
      playlistTracks : []
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  search(searchTerm) {
    Spotify.search(searchTerm).then(searchResults => {
      this.setState( {searchResults: searchResults} );
    });
  }

  addTrack(track) {
    let newPlaylistTracks = this.state.playlistTracks;
    if (this.state.playlistTracks.find(playlistTrack => playlistTrack.id === track.id)) {
      return;
    }
    newPlaylistTracks.push(track);
    this.setState( {playlistTracks: newPlaylistTracks} );
  }

  removeTrack(track) {
    let newPlaylistTracks = this.state.playlistTracks;
    newPlaylistTracks = newPlaylistTracks.filter(playlistTrack => playlistTrack.id !== track.id);
    this.setState( {playlistTracks: newPlaylistTracks} );
  }

  updatePlaylistName(name) {
    this.setState( {playlistName: name} );
  }

  savePlaylist() {
    const trackURIs = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs).then( () => {
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks: []
      });
    });
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} 
              onAdd={this.addTrack} />
            <Playlist playlistName={this.state.playlistName} 
              playlistTracks={this.state.playlistTracks} 
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
