# Jammming  
## Playlist App With the Spotify API  
### Allows users to search the Spotify library, create a custom playlist, then save it to their Spotify account  
#### User must sign into Spotify through the App to use it  
  
This project is through Codecademy Front-End Engineer Career Path - React Part II.  
  
**UPDATE: I rewrote all the React components**  
They were originally created as class components, but I replaced them with function components.  
So, it now uses the State Hook to manage state and all classes, constructors with bindings and 'this' keywords were all removed. The methods were rewritten and ones that managed states with compound types were reformulated since useState() does not merge previous data.  
  
The original styling was a little off, so I re-did that as well.  
  
It does use Implicit Grant Flow upon authentication and access tokens issued are short-lived.  
*This is a recognized security flaw as it does not involve storing secret keys.*  
  
It is deployed with surge and available online at http://mccarterjams.surge.sh  
  
It could use more functionality, so I will probably update it in the future.  
  
