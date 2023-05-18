import React, { useState } from 'react';
import './app.css';

import SearchBar from '../searchBar/SearchBar';
import SearchResults from '../searchResults/SearchResults';
import Playlist from '../playlist/Playlist';
import Authorization from '../authorization/Authorization';

import Spotify from '../../util/Spotify';

const App = () => {

  const [searchResults, setSearchResults] = useState([]);
  const [playlistName, setPlaylistName] = useState('My Playlist');
  const [playlistTracks, setPlaylistTracks] = useState([]);

  const authorize = () => {
    Spotify.createTokenRedirect();
  }

  const search = searchTerm => {
    Spotify.search(searchTerm).then(searchResults => {
      setSearchResults( searchResults );
    });
  }

  const addTrack = track => {
    if (playlistTracks.find(playlistTrack => playlistTrack.id === track.id)) {
      return;
    }
    setPlaylistTracks(prevState => [...prevState, track]);
  }

  const removeTrack = track => {
    setPlaylistTracks(prevState => prevState.filter(playlistTrack => playlistTrack.id !== track.id));
  }

  const updatePlaylistName = name => {
    setPlaylistName(name);
  }

  const savePlaylist = () => {
    const trackURIs = playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(playlistName, trackURIs).then( () => {
      setPlaylistName('New Playlist');
      setPlaylistTracks([]);
    });
  }

  return (
    <div>
      <h1>McCarter <span className="highlight">Jams</span></h1>
      <div className="App">
        {!Spotify.access() && <Authorization 
          onAuthorize={authorize} />
        }
        {Spotify.access() && <SearchBar 
          onSearch={search} />
        }
        <div className="App-lists">
          <SearchResults 
            searchResults={searchResults} 
            onAdd={addTrack} />
          <Playlist 
            playlistName={playlistName} 
            playlistTracks={playlistTracks} 
            onRemove={removeTrack}
            onNameChange={updatePlaylistName}
            onSave={savePlaylist} />
        </div>
      </div>
    </div>
  );
}

export default App;
