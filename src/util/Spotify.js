const clientID = 'CLIENT_ID'; // not showing my Client ID in GitHub remote
const redirectURI = 'https://mccarterjams.surge.sh/callback';
var userAccessToken;
var access = userAccessToken || window.location.href.match(/access_token=([^&]*)/) ? true: false;

const Spotify = {
  access() {
    // boolean value informs whether or not an access token has been provided from the API
    return access;
  },

  createTokenRedirect() {
    // connect user with clientID to authorization and redirect with implicit grant access token in the URL
    const accessURL = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
    window.location = accessURL;
    return true;
  },

  getAccessToken() {
    // check if the user's access token is already sent, acquire it and return it to utilize API
    if (userAccessToken) {
      return userAccessToken;
    }

    // using Implicit Grant Flow upon authentication
    // check the URL for a match, to see if the access token has just been obtained
    const accessTokenGranted = window.location.href.match(/access_token=([^&]*)/);
    const expiresInGranted = window.location.href.match(/expires_in=([^&]*)/);

    if (accessTokenGranted && expiresInGranted) {
      userAccessToken = accessTokenGranted[1];
      var userExpiresIn = Number(expiresInGranted[1]);
      // set the access token to expire at the value for expiration time
      window.setTimeout( () => userAccessToken = '', userExpiresIn * 1000);
      // clear parameters from URL, allowing acquistion of a new token when it expires
      window.history.pushState('Access Token', null, '/');
      return userAccessToken;
    } else {

      // if access token is not in the URL, then redirect user to URI
      const accessURL = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
      window.location = accessURL;
    }
  },

  parseSearchTracksInfo(jsonResponse) {
    // helper function defines five usable properties of tracks for search
    return jsonResponse.map(track => ({
      id: track.id,
      name: track.name,
      artist: track.artists[0].name,
      album: track.album.name,
      uri: track.uri
    }))
  },

  parseExistingPlaylistTracksInfo(jsonResponse) {
    // helper function defines five usable properties of tracks for existing playlist
    return jsonResponse.map(item => ({
      id: item.track.id,
      name: item.track.name,
      artist: item.track.artists[0].name,
      album: item.track.album.name,
      uri: item.track.uri
    }))
  },

  search(searchTerm) {
    // search the API to GET music tracks based on some input text
    if (!userAccessToken) {
      userAccessToken = Spotify.getAccessToken();
    }

    const baseURLAPI = 'https://api.spotify.com/v1';
    const searchTrack = '/search?type=track&q=';

    return fetch(baseURLAPI + searchTrack + searchTerm, {
      headers: {
        Authorization: `Bearer ${userAccessToken}`
      }
    }).then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(`Request failed. Status: ${response.status}`);
      }, error => console.error(error.message)
    ).then(jsonResponse => {
      if (!jsonResponse.tracks) {
        return [];
      }
      return this.parseSearchTracksInfo(jsonResponse.tracks.items);
    });
  },

  getHeaders() {
    // helper function assigns headers with access token for authorization
    const userAccessToken = this.getAccessToken();
    const headers = {Authorization: `Bearer ${userAccessToken}`};
    return headers;
  },

  getUserId(headers) {
    // helper function GETs current user ID (and name) from Spotify API
    const currentUserProfileURL = 'https://api.spotify.com/v1/me';

    return fetch(currentUserProfileURL, {headers: headers}
      ).then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(`Request failed. Status: ${response.status}`);
        }, error => console.error(error.message)
      ).then(jsonResponse => [jsonResponse.id, jsonResponse.display_name]);
  },

  savePlaylist (name, trackURIs) {
    // CREATE and save a new playlist (name and tracks) on the user's Spotify account
    if (!trackURIs.length) {
      return;
    }
    if (!name) {
      name = 'Unnamed Playlist';
    }
    const headers = this.getHeaders();
    let userID;
    let playlistID;
    
    return this.getUserId(headers).then(userId => {
      userID = userId[0];
      // API Ref: https://developer.spotify.com/documentation/web-api/reference/create-playlist
      const createPlaylistURL = `https://api.spotify.com/v1/users/${userID}/playlists`;
      return fetch(createPlaylistURL, {
        headers: headers,
        method: 'POST',
        body: JSON.stringify( {name: name} )
        });
      }).then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(`Request failed. Status: ${response.status}`);
        }, error => console.error(error.message)
      ).then(jsonResponse => {
        playlistID = jsonResponse.id;
        // API Ref: https://developer.spotify.com/documentation/web-api/reference/add-tracks-to-playlist
        const addUserPlaylistItemsURL = `https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`;
        return fetch(addUserPlaylistItemsURL, {
          headers: headers,
          method: 'POST',
          body: JSON.stringify( {uris: trackURIs} )
        });
    });
  },

  getAllPlaylists() {
    // GET all of the user's playlists from Spotify
    const headers = this.getHeaders();
    let userID;
    let userName;
    let totalPlaylists;

    return this.getUserId(headers).then(userId => {
      [userID, userName] = userId;
      // API Ref: https://developer.spotify.com/documentation/web-api/reference/get-list-users-playlists
      const userPlaylistsURL = `https://api.spotify.com/v1/users/${userID}/playlists`;
      return fetch(userPlaylistsURL, {headers: headers});
      }).then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error(`Request failed. Status: ${response.status}`);
          }, error => console.error(error.message)
        ).then(jsonResponse => {
          if (!jsonResponse.items) {
            return [];
          }
          totalPlaylists = jsonResponse.total;
          let playlists = jsonResponse.items.map(item => ({
            id: item.id,
            image: item.images[0].url,
            name: item.name,
            totalTracks: item.tracks.total
          }));
          return [playlists, userName, totalPlaylists];
        });
  },

  getSelectedPlaylist( selectPlaylist ) {
    // GET the user's selected playlist from Spotify
    const headers = this.getHeaders();
    let userID;
    let playlistID = selectPlaylist;
    let playlistName;

    return this.getUserId(headers).then(userId => {
      userID = userId[0];
      const getPlaylistURL = `https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}`;
      return fetch(getPlaylistURL, {headers: headers});
      }).then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(`Request failed. Status: ${response.status}`);
        }, error => console.error(error.message)
      ).then(jsonResponse => {
        playlistName = jsonResponse.name;
        return [this.parseExistingPlaylistTracksInfo(jsonResponse.tracks.items), playlistName];
      });
  },

  deletePlaylist (playlistID) {
    // helper function deletes existing playlist when all tracks have been removed
    // technically Spotify doesn't delete the playlist_id, the user merely unfollows it, it no longer appears as a playlist
    const headers = this.getHeaders();
    let userID;
    
    return this.getUserId(headers).then(userId => {
      userID = userId[0];
      // API Ref: https://developer.spotify.com/documentation/web-api/concepts/playlists#following-and-unfollowing-a-playlist
      const deletePlaylistURL = `https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/followers`;
      return fetch(deletePlaylistURL, {
        headers: headers,
        method: 'DELETE'
        });
      }).then(response => {
        if (response.ok) {
          return; // It's an empty response
        }
        throw new Error(`Request failed. Status: ${response.status}`);
        }, error => console.error(error.message)
      );
  },

  updatePlaylist (playlistID, name, trackURIs) {
    // UPDATE and save an existing playlist (name and tracks) on the user's Spotify account
    if (!trackURIs.length) {
      return this.deletePlaylist(playlistID);
    }
    if (!name) {
      name = 'Unnamed Playlist';
    }
    const headers = this.getHeaders();
    headers['Content-Type'] = 'application/json';
    let userID;
    
    return this.getUserId(headers).then(userId => {
      userID = userId[0];
      // API Ref: https://developer.spotify.com/documentation/web-api/reference/change-playlist-details
      const changePlaylistNameURL = `https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}`;
      return fetch(changePlaylistNameURL, {
        headers: headers,
        method: 'PUT',
        body: JSON.stringify( {name: name} )
        });
      }).then(response => {
        if (response.ok) {
          return; // It's an empty response
        }
        throw new Error(`Request failed. Status: ${response.status}`);
        }, error => console.error(error.message)
      ).then( () => {
        // API Ref: https://developer.spotify.com/documentation/web-api/reference/reorder-or-replace-playlists-tracks
        const changePlaylistTracksURL = `https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`;
        return fetch(changePlaylistTracksURL, {
          headers: headers,
          method: 'PUT',
          body: JSON.stringify( {uris: trackURIs} )
        });
    });
  }
};

export default Spotify;
