/*
   1. SIMULATEUR FLUX TEMPOREL (Page Principale uniquement)
 */
const btnNexus = document.getElementById("btn-nexus");
const btnPrune = document.getElementById("btn-prune");
const badge = document.getElementById("status-badge");
const log = document.getElementById("monitor-log");
const branchText = document.getElementById("branch-text");

let nexusActive = false;
let pruneReady = false;


if (btnNexus && btnPrune && badge && log && branchText) {
    btnNexus.addEventListener("click", () => {
        if (nexusActive === false) {
            nexusActive = true;
            pruneReady = false;

            badge.textContent = "ALERTE NEXUS";
            log.textContent = "> Anomalie détectée ! Branche divergente en cours...";
            branchText.textContent = "/---";

            setTimeout(() => {
                branchText.textContent = "/-------";
            }, 500);

            setTimeout(() => {
                branchText.textContent = "/------------ [ALERTE LIGNE ROUGE]";
                pruneReady = true;
                log.textContent = "> Minuteurs en position. Prêt pour la réinitialisation.";
            }, 1500);
        }
    });

    btnPrune.addEventListener("click", () => {
        if (pruneReady === true) {
            pruneReady = false;

            badge.textContent = "BROUILLAGE...";
            log.textContent = "> Charge activée. Effacement de la branche...";
            branchText.textContent = "/------- [EFFACEMENT...]";

            setTimeout(() => {
                branchText.textContent = "/---";
            }, 600);

            setTimeout(() => {
                branchText.textContent = "";
                badge.textContent = "STABLE";
                log.textContent = "> Chronologie Sacrée restaurée.";
                nexusActive = false;
            }, 1200);
        }
    });
}

/* 
   2. CARROUSEL (Page d'Accueil uniquement)
 */
document.addEventListener("DOMContentLoaded", () => {
    try {
        const carousel = document.querySelector(".carousel");
        if (!carousel) {
            return;
        }

        const slides = carousel.querySelectorAll(".carousel-slide");
        const btnPrecedent = carousel.querySelector(".carousel-btn.prev");
        const btnSuivant = carousel.querySelector(".carousel-btn.next");
        const indicateurs = carousel.querySelectorAll(".indicator");

        let indexActuel = 0;
        let intervalleAuto = null;

        function afficherSlide(nouvelIndex) {
            if (slides.length === 0) return;

            if (nouvelIndex >= slides.length) {
                indexActuel = 0;
            } else if (nouvelIndex < 0) {
                indexActuel = slides.length - 1;
            } else {
                indexActuel = nouvelIndex;
            }

            slides.forEach((slide) => slide.classList.remove("active"));
            indicateurs.forEach((point) => point.classList.remove("active"));

            slides[indexActuel].classList.add("active");
            if (indicateurs[indexActuel]) {
                indicateurs[indexActuel].classList.add("active");
            }
        }

        function slideSuivante() {
            afficherSlide(indexActuel + 1);
        }

        function slidePrecedente() {
            afficherSlide(indexActuel - 1);
        }

        function demarrerDefilementAuto() {
            arreterDefilementAuto();
            intervalleAuto = setInterval(slideSuivante, 5000);
        }

        function arreterDefilementAuto() {
            if (intervalleAuto !== null) {
                clearInterval(intervalleAuto);
            }
        }

        if (btnSuivant) {
            btnSuivant.addEventListener("click", () => {
                slideSuivante();
                demarrerDefilementAuto();
            });
        }

        if (btnPrecedent) {
            btnPrecedent.addEventListener("click", () => {
                slidePrecedente();
                demarrerDefilementAuto();
            });
        }

        indicateurs.forEach((point, index) => {
            point.addEventListener("click", () => {
                afficherSlide(index);
                demarrerDefilementAuto();
            });
        });

        carousel.addEventListener("mouseenter", arreterDefilementAuto);
        carousel.addEventListener("mouseleave", demarrerDefilementAuto);

        afficherSlide(0);
        demarrerDefilementAuto();

    } catch (erreur) {
        console.error("Erreur lors de l'initialisation du carrousel TVA :", erreur);
    }
});

