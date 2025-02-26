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

async function getArtistsAlbums(token) {
    const url = 'https://api.spotify.com/v1/artists/1va3Zo4O6kJSYZ40c8D0Ag/albums';

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

async function initMethod(){ //Este metodo sirve para obtener el token de spotify y almacena el resultado en "miParrafo" 
    getSpotifyToken().then(resultado => {
        getArtistsAlbums(resultado).then(respuestaLlamadaArtist => {

            displayAlbums(respuestaLlamadaArtist.items); //dentro del Array "items" están todos los singles, albums y ep del artista

        });
    });  
}

function displayAlbums(albums) {
    const albumsContainer = document.getElementById('albums-container'); 
    albumsContainer.innerHTML = ''; // Limpia contenido anterior por si hubiera código de antes
 
    if (!albums || albums.length === 0) { // si "albums" es vacío o tiene una length = 0
        albumsContainer.innerHTML = '<p>No se encontraron álbumes.</p>'; //mete ese mensaje
        return;
    }

    albums.forEach(album => { //bucle de albums, recorre cada registro de album y mete "div" por cada album 
        const albumElement = document.createElement('div'); //creación del div
        albumElement.classList.add('album-item'); 

        // La ` muestra lo que esté entre las dos `´, en este caso añadimos un elemento dinámico 
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