document.getElementById('generatePlan').addEventListener('click', function () {
    const ftp = parseInt(document.getElementById('ftp').value);
    const objectif = document.getElementById('objectif').value;
    const experience = document.getElementById('experience').value;
    const race = document.getElementById('race').value;
    const daysPerWeek = parseInt(document.getElementById('daysPerWeek').value);
    const weeks = parseInt(document.getElementById('weeks').value);

    if (isNaN(ftp) || !objectif || !experience || isNaN(daysPerWeek) || isNaN(weeks)) {
        alert("Veuillez remplir tous les champs !");
        return;
    }

    const resultTable = document.getElementById('resultTable');
    const tips = document.getElementById('tips');
    const trainingChart = document.getElementById('trainingChart').getContext('2d');

    resultTable.innerHTML = '';
    tips.innerHTML = '';

    // Paramètres dynamiques en fonction de l'objectif
    let intensitéBase, volumeBase, récupération;
    switch (objectif) {
        case "endurance":
            intensitéBase = 0.6 * ftp;
            volumeBase = 12;
            récupération = 0.7;
            break;
        case "puissance":
            intensitéBase = 0.8 * ftp;
            volumeBase = 8;
            récupération = 0.8;
            break;
        default:
            intensitéBase = 0.7 * ftp;
            volumeBase = 10;
            récupération = 0.75;
    }

    if (experience === "débutant") {
        volumeBase *= 0.7;
        récupération += 0.1;
    } else if (experience === "expert") {
        volumeBase *= 1.2;
        récupération -= 0.1;
    }

    // Initialisation des variables pour le plan d'entraînement
    const plan = [];
    const charge = [];
    let totalCharge = 0;

    // Génération dynamique des semaines et des journées
    for (let week = 1; week <= weeks; week++) {
        for (let jour = 1; jour <= daysPerWeek; jour++) {
            let intensité, durée, type, dénivelé;

            // Ajout d'un facteur de variabilité aléatoire raisonnable
            const randomFactorIntensité = 1 + (Math.random() * 0.1 - 0.05);  // Variabilité de -5% à +5%
            const randomFactorDurée = 1 + (Math.random() * 0.1 - 0.05);    // Variabilité de -5% à +5%
            const randomFactorDénivelé = 1 + (Math.random() * 0.1 - 0.05);  // Variabilité de -5% à +5%

            if (jour % 3 === 0) {
                type = "Séance Clé";
                intensité = (intensitéBase * 1.3 * randomFactorIntensité).toFixed(1);
                durée = (volumeBase / 6 * randomFactorDurée).toFixed(1);
                dénivelé = Math.floor(intensité * 0.4 * randomFactorDénivelé);
            } else if (jour === daysPerWeek) {
                type = "Récupération active";
                intensité = (intensitéBase * récupération * randomFactorIntensité).toFixed(1);
                durée = 1 * randomFactorDurée;
                dénivelé = 200;
            } else {
                type = "Endurance";
                intensité = (intensitéBase * randomFactorIntensité).toFixed(1);
                durée = (volumeBase / 5 * randomFactorDurée).toFixed(1);
                dénivelé = Math.floor(intensité * 0.3 * randomFactorDénivelé);
            }

            // Calcul de la charge d'entraînement
            const chargeJour = Math.round(durée * intensité);
            totalCharge += chargeJour;

            plan.push({
                semaine: `Semaine ${week}`,
                jour: `Jour ${jour}`,
                type: type,
                intensité: `${intensité} W`,
                durée: `${durée} h`,
                dénivelé: `${dénivelé} m`,
                charge: chargeJour
            });

            charge.push(chargeJour);
        }
    }

    // Remplissage du tableau des résultats
    resultTable.innerHTML = `
        <thead>
            <tr>
                <th>Semaine</th>
                <th>Jour</th>
                <th>Type</th>
                <th>Intensité</th>
                <th>Durée</th>
                <th>Dénivelé</th>
                <th>Charge</th>
            </tr>
        </thead>
        <tbody>
            ${plan.map(p => `
                <tr>
                    <td>${p.semaine}</td>
                    <td>${p.jour}</td>
                    <td>${p.type}</td>
                    <td>${p.intensité}</td>
                    <td>${p.durée}</td>
                    <td>${p.dénivelé}</td>
                    <td>${p.charge}</td>
                </tr>
            `).join('')}
        </tbody>
    `;

    // Graphique dynamique des charges d'entraînement
    new Chart(trainingChart, {
        type: 'bar',
        data: {
            labels: plan.map(p => `${p.semaine} - ${p.jour}`),
            datasets: [{
                label: 'Charge d\'entraînement',
                data: charge,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true }
            }
        }
    });

    // Conseils personnalisés
    tips.innerHTML = `
        <strong>Charge Totale :</strong> ${totalCharge} TSS<br>
        <strong>Conseil :</strong> N'oubliez pas d'inclure des périodes de récupération pour éviter le surentraînement.
    `;
});
