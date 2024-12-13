// Fonction pour générer un programme d'entraînement
function generateTrainingPlan() {
    const goalDistance = parseFloat(document.getElementById("trainingGoalDistance").value);
    const goalElevation = parseFloat(document.getElementById("trainingGoalElevation").value);
    const goalTime = parseFloat(document.getElementById("trainingGoalTime").value);

    if (isNaN(goalDistance) || isNaN(goalElevation) || isNaN(goalTime)) {
        alert("Veuillez entrer des objectifs valides.");
        return;
    }

    // Données de base pour l'entraînement
    const weeks = 4; // Durée du programme en semaines
    const baseDistance = goalDistance * 0.5; // Distance de départ
    const baseElevation = goalElevation * 0.5; // Dénivelé de départ
    const increment = 0.2; // Augmentation hebdomadaire (20%)

    let trainingPlan = "<h4>Votre Programme d'Entraînement :</h4><ol>";

    for (let week = 1; week <= weeks; week++) {
        const weekDistance = Math.round(baseDistance + baseDistance * increment * (week - 1));
        const weekElevation = Math.round(baseElevation + baseElevation * increment * (week - 1));
        const weekIntensity = Math.round(goalTime / weeks + 5 * week); // Augmentation progressive du temps

        trainingPlan += `
            <li>
                <strong>Semaine ${week} :</strong>
                <ul>
                    <li>Distance : ${weekDistance} km</li>
                    <li>Dénivelé : ${weekElevation} m</li>
                    <li>Temps d'entraînement total : ${weekIntensity} minutes</li>
                </ul>
            </li>
        `;
    }

    trainingPlan += "</ol>";

    // Afficher le plan d'entraînement
    document.getElementById("trainingPlan").innerHTML = trainingPlan;
}

// Ajouter l'écouteur d'événements
document.getElementById("generateTrainingPlan").addEventListener("click", generateTrainingPlan);
