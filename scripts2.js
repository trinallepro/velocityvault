// scripts.js

// Initialisation de la carte Leaflet
const map = L.map("map").setView([48.8566, 2.3522], 13); // Coordonnées par défaut (Paris)

// Ajout d'un fond de carte OpenStreetMap
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Gestionnaire pour afficher un résumé des performances
const performanceSummary = document.getElementById("performanceSummary");

// Fonction pour charger et afficher le GPX sur la carte
function displayGPX(file) {
    const reader = new FileReader();

    reader.onload = function (event) {
        const gpxData = event.target.result;

        // Utilisation de Leaflet GPX pour charger et analyser le fichier GPX
        const gpxLayer = new L.GPX(gpxData, {
            async: true,
            marker_options: {
                startIconUrl: 'https://unpkg.com/leaflet-gpx/images/pin-icon-start.png',
                endIconUrl: 'https://unpkg.com/leaflet-gpx/images/pin-icon-end.png',
                shadowUrl: 'https://unpkg.com/leaflet-gpx/images/pin-shadow.png'
            }
        })
            .on("loaded", function (e) {
                // Zoom automatique sur le tracé
                map.fitBounds(e.target.getBounds());

                // Extraction des statistiques
                const totalDistance = e.target.get_distance(); // Distance totale en mètres
                const totalElevation = e.target.get_elevation_gain(); // Dénivelé positif en mètres

                // Affichage des statistiques
                performanceSummary.innerHTML = `
                    <h4>Résumé de la performance</h4>
                    <p><strong>Distance totale :</strong> ${(totalDistance / 1000).toFixed(2)} km</p>
                    <p><strong>Dénivelé positif :</strong> ${totalElevation.toFixed(2)} m</p>
                `;
            })
            .addTo(map);
    };

    reader.readAsText(file);
}

// Gestionnaire d'événement pour l'importation de fichier GPX
document.getElementById("gpxFile").addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith(".gpx")) {
        displayGPX(file);
    } else {
        alert("Veuillez sélectionner un fichier GPX valide.");
    }
});
