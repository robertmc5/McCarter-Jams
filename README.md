# McCarter Jams  
## Music Playlist App that reads from and writes to the Spotify API  
### Allows users to search the Spotify library, create a custom playlist, then save it to their Spotify account  
#### User must sign into Spotify through the App to use it  
  
This project is an adapted and expanded version of a Codecademy Front-End Engineer Career Project.  
  
**UPDATE: I rewrote all the React components**  
They were originally created as class components, but I replaced them with function components.  
So, it now uses the State Hook to manage state, and all classes, constructors with bindings and 'this' keywords were all removed. The methods were rewritten and ones that managed states with compound types were reformulated since useState() does not merge previous data.  
  
The original styling was a little off, so I re-did all that as well.  
  
It does use Implicit Grant Flow upon authentication and access tokens issued are short-lived.  
*This is a recognized security flaw as it does not involve storing secret keys.*  
  
**UPDATE: I redesigned the initial login**  
In the original design the user had to click Search twice initially to get started.  
I designed a separate component for the initial access token so it doesn't confuse the user.  
Now when the user sees a search bar, they have already established access and can search.  
  
It is deployed with surge and available online at https://mccarterjams.surge.sh  
I had to be sure to copy the index.html to 200.html in the build directory for surge to work.  
Also the redirect URI after API authorization had to be correct, in both the application utility  
and the API developer settings.  
I added "homepage": "." to the package.json so CRA knows the correct root path.  
  
It could use more functionality, so I will probably update it in the future.  
  