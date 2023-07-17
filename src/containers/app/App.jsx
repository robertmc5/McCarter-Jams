import React, { useState } from 'react';
import './app.css';

import Authorization from '../../components/authorization/Authorization';
import SearchBar from '../../components/searchBar/SearchBar';
import SearchResults from '../searchResults/SearchResults';
import NewPlaylist from '../newPlaylist/NewPlaylist';
import AllPlaylists from '../allPlaylists/AllPlaylists';
import ExistingPlaylist from '../existingPlaylist/ExistingPlaylist';

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
  const [existingPlaylistId, setExistingPlaylistId] = useState('');
  const [editingExisting, setEditingExisting] = useState(false);

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
    else if (playlistChoice === 'Edit' && (existingPlaylistTracks.length === 0 || existingPlaylistId !== selectPlaylist) && selectPlaylist && !editingExisting) {
      Spotify.getSelectedPlaylist( selectPlaylist ).then(playlist => {
        setExistingPlaylistTracks(playlist[0])
        setExistingPlaylistName(playlist[1])
        setExistingPlaylistId(selectPlaylist)
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
      setEditingExisting(true);
    }
  }

  const removeTrack = track => {
    if (playlistPanel === 'New') {
      setNewPlaylistTracks(prevState => prevState.filter(newPlaylistTrack => newPlaylistTrack.id !== track.id));
    }
    if (playlistPanel === 'Edit') {
      setExistingPlaylistTracks(prevState => prevState.filter(existingPlaylistTrack => existingPlaylistTrack.id !== track.id));
      setEditingExisting(true);
    }
  }

  const updatePlaylistName = name => {
    if (playlistPanel === 'New') {
      setNewPlaylistName(name);
    }
    if (playlistPanel === 'Edit') {
      setExistingPlaylistName(name);
      setEditingExisting(true);
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
      let unfollow = false;
      if (trackURIs.length === 0) { unfollow = true; }
      let getNextPlaylist = (selectPlaylist && existingPlaylistId !== selectPlaylist) ? true: false;
      Spotify.updatePlaylist(existingPlaylistId, existingPlaylistName, trackURIs).then( () => {
        setExistingPlaylistName('');
        setExistingPlaylistTracks([]);
        setExistingPlaylistId('');
        setAllPlaylists([]);
        setEditingExisting(false);
        if (unfollow && !getNextPlaylist) { setSelectPlaylist(''); }
      }).then( () => {
        if (!getNextPlaylist) {
          setPlaylistPanel('All');
          Spotify.getAllPlaylists().then(playlists => {
            setAllPlaylists(playlists[0])
            setUserNameAndTotal([playlists[1], playlists[2]])
          });
        }
        else if (getNextPlaylist) {
          Spotify.getSelectedPlaylist( selectPlaylist ).then(playlist => {
            setExistingPlaylistTracks(playlist[0]);
            setExistingPlaylistName(playlist[1]);
            setExistingPlaylistId(selectPlaylist);
          })
        }
      });
    }
  }

  const rescindChanges = () => {
    setEditingExisting(false);
    if (selectPlaylist) {
      Spotify.getSelectedPlaylist( selectPlaylist ).then(playlist => {
        setExistingPlaylistTracks(playlist[0]);
        setExistingPlaylistName(playlist[1]);
        setExistingPlaylistId(selectPlaylist);
      });
    }
    else if (!selectPlaylist) {
      setExistingPlaylistTracks([]);
      setExistingPlaylistName('');
      setExistingPlaylistId('');
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
          {playlistPanel === 'Edit' && 
            <ExistingPlaylist
              selectPlaylist={selectPlaylist}
              existingPlaylistName={existingPlaylistName}
              existingPlaylistTracks={existingPlaylistTracks} 
              existingPlaylistId={existingPlaylistId}
              editingExisting={editingExisting}
              onSwitch={switchPlaylist}
              onRemove={removeTrack}
              onNameChange={updatePlaylistName}
              onSave={savePlaylist}
              onRescind={rescindChanges} />
          }
        </div>
      </div>
    </div>
  );
}

export default App;
