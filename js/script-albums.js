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

async function getArtistsAlbums(token) {
    const url = 'https://api.spotify.com/v1/artists/51yyeVxyvecgePAWXmeLUE/albums';

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
        console.log('Get artists albums', data); 
        return data;

    } catch (error) {
        console.error('Error al obtener el token:', error.message);
    }
}

async function initMethod(){ 
    getSpotifyToken().then(resultado => {
        getArtistsAlbums(resultado).then(respuestaLlamadaArtistsAlbums => {

            displayAlbums(respuestaLlamadaArtistsAlbums.items); 

        });
    });  
}

function displayAlbums(albums) {
    const albumsContainer = document.getElementById('albums-container'); 
    albumsContainer.innerHTML = ''; 
 
    if (!albums || albums.length === 0) {
        albumsContainer.innerHTML = '<p>No se encontraron álbumes.</p>'; 
        return;
    }

    albums.forEach(album => { 
        const albumElement = document.createElement('div'); 
        albumElement.classList.add('album-item'); 

        let albumElementContent = '';
        albumElementContent += '<img src="' + album.images[0]?.url + '" alt="' + album.name + '"></img>';
        albumElementContent += '<h3>' + album.name + '</h3>';
        albumElementContent += '<p><strong> Fecha de lanzamiento: </strong>' + album.release_date + '</p>'
        albumElementContent += '<a href="' + album.external_urls.spotify + '" target="_blank">Escuchar en Spotify</a>';
        albumElement.innerHTML = albumElementContent;

        albumsContainer.appendChild(albumElement);
    });
}

initMethod();