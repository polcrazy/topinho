// Dados das lojas com coordenadas (latitude e longitude)
const stores = [
    { name: "Pernambucanas Barueri", address: "R. Campos Sales, 045 - Barueri - SP", category: "Barueri", status: "available", coords: { lat: -23.51862, lng: -46.87768 } },
    { name: "Pernambucanas Carapicuiba", address: "Av. Rui Barbosa, 447 - Carapicuiba - SP", category: "Carapicuiba", status: "available", coords: { lat: -23.52229, lng: -46.83611 } },
    { name: "Pernambucanas Cotia", address: "Av. Prof. Joaquim Barreto, 48 - Centro, Cotia - SP", category: "Cotia", status: "available", coords: { lat: -23.60098, lng: -46.91896 } },
    { name: "Pernambucanas Diadema", address: "Praça Pres. Castelo Branco, 55 - Centro, Diadema - SP", category: "ABC Paulista", status: "available", coords: { lat: -23.68417, lng: -46.61906 } },
    { name: "Pernambucanas Franco da Rocha", address: "R. Dr. Hamilton Prado, 50 - Franco da Rocha - SP", category: "Franco da Rocha", status: "available", coords: { lat: -23.31599, lng: -46.72659 } },
    { name: "Pernambucanas Guarulhos", address: "R. Dom Pedro Ii, 113 - Guarulhos - SP", category: "Guarulhos", status: "available", coords: { lat: -23.46513, lng: -46.53696 } },
    { name: "Pernambucanas Itaquaquecetuba", address: "R. Capitão José Leite, 103 - Itaquaquecetuba - SP", category: "Itaquaquecetuba", status: "available", coords: { lat: -23.47355, lng: -46.36441 } },
    { name: "Pernambucanas Mauá", address: "Av. Barão De Mauá, 74 - Mauá - SP", category: "ABC Paulista", status: "available", coords: { lat: -23.66699, lng: -46.46049 } },
    { name: "Pernambucanas Mogi das Cruzes", address: "R. Dr. Deodato Wertheimer, 1350 - Mogi das Cruzes - SP", category: "Mogi das Cruzes", status: "available", coords: { lat: -23.51733, lng: -46.18247 } },
    { name: "Pernambucanas Osasco", address: "R. Antonio Agu, 126 - Osasco - SP", category: "Osasco", status: "available", coords: { lat: -23.53509, lng: -46.78206 } },
    { name: "Pernambucanas Santo André", address: "R. Cel. Oliveira Lima, 392 - Centro, Santo André - SP", category: "ABC Paulista", status: "available", coords: { lat: -23.65584, lng: -46.52445 } },
    { name: "Pernambucanas São Bernardo do Campo", address: "R. Marechal Deodoro, 1374 - Centro, São Bernardo do Campo - SP", category: "ABC Paulista", status: "available", coords: { lat: -23.69805, lng: -46.56475 } },
    { name: "Pernambucanas Shopping Metrô Itaquera", address: "Av. Jose Pinheiro, 228 - Itaquera, São Paulo - SP", category: "Zona Leste", status: "available", coords: { lat: -23.54131, lng: -46.47167 } },
    // ... adicione as outras lojas com suas coordenadas (latitude e longitude) aqui
];

// Função para calcular a distância entre duas coordenadas (Fórmula de Haversine)
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Raio da Terra em metros
    const φ1 = lat1 * Math.PI/180; // φ, λ em radianos
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distância em metros
}

function findClosestStoreByGeolocation() {
    if ("geolocation" in navigator) {
        // Solicita a localização do usuário
        navigator.geolocation.getCurrentPosition(function(position) {
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;
            
            const storesWithDistance = stores.map(store => {
                const distance = getDistance(userLat, userLon, store.coords.lat, store.coords.lng);
                return { ...store, distance };
            });

            const availableStores = storesWithDistance.filter(store => store.status === 'available');

            availableStores.sort((a, b) => a.distance - b.distance);

            renderClosestStores(availableStores);
        }, function(error) {
            const resultDiv = document.getElementById('closestStoreResult');
            resultDiv.innerHTML = `<p>Não foi possível obter sua localização. Por favor, permita o acesso à geolocalização ou tente novamente.</p>`;
        });
    } else {
        const resultDiv = document.getElementById('closestStoreResult');
        resultDiv.innerHTML = `<p>Seu navegador não suporta a funcionalidade de geolocalização.</p>`;
    }
}

function renderClosestStores(closestStores) {
    const resultDiv = document.getElementById('closestStoreResult');
    resultDiv.innerHTML = '';
    
    if (closestStores.length === 0) {
        resultDiv.innerHTML = `<p>Nenhuma loja disponível encontrada nas proximidades.</p>`;
        return;
    }

    closestStores.forEach(store => {
        const distanceKm = (store.distance / 1000).toFixed(1).replace('.', ',');
        
        const listItem = document.createElement('li');
        const storeUrlName = encodeURIComponent(
            `${store.name}`
                .toLowerCase()
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
        );
        const reservaUrl = `https://vico158.gendo.app/app/reserve/schedule/${storeUrlName}`;

        listItem.innerHTML = `
            <a href="${reservaUrl}" target="_blank" class="address-link">
                <div class="address-link-content">
                    <strong>${store.name}</strong> - ${store.address}<br>
                    <small>Distância: ${distanceKm} km</small>
                </div>
                <span class="status available">Disponível</span>
            </a>
        `;
        resultDiv.appendChild(listItem);
    });
}
