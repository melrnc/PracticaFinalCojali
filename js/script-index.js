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

async function getArtist(token) {
    const url = 'https://api.spotify.com/v1/artists/51yyeVxyvecgePAWXmeLUE';

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
        console.log('Get artist', data);
        return data;

    } catch (error) {
        console.error('Error al obtener el token:', error.message);
    }
}

async function initMethod(){ 
    getSpotifyToken().then(resultado => {
        getArtist(resultado).then(respuestaLlamadaArtist => {
            
            let nombreArtistaElement = document.getElementById("nombreArtista");
            nombreArtistaElement.innerHTML = respuestaLlamadaArtist.name;

            let tipoArtistaElement = document.getElementById("tipoArtista");
            tipoArtistaElement.innerHTML = respuestaLlamadaArtist.type;

            let generoArtistaElement = document.getElementById("generoArtista");
            generoArtistaElement.innerHTML = respuestaLlamadaArtist.genres;

            let popularidadArtistaElement = document.getElementById("popularidadArtista");
            popularidadArtistaElement.innerHTML = respuestaLlamadaArtist.popularity;

            let linkArtistaElement = document.getElementById("linkArtista");
            linkArtistaElement.href = respuestaLlamadaArtist.external_urls.spotify;

            let followersArtistaElement = document.getElementById("followers");
            followersArtistaElement.innerHTML = respuestaLlamadaArtist.followers.total;

            let imgagenPrincipalElement = document.getElementById("imagenPrincipal");
            imgagenPrincipalElement.src = respuestaLlamadaArtist.images[0].url;
        });
    });  
}

initMethod();
