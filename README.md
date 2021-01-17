# skatein.space

Immersive visualizations for your Spotify songs.

## Inspiration
I like my music, and have always wanted an eye-catching and interactive story to go along with it. 

## What it does
skatein.space looks at your Spotify listening history to find some of your top tracks, then determines which tracks are the most "skate-able", based on characteristics of the track. Then you can choose which song to "skate" to. Upon choosing a song, it plays through the browser alongside a "skate map" generated from the structure of the track.

## How I built it
I used Next.js (React framework) to set up my page structure along with some serverless functions that communicate with the Spotify Web API for authentication and retrieving user and track information. With endpoints of this API such as getting the Audio Features for several tracks, and Audio Analysis for a specific track, I was able to get information such as the tempo (BPM), loudness, and timestamps of different sections/segments/bars/beats. 

I used this information to generate a heightmap that relies on when each section of the song starts/ends. I used wrappers for Three.js (JS library to use WebGL to render web graphics) in React to render this heightmap, along with a skateboard onto a canvas.

I integrated the Spotify Web SDK in order to stream the track through the browser (premium only) and get the player state, which includes the current position of the track. I then linked the position of the track to the camera+skateboard position, which results in the user travelling across the heightmap.

I used SCSS and TypeScript to make my life a bit easier with styling the pages and organizing the different types of data and components I used.

I used Domain.com for the cool domain name, and Vercel to deploy it from my GitHub repo.

## Challenges I ran into
* I tried to use libraries that were not very well-documented (e.g. use-cannon), and as a result I lost a lot of time and was not able to implement things like the physics I wanted to implement for the skateboard.
* This was my first time working with many of these packages, APIs, libraries (Spotify, Three.js, etc.), as well as technologies in general (graphics, physics), so I spent a lot of time tweaking things, not always getting the desired outcome

## Accomplishments that I'm proud of
* I like to think I took a huge risk in investing my weekend into a project of this direction (which I don't have any experience), and I'm happy that I could produce something tangible
* I'm getting close to creating something visually that I've only been able to imagine!

## What I learned
* Basics of rendering (heavy/3D) graphics within the web browser, working with buffer geometries
* How to work with the tools Spotify gives for developers
* More struggles of coding (sometimes there's no documentation for a package and you have to dive into its source code and hope you find something)
* My API endpoints currently struggle with returning the skate maps for songs that aren't short, so I've learned the limitations of free hosting and also the need to streamline response data

## What's next for skatein.space
* A more interactive experience (powered by physics), where the skateboard is controlled by mouse movement
* Better skate maps (different colours, more variety in shapes)
* Ability to choose entire playlists, search songs to skate to
* More details, like stars in space
* Support for Spotify free users, different music streaming platforms
* Open to suggestions!
