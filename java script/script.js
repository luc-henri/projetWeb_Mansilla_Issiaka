const btnNexus = document.getElementById("btn-nexus");
const btnPrune = document.getElementById("btn-prune");
const badge = document.getElementById("status-badge");
const log = document.getElementById("monitor-log");
const branchText = document.getElementById("branch-text");

let nexusActive = false;
let pruneReady = false;

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