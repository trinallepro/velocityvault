// scripts.js

// Récupérer le formulaire et les éléments du graphique
const performanceForm = document.getElementById("performanceForm");
const distanceInput = document.getElementById("distance");
const timeInput = document.getElementById("time");
const speedInput = document.getElementById("speed");
const elevationInput = document.getElementById("elevation");
const ctx = document.getElementById("performanceChart").getContext("2d");
const performanceSummary = document.getElementById("performanceSummary");

// Tableau pour stocker les performances
let performances = [];

// Initialisation du graphique
const performanceChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Vitesse (km/h)',
            data: [],
            borderColor: 'rgba(75, 192, 192, 1)',
            fill: false,
            tension: 0.1
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Vitesse (km/h)'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Date/Performance'
                }
            }
        }
    }
});

// Fonction pour calculer la vitesse moyenne
const calculateAverageSpeed = (distance, time) => {
    const timeParts = time.split(":");
    const totalTimeInHours = parseInt(timeParts[0]) + parseInt(timeParts[1]) / 60 + parseInt(timeParts[2]) / 3600;
    return (distance / totalTimeInHours).toFixed(2);
};

// Fonction pour ajouter une performance et mettre à jour le graphique
const addPerformance = (distance, time, speed, elevation) => {
    const date = new Date().toLocaleString();
    const performance = { date, distance, time, speed, elevation };
    performances.push(performance);

    // Calculer la vitesse moyenne
    const avgSpeed = calculateAverageSpeed(distance, time);

    // Mettre à jour le résumé de la performance
    performanceSummary.innerHTML = `
        <h4>Résumé de la performance</h4>
        <p><strong>Vitesse moyenne calculée:</strong> ${avgSpeed} km/h</p>
        <p><strong>Dénivelé total:</strong> ${elevation} mètres</p>
    `;

    // Ajouter les données au graphique
    performanceChart.data.labels.push(date);
    performanceChart.data.datasets[0].data.push(speed);
    performanceChart.update();
};

// Événement de soumission du formulaire
performanceForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const distance = parseFloat(distanceInput.value);
    const time = timeInput.value;
    const speed = parseFloat(speedInput.value);
    const elevation = parseFloat(elevationInput.value);

    if (isNaN(distance) || isNaN(speed) || isNaN(elevation) || time.trim() === "") {
        alert("Veuillez entrer des données valides.");
        return;
    }

    // Ajouter la performance au graphique
    addPerformance(distance, time, speed, elevation);

    // Réinitialiser le formulaire
    distanceInput.value = "";
    timeInput.value = "";
    speedInput.value = "";
    elevationInput.value = "";
});
