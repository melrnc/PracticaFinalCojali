async function getSpotifyToken() {
    const clientId = 'a88483ba62924d0a83ef58a1b1e576c8';     
    const clientSecret = 'd5c4ec9b5ada44db8617ce32d33f2ec3'; 
    const url = 'https://accounts.spotify.com/api/token';

    const credentials = btoa(`${clientId}:${clientSecret}`);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${credentials}`
            },
            body: 'grant_type=client_credentials'
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Token:', data.access_token);
        return data.access_token;

    } catch (error) {
        console.error('Error al obtener el token:', error.message);
    }
}

async function getTopTracks(token) {
    const url = 'https://api.spotify.com/v1/artists/51yyeVxyvecgePAWXmeLUE/top-tracks';

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Get top tracks', data); 
        return data;

    } catch (error) {
        console.error('Error al obtener el token:', error.message);
    }
}

async function initMethod(){ 
    getSpotifyToken().then(resultado => {
        getTopTracks(resultado).then(respuestaLlamadaArtistsTopTracks => {

            displayTopTracks(respuestaLlamadaArtistsTopTracks.tracks); 

        });
    });  
}

function displayTopTracks(tracks) {
    const tracksContainer = document.getElementById('albums-container'); 
    tracksContainer.innerHTML = ''; 
 
    if (!tracks || tracks.length === 0) { 
        tracksContainer.innerHTML = '<p>No se encontraron canciones.</p>'; 
        return;
    }

    tracks.forEach(track => { 
        const trackElement = document.createElement('div'); 
        trackElement.classList.add('album-item'); 

        let albumElementContent = '';
        albumElementContent += '<img src="' + track.album.images[0]?.url + '" alt="' + track.name + '"></img>';
        albumElementContent += '<h3>' + track.name + '</h3>';
        albumElementContent += '<a href="' + track.external_urls.spotify + '" target="_blank">Escuchar en Spotify</a>';
        trackElement.innerHTML = albumElementContent;

        tracksContainer.appendChild(trackElement);
    });
}

initMethod();