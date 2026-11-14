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