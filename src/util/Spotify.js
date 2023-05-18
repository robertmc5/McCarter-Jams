const clientID = 'CLIENT_ID'; // not showing my Client ID in GitHub remote
const redirectURI = 'http://localhost:3000/callback/';
var userAccessToken;
var access = userAccessToken || window.location.href.match(/access_token=([^&]*)/) ? true: false;

const Spotify = {
  access() {
    return access;
  },

  createTokenRedirect() {
    // redirect user to URI to implicit grant access token in the URL
    const accessURL = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
    window.location = accessURL;
    return true;
  },

  getAccessToken() {
    // check if the user's access token is already sent, acquire it and relay it to use with search
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

  search(searchTerm) {
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
      return jsonResponse.tracks.items.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri
      }));
    });
  },

  savePlaylist (name, trackURIs) {
    if (!name || !trackURIs.length) {
      return;
    }
    const userAccessToken = Spotify.getAccessToken();
    const headers = {Authorization: `Bearer ${userAccessToken}`};
    let userID;
    const currentUserProfileURL = 'https://api.spotify.com/v1/me';
    let playlistID;
    
    return fetch(currentUserProfileURL, {headers: headers}
      ).then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(`Request failed. Status: ${response.status}`);
        }, error => console.error(error.message)
      ).then(jsonResponse => {
        userID = jsonResponse.id;
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
          const addUserPlaylistItemsURL = `https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`;
          return fetch(addUserPlaylistItemsURL, {
            headers: headers,
            method: 'POST',
            body: JSON.stringify( {uris: trackURIs} )
          });
    });
  }
};

export default Spotify;
