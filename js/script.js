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

async function getArtist(token) {
    const url = 'https://api.spotify.com/v1/artists/1va3Zo4O6kJSYZ40c8D0Ag';

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

async function initMethod(){ //Este metodo sirve para obtener el token de spotify y almacena el resultado en "miParrafo" 
    getSpotifyToken().then(resultado => {
        getArtist(resultado).then(respuestaLlamadaArtist => {
            
            let titulopagina = document.getElementById("nombreArtista");
            titulopagina.innerHTML = respuestaLlamadaArtist.name;

            let popularidad = document.getElementById("popularidadArtista");
            popularidad.innerHTML = respuestaLlamadaArtist.popularity;

            let linkartista = document.getElementById("linkArtista");
            linkartista.href = respuestaLlamadaArtist.external_urls.spotify;

            let followersartista = document.getElementById("followers");
            followersartista.innerHTML = respuestaLlamadaArtist.followers.total;

            let imgagenPrincipal = document.getElementById("imagenPrincipal");
            imgagenPrincipal.src = respuestaLlamadaArtist.images[0].url;
        });
    });  
}

initMethod();
