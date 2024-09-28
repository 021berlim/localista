document.getElementById('searchBtn').addEventListener('click', async () => {
    const address = document.getElementById('address').value;
    const category = document.getElementById('category').value;
    if (address) {
        const coordinates = await getCoordinates(address);
        if (coordinates) {
            const places = await getNearbyPlaces(coordinates.lat, coordinates.lon, 2000, category);
            await displayResults(places);
        } else {
            alert('Endereço não encontrado.');
        }
    } else {
        alert('Por favor, insira um endereço ou use a geolocalização.');
    }
});
document.getElementById('geoLocateBtn').addEventListener('click', async () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const category = document.getElementById('category').value;
            const places = await getNearbyPlaces(lat, lon, 2000, category);
            await displayResults(places);
        }, (error) => {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    alert('Usuário negou a solicitação de Geolocalização.');
                    break;
                case error.POSITION_UNAVAILABLE:
                    alert('Localização indisponível.');
                    break;
                case error.TIMEOUT:
                    alert('A solicitação para obter a localização do usuário expirou.');
                    break;
                case error.UNKNOWN_ERROR:
                    alert('Um erro desconhecido ocorreu.');
                    break;
            }
        });
    } else {
        alert('Geolocalização não é suportada pelo seu navegador.');
    }
});

async function getCoordinates(address) {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.length > 0) {
            return {
                lat: data[0].lat,
                lon: data[0].lon,
            };
        } else {
            return null;
        }
    } catch (error) {
        console.error('Erro ao buscar coordenadas:', error);
        return null;
    }
}

async function getNearbyPlaces(lat, lon, radius, category) {
    const categoryQuery = category ? `[amenity~'${category}', i]` : '[amenity]';
    const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];node(around:${radius},${lat},${lon})${categoryQuery};out;`;

    // console.log('Overpass URL:', overpassUrl);

    try {
        const response = await fetch(overpassUrl);
        const data = await response.json();
        // console.log('Dados retornados da API:', data.elements);
        
        return data.elements.filter(place => place.tags && place.tags.amenity);
    } catch (error) {
        console.error('Erro ao buscar locais:', error);
        return [];
    }
}


async function displayResults(places) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';
    if (places.length === 0) {
        alert('Nenhuma loja encontrada.');
        return;
    }
    for (const place of places) {
        const name = place.tags.name || 'Nome não disponível';
        const amenity = place.tags.amenity ? formatAmenity(place.tags.amenity) : 'Tipo não disponível';

        if (name === 'Nome não disponível') {
            continue;
        }

        const address = await formatAddress(place);
        
        resultDiv.innerHTML += `
            <p>
                <strong>
                    <a href="#" onclick="alert('${address}')">${name}</a>
                </strong> (${amenity})
            </p>`;
    }
}

async function formatAddress(place) {
    const { lat, lon } = place;
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.display_name || 'Endereço não disponível';
    } catch (error) {
        console.error('Erro ao buscar endereço:', error);
        return 'Endereço não disponível';
    }
}

function formatAmenity(amenity) {
    switch (amenity) {
        case 'cafe':
            return 'Café';
        case 'restaurant':
            return 'Restaurante';
        case 'bar':
            return 'Bar';
        case 'school':
            return 'Escola';
        case 'hospital':
            return 'Hospital';
        case 'pharmacy':
            return 'Farmácia';
        case 'supermarket':
            return 'Supermercado';
        case 'bank':
            return 'Banco';
        case 'parking':
            return 'Estacionamento';
        case 'post_office':
            return 'Correios';
        case 'gym':
            return 'Academia';
        case 'gas_station':
            return 'Posto de Gasolina';
        case 'park':
            return 'Parque';
        case 'library':
            return 'Biblioteca';
        case 'bus_station':
            return 'Estação de Ônibus';
        case 'atm':
            return 'Caixa Eletrônico';
        case 'fast_food':
            return 'Fast Food';
        case 'nightclub':
            return 'Clube Noturno';
        case 'shopping_mall':
            return 'Shopping Center';
        default:
            return 'Categoria desconhecida';
    }
}