/* 
   3. ENVOI DU FORMULAIRE PAR E-MAIL (Page Signaler un Variant)
   */
document.addEventListener("DOMContentLoaded", () => {
    try {
        const formulaire = document.getElementById("signalement-form");
        const zoneConfirmation = document.getElementById("confirmation-message");

        // Sécurité : si on n'est pas sur signaler_variant.html, on quitte sans erreur
        if (!formulaire) {
            return;
        }

        formulaire.addEventListener("submit", (event) => {
            // Empêche le rechargement par défaut de la page
            event.preventDefault();

            // Adresse e-mail qui recevra le rapport (à remplacer par la vôtre)
            const emailDestinataire = "rapporttva@gmail.com";

            // Récupération des champs obligatoires
            const variantId = document.getElementById("variant-id").value.trim();
            const epoque = document.getElementById("epoque").value.trim();
            const localisation = document.getElementById("localisation").value.trim();
            const description = document.getElementById("description").value.trim();

            // Récupération facultative des champs d'agent s'ils sont présents dans le HTML
            const champAgent = document.getElementById("agent-id");
            const champUnite = document.getElementById("agent-unite");
            const agentId = champAgent ? champAgent.value.trim() : "Agent non spécifié";
            const agentUnite = champUnite ? champUnite.value : "Brigade des Minuteurs";

            // Récupération du bouton radio coché pour le niveau de menace
            const radioMenace = formulaire.querySelector('input[name="menace"]:checked');
            const niveauMenace = radioMenace ? radioMenace.value.toUpperCase() : "FAIBLE";

            // Vérification de sécurité contre les champs remplis uniquement d'espaces
            if (!variantId || !epoque || !localisation || !description) {
                alert("Erreur TVA : Veuillez remplir tous les champs obligatoires avant transmission.");
                return;
            }

            // Construction de l'objet et du corps de l'e-mail
            const sujet = `[ALERTE NEXUS - ${niveauMenace}] Signalement du Variant : ${variantId}`;
            const corpsMessage =
                `RAPPORT D'ANOMALIE SPATIO-TEMPORELLE — TVA\n` +
                `==================================================\n` +
                `Agent rapporteur : ${agentId} (${agentUnite})\n` +
                `Variant identifié : ${variantId}\n` +
                `Époque / Année : ${epoque}\n` +
                `Localisation : ${localisation}\n` +
                `Niveau de menace Nexus : ${niveauMenace}\n` +
                `==================================================\n\n` +
                `Description de l'événement :\n${description}\n\n` +
                `-- Pour l'Éternité. À Jamais. --`;

            // Encodage des caractères spéciaux (accents, retours à la ligne) pour l'URL mailto
            const lienMailto =
                `mailto:${emailDestinataire}` +
                `?subject=${encodeURIComponent(sujet)}` +
                `&body=${encodeURIComponent(corpsMessage)}`;

            // Affichage d'une confirmation visuelle dans la page
            if (zoneConfirmation) {
                zoneConfirmation.classList.remove("hidden-message");
                zoneConfirmation.style.display = "block";
                zoneConfirmation.style.backgroundColor = "#2e7d32";
                zoneConfirmation.style.color = "#ffffff";
                zoneConfirmation.style.border = "2px solid #2b1d14";
                zoneConfirmation.innerHTML =
                    `<strong>RAPPORT VALIDÉ :</strong> Transmission prête pour le Variant <em>${variantId}</em> ` +
                    `(Menace : ${niveauMenace}). Ouverture de votre messagerie vers <strong>${emailDestinataire}</strong>...`;
            }

            // Ouverture du client mail pré-rempli
            window.location.href = lienMailto;
        });

    } catch (erreur) {
        console.error("Erreur lors du traitement du formulaire TVA :", erreur);
    }
});