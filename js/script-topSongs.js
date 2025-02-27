async function getSpotifyToken() {
    const clientId = 'a88483ba62924d0a83ef58a1b1e576c8';     // Reemplaza con tu Client ID
    const clientSecret = 'd5c4ec9b5ada44db8617ce32d33f2ec3'; // Reemplaza con tu Client Secret
    const url = 'https://accounts.spotify.com/api/token';

    // Convierte las credenciales a Base64
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

async function initMethod(){ //Este metodo sirve para obtener el token de spotify y almacena el resultado en "miParrafo" 
    getSpotifyToken().then(resultado => {
        getTopTracks(resultado).then(respuestaLlamadaArtistsTopTracks => {

            displayTopTracks(respuestaLlamadaArtistsTopTracks.tracks); //dentro del Array "tracks" están las canciones del artista

        });
    });  
}

function displayTopTracks(tracks) {
    const tracksContainer = document.getElementById('albums-container'); 
    tracksContainer.innerHTML = ''; // Limpia contenido anterior por si hubiera código de antes
 
    if (!tracks || tracks.length === 0) { // si "tracks" esta vacío o tiene una length = 0
        tracksContainer.innerHTML = '<p>No se encontraron canciones.</p>'; //mete ese mensaje
        return;
    }

    tracks.forEach(track => { //bucle de tracks, recorre cada registro de track y mete "div" por cada track 
        const trackElement = document.createElement('div'); //creación del div
        trackElement.classList.add('album-item'); 

        // La ` muestra lo que esté entre las dos `´, en este caso añadimos un elemento dinámico 
        let albumElementContent = '';
        albumElementContent += '<img src="' + track.album.images[0]?.url + '" alt="' + track.name + '"></img>';
        albumElementContent += '<h3>' + track.name + '</h3>';
        albumElementContent += '<a href="' + track.external_urls.spotify + '" target="_blank">Escuchar en Spotify</a>';
        trackElement.innerHTML = albumElementContent;

        tracksContainer.appendChild(trackElement);
    });
}

initMethod();