import React, { useState } from 'react';
import './app.css';

import Authorization from '../../components/authorization/Authorization';
import SearchBar from '../../components/searchBar/SearchBar';
import SearchResults from '../searchResults/SearchResults';
import NewPlaylist from '../newPlaylist/NewPlaylist';
import AllPlaylists from '../allPlaylists/AllPlaylists';

import Spotify from '../../util/Spotify';

const App = () => {

  const [searchResults, setSearchResults] = useState([]);
  const [playlistPanel, setPlaylistPanel] = useState('New');
  const [newPlaylistName, setNewPlaylistName] = useState('My Playlist');
  const [newPlaylistTracks, setNewPlaylistTracks] = useState([]);
  const [allPlaylists, setAllPlaylists] = useState([]);
  const [userNameAndTotal, setUserNameAndTotal] = useState([]);
  const [selectPlaylist, setSelectPlaylist] = useState('');
  const [existingPlaylistName, setExistingPlaylistName] = useState('');
  const [existingPlaylistTracks, setExistingPlaylistTracks] = useState([]);

  const authorize = () => {
    Spotify.createTokenRedirect();
  }

  const search = searchTerm => {
    Spotify.search(searchTerm).then(searchResults => {
      setSearchResults( searchResults );
    });
  }

  const switchPlaylist = playlistChoice => {
    setPlaylistPanel( playlistChoice );
    if (playlistChoice === 'All' && allPlaylists.length === 0) {
      Spotify.getAllPlaylists().then(playlists => {
        setAllPlaylists(playlists[0])
        setUserNameAndTotal([playlists[1], playlists[2]])
      });
    }
  }

  const selectFromAll = (playlistId) => {
    setSelectPlaylist( playlistId );
  }

  const addTrack = track => {
    if ((playlistPanel === 'All') ||
        (playlistPanel === 'New' && newPlaylistTracks.find(newPlaylistTrack => newPlaylistTrack.id === track.id)) ||
        (playlistPanel === 'Edit' && existingPlaylistTracks.find(existingPlaylistTrack => existingPlaylistTrack.id === track.id))) {
      return;
    }
    if (playlistPanel === 'New') {
      setNewPlaylistTracks(prevState => [...prevState, track]);
    }
    if (playlistPanel === 'Edit') {
      setExistingPlaylistTracks(prevState => [...prevState, track]);
    }
  }

  const removeTrack = track => {
    if (playlistPanel === 'New') {
      setNewPlaylistTracks(prevState => prevState.filter(newPlaylistTrack => newPlaylistTrack.id !== track.id));
    }
    if (playlistPanel === 'Edit') {
      setExistingPlaylistTracks(prevState => prevState.filter(existingPlaylistTrack => existingPlaylistTrack.id !== track.id));
    }
  }

  const updatePlaylistName = name => {
    if (playlistPanel === 'New') {
      setNewPlaylistName(name);
    }
    if (playlistPanel === 'Edit') {
      setExistingPlaylistName(name);
    }
  }

  const savePlaylist = () => {
    if (playlistPanel === 'New') {
      const trackURIs = newPlaylistTracks.map(track => track.uri);
      Spotify.savePlaylist(newPlaylistName, trackURIs).then( () => {
        setNewPlaylistName('My Playlist');
        setNewPlaylistTracks([]);
        setAllPlaylists([]);
      });
    }
    if (playlistPanel === 'Edit') {
      const trackURIs = existingPlaylistTracks.map(track => track.uri);
      Spotify.savePlaylist(existingPlaylistName, trackURIs).then( () => {
        Spotify.getAllPlaylists().then(playlists => {
          setAllPlaylists( playlists );
        });
        setPlaylistPanel('All');
      });
    }
  }

  return (
    <div>
      <h1>McCarter <span className="highlight">Jams</span> v2</h1>
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
          {playlistPanel === 'New' && 
            <NewPlaylist
              newPlaylistName={newPlaylistName} 
              newPlaylistTracks={newPlaylistTracks} 
              onSwitch={switchPlaylist}
              onRemove={removeTrack}
              onNameChange={updatePlaylistName}
              onSave={savePlaylist} />
          }
          {playlistPanel === 'All' && 
            <AllPlaylists
              userNameAndTotal={userNameAndTotal}
              allPlaylists={allPlaylists}
              selectPlaylist={selectPlaylist}
              onSelect={selectFromAll}
              onSwitch={switchPlaylist} />
          }
        </div>
      </div>
    </div>
  );
}

export default App;
