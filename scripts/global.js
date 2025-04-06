// === Konami Code Easter Egg ===
const konamiCode = [
    'ArrowUp', 'ArrowUp',
    'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight',
    'ArrowLeft', 'ArrowRight',
    'b', 'a'
];
let konamiIndex = 0;
let konamiTimeout = null;

document.addEventListener('keydown', (e) => {
    // Ne pas déclencher si l'utilisateur est dans un champ de saisie
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
    }
    
    const requiredKey = konamiCode[konamiIndex];
    
    // Convertir le nom de la touche en minuscule si ce n'est pas une flèche
    const keyPressed = (e.key.startsWith('Arrow')) ? e.key : e.key.toLowerCase();

    if (keyPressed === requiredKey) {
        konamiIndex++;

        // Réinitialise le timeout si une touche correcte est pressée
        clearTimeout(konamiTimeout);
        konamiTimeout = setTimeout(() => { konamiIndex = 0; }, 2000); // Reset après 2s d'inactivité

        if (konamiIndex === konamiCode.length) {
            // Code Konami réussi !
            document.body.classList.add('konami-active');
            console.log("Konami Code Activated!"); // Pour le débogage
            
            // Optionnel : jouer un son ici si désiré
            // const audio = new Audio('path/to/sound.mp3');
            // audio.play();

            // Désactiver l'effet après quelques secondes
            setTimeout(() => {
                document.body.classList.remove('konami-active');
                console.log("Konami Code Deactivated.");
            }, 5000); // Désactiver après 5 secondes
            
            konamiIndex = 0; // Réinitialiser pour pouvoir le refaire
            clearTimeout(konamiTimeout); // Nettoyer le timeout
        }
    } else {
        // Mauvaise touche, réinitialiser la séquence
        konamiIndex = 0;
        clearTimeout(konamiTimeout);
    }
});
// === Fin Konami Code === 

// === Coming Soon Easter Egg ===
const comingSoonTriggers = document.querySelectorAll('.coming-soon-trigger');
const clickThreshold = 5; // Nombre de clics requis
const clickTimeLimit = 700; // Temps max entre les clics (ms)
const tooltipMessages = [
    "Oui, oui, ça arrive ! Patience...",
    "On y travaille ! Promis, ça vaudra le coup 😉",
    "Presque là ! Encore un peu de patience.",
    "Chut... c'est en cours de préparation."
];

comingSoonTriggers.forEach(trigger => {
    let clickCount = 0;
    let firstClickTime = 0;

    trigger.addEventListener('click', () => {
        const now = Date.now();

        if (clickCount === 0 || (now - firstClickTime > clickTimeLimit)) {
            // Premier clic ou délai dépassé, réinitialiser
            clickCount = 1;
            firstClickTime = now;
        } else {
            clickCount++;
        }

        if (clickCount === clickThreshold) {
            // Easter egg déclenché !
            activateComingSoonEffect(trigger);
            // Réinitialiser immédiatement pour éviter redéclenchement
            clickCount = 0;
            firstClickTime = 0;
        }
    });
});

function activateComingSoonEffect(element) {
    // 1. Ajouter la classe shake
    element.classList.add('shake');

    // 2. Créer et afficher la tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'cs-tooltip';
    // Sélectionner un message aléatoire
    tooltip.textContent = tooltipMessages[Math.floor(Math.random() * tooltipMessages.length)];
    
    // Insérer la tooltip dans le DOM (à l'intérieur de l'élément déclencheur)
    element.appendChild(tooltip);
    
    // Forcer le reflow pour que la transition fonctionne
    void tooltip.offsetWidth; 
    
    // Ajouter la classe 'show' pour l'animation d'apparition
    tooltip.classList.add('show');

    // 3. Nettoyer après un délai
    setTimeout(() => {
        element.classList.remove('shake');
        tooltip.classList.remove('show');
        // Attendre la fin de la transition avant de supprimer l'élément
        setTimeout(() => {
             if (tooltip.parentNode === element) { // Vérifier si elle existe toujours
                 element.removeChild(tooltip);
             }
        }, 300); // 300ms correspond à la durée de la transition CSS
    }, 3000); // La tooltip et le shake restent visibles 3 secondes
}
// === Fin Coming Soon Easter Egg ===

// === Logo Animation Easter Egg ===
const logoElement = document.querySelector('.logo');
if (logoElement) {
    const logoClickThreshold = 4; // Nombre de clics requis
    const logoClickTimeLimit = 700; // Temps max entre les clics (ms)
    let logoClickCount = 0;
    let logoFirstClickTime = 0;

    logoElement.addEventListener('click', (e) => {
        e.preventDefault(); // Empêche le lien de fonctionner pendant le clic rapide
        const now = Date.now();

        if (logoClickCount === 0 || (now - logoFirstClickTime > logoClickTimeLimit)) {
            logoClickCount = 1;
            logoFirstClickTime = now;
        } else {
            logoClickCount++;
        }

        if (logoClickCount === logoClickThreshold) {
            // Easter egg déclenché !
            if (!logoElement.classList.contains('logo-animate')) {
                logoElement.classList.add('logo-animate');
                console.log("Logo Easter Egg Activated!");

                // Retirer la classe après l'animation (durée de l'animation: 0.6s)
                setTimeout(() => {
                    logoElement.classList.remove('logo-animate');
                    console.log("Logo Easter Egg Animation Finished.");
                }, 600);
            }
            
            // Réinitialiser
            logoClickCount = 0;
            logoFirstClickTime = 0;
        } else {
            // Si le nombre de clics n'est pas atteint mais que le délai n'est pas expiré,
            // nous voulons quand même permettre la navigation après un petit délai
            // si l'utilisateur ne fait qu'un seul clic (ou deux/trois lents).
            if (logoClickCount === 1) {
                setTimeout(() => {
                    // Si aucun autre clic n'est arrivé entre-temps, naviguer
                    if(logoClickCount === 1 && (Date.now() - logoFirstClickTime > 300)) { // Petit délai de 300ms
                        const link = logoElement.querySelector('a');
                        if (link && link.href) {
                           window.location.href = link.href; 
                        }
                    }
                }, 350); // Délai total un peu plus long que le délai de navigation
            }
        }
    });
}
// === Fin Logo Animation Easter Egg === 

// === Console Message Easter Egg ===
console.log("%cEh bien, curieux ? 😉 Bienvenue dans les coulisses de TEAMZ Horizon !", 
            "color: #ff4d4d; font-size: 14px; font-weight: bold; " + 
            "background-color: #1a1a1a; padding: 10px 15px; " + // Plus de padding
            "border-radius: 5px; border: 1px solid #444; " + // Bordure ajoutée
            "text-shadow: 1px 1px 2px rgba(0,0,0,0.5);" // Ombre portée ajoutée
           );
// === Fin Console Message Easter Egg === 

// === Matrix Easter Egg ===
let matrixAnimationId = null;
let matrixTimeoutId = null;
let isCtrlDown = false;
let isAltDown = false;
let keyFeedbackElement = null;
let keyFeedbackTimeout = null;
let goldenMSpan = null;
let matrixIntroContainer = null;
let matrixIntroTextElement = null;
let matrixCanvasElement = null;
let isMatrixIntroRunning = false;

// Fonction pour initialiser le M doré (appelée au chargement si sur index.html)
function initGoldenM() {
    if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
        const glitchTitle = document.querySelector('h1.glitch');
        if (glitchTitle && glitchTitle.textContent === 'TEAMZ') { // Vérifie le contenu pour éviter de le faire plusieurs fois
            glitchTitle.innerHTML = 'TEA<span class="golden-m">M</span>Z';
            goldenMSpan = glitchTitle.querySelector('.golden-m');
            console.log("Golden M initialized.");
        }
    }
}

// Initialiser au chargement du DOM
document.addEventListener('DOMContentLoaded', initGoldenM);

// Crée l'élément de feedback s'il n'existe pas
function ensureKeyFeedbackElement() {
    if (!keyFeedbackElement) {
        keyFeedbackElement = document.createElement('div');
        keyFeedbackElement.id = 'key-feedback';
        document.body.appendChild(keyFeedbackElement);
    }
}

// Affiche une touche et la fait disparaître
function showKeyFeedback(keyName) {
    ensureKeyFeedbackElement();
    keyFeedbackElement.textContent = keyName.toUpperCase();
    keyFeedbackElement.classList.add('show');
    
    clearTimeout(keyFeedbackTimeout);
    keyFeedbackTimeout = setTimeout(() => {
        keyFeedbackElement.classList.remove('show');
    }, 500); // Disparaît après 0.5s
}

document.addEventListener('keydown', (e) => {
    // Suivi des touches Ctrl et Alt
    if (e.key === 'Control') {
        if (!isCtrlDown) { 
            showKeyFeedback('CTRL');
            isCtrlDown = true;
            // Vérifier si Alt est déjà enfoncé pour activer le M doré
            if (isAltDown && goldenMSpan) {
                goldenMSpan.classList.add('golden-m-active');
            }
        }
        return;
    }
    if (e.key === 'Alt') {
        if (!isAltDown) { 
            showKeyFeedback('ALT');
            isAltDown = true;
            // Vérifier si Ctrl est déjà enfoncé pour activer le M doré
            if (isCtrlDown && goldenMSpan) {
                goldenMSpan.classList.add('golden-m-active');
            }
        }
        return;
    }

    // Détecter M *seulement si* Ctrl et Alt sont déjà enfoncées
    if (isCtrlDown && isAltDown && e.key.toLowerCase() === 'm') {
        e.preventDefault(); 
        // showKeyFeedback('M'); // Suppression de l'affichage du 'M'
        
        if (goldenMSpan) {
            goldenMSpan.classList.remove('golden-m-active');
        }

        // Éviter de lancer plusieurs fois si déjà actif
        if (document.body.classList.contains('matrix-intro-active') || 
            document.body.classList.contains('matrix-active') ||
            isMatrixIntroRunning) {
            return;
        }
        // Appeler la nouvelle fonction d'intro
        startMatrixIntroAnimation();
    }
});

// Réinitialiser les flags et le M doré quand Ctrl ou Alt sont relâchées
document.addEventListener('keyup', (e) => {
    if (e.key === 'Control') {
        isCtrlDown = false;
        if (goldenMSpan) {
            goldenMSpan.classList.remove('golden-m-active');
        }
    }
    if (e.key === 'Alt') {
        isAltDown = false;
        if (goldenMSpan) {
            goldenMSpan.classList.remove('golden-m-active');
        }
    }
});

function startMatrixIntroAnimation() {
    isMatrixIntroRunning = true;
    console.log("Matrix Intro Sequence Started!");

    // Créer les éléments si nécessaire
    if (!matrixIntroContainer) {
        matrixIntroContainer = document.createElement('div');
        matrixIntroContainer.id = 'matrix-intro-container';
        matrixIntroTextElement = document.createElement('div');
        matrixIntroTextElement.id = 'matrix-intro-text';
        matrixIntroContainer.appendChild(matrixIntroTextElement);
        document.body.appendChild(matrixIntroContainer);
    }

    // Afficher le conteneur d'intro
    document.body.classList.add('matrix-intro-active');
    matrixIntroTextElement.textContent = ''; // Vider le texte précédent
    matrixIntroTextElement.classList.remove('zoom-in'); // Assurer état initial

    const textToType = "MATRIX";
    let charIndex = 0;
    const typingSpeed = 150; // ms entre chaque lettre

    function typeChar() {
        if (charIndex < textToType.length) {
            matrixIntroTextElement.textContent += textToType[charIndex];
            charIndex++;
            setTimeout(typeChar, typingSpeed);
        } else {
            // Fin de la saisie
            setTimeout(triggerZoomAndMatrix, 500); // Pause avant le zoom
        }
    }

    typeChar(); // Commence la saisie
}

function triggerZoomAndMatrix() {
    console.log("Triggering Zoom and Matrix Rain");
    if (!matrixIntroTextElement) return;

    // 1. Démarrer la pluie Matrix en arrière-plan (elle sera révélée plus tard)
    activateMatrixEffect(); 

    // 2. Lancer l'animation de zoom sur le texte
    matrixIntroTextElement.classList.add('zoom-in');

    // 3. Après la durée de l'animation de zoom, cacher l'intro
    // La durée de la transition CSS est de 1s pour transform + 0.8s pour opacity
    // Prenons 1000ms comme référence
    setTimeout(() => {
        document.body.classList.remove('matrix-intro-active');
        isMatrixIntroRunning = false; 
        console.log("Matrix Intro Sequence Finished.");
    }, 1000); 
}

function activateMatrixEffect() {
    console.log("Matrix Rain Activated (in background initially)!");
    // Récupérer ou créer le canvas
    matrixCanvasElement = document.getElementById('matrix-canvas');
    if (!matrixCanvasElement) {
        matrixCanvasElement = document.createElement('canvas');
        matrixCanvasElement.id = 'matrix-canvas';
        document.body.appendChild(matrixCanvasElement);
    }

    const ctx = matrixCanvasElement.getContext('2d');
    matrixCanvasElement.width = window.innerWidth;
    matrixCanvasElement.height = window.innerHeight;

    // Afficher le canvas (il sera révélé quand l'intro disparaîtra)
    document.body.classList.add('matrix-active');

    const matrixChars = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン";
    const chars = matrixChars.split("");
    const fontSize = 16;
    const columns = Math.floor(matrixCanvasElement.width / fontSize);
    const drops = [];
    for (let x = 0; x < columns; x++) {
        drops[x] = 1;
    }

    function drawMatrix() {
        // Plus de fond semi-transparent ici, car géré par le conteneur d'intro
        // ctx.fillStyle = "rgba(0, 0, 0, 0.05)"; 
        // ctx.fillRect(0, 0, matrixCanvasElement.width, matrixCanvasElement.height);
        // MAIS il faut un clearRect pour effacer les anciens frames une fois l'intro partie!
        // On le conditionne : si l'intro n'est plus active, on clear avec un alpha faible.
        if (!document.body.classList.contains('matrix-intro-active')) {
             ctx.fillStyle = "rgba(0, 0, 0, 0.05)"; // Effet de trainée classique
             ctx.fillRect(0, 0, matrixCanvasElement.width, matrixCanvasElement.height);
        } else {
             // Pendant l'intro, on ne dessine que les lettres sans effacer
             // (le fond noir de l'intro fait office d'arrière plan)
             // On pourrait même ne pas dessiner du tout pendant l'intro et commencer seulement après?
             // Pour l'instant, on dessine quand même en arrière plan.
        }

        ctx.fillStyle = "#0F0";
        ctx.font = fontSize + "px monospace";

        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > matrixCanvasElement.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
        matrixAnimationId = requestAnimationFrame(drawMatrix);
    }

    if (matrixAnimationId) cancelAnimationFrame(matrixAnimationId);
    if (matrixTimeoutId) clearTimeout(matrixTimeoutId);
    
    drawMatrix();

    // L'intro dure environ: (6 lettres * 150ms) + 500ms pause + 1000ms zoom = ~2.4s
    // Gardons la pluie pour ~7s APRÈS la fin de l'intro.
    matrixTimeoutId = setTimeout(() => {
        // Arrêter le dessin
        if (matrixAnimationId) cancelAnimationFrame(matrixAnimationId);
        
        // Lancer le fondu
        if (matrixCanvasElement) {
            matrixCanvasElement.classList.add('fade-out');
        }
        
        console.log("Matrix Rain Fading Out...");
        
        // Cacher complètement après le fondu (500ms = durée de la transition CSS)
        setTimeout(() => {
             document.body.classList.remove('matrix-active'); // Cache le canvas via display: none
             // Retirer la classe fade-out pour la prochaine fois
             if (matrixCanvasElement) {
                 matrixCanvasElement.classList.remove('fade-out');
             }
             console.log("Matrix Rain Deactivated.");
             matrixAnimationId = null;
             matrixTimeoutId = null;
             // Peut-être supprimer le canvas ici ?
        }, 500); 

    }, 7000 + 1000); // 7s de pluie + 1s de zoom de l'intro
}

// Optionnel: redimensionner le canvas si la fenêtre change
// window.addEventListener('resize', () => {
//     const canvas = document.getElementById('matrix-canvas');
//     if (canvas && document.body.classList.contains('matrix-active')) {
//         // Relancer l'effet pourrait être le plus simple ici
//         if (matrixAnimationId) cancelAnimationFrame(matrixAnimationId);
//         if (matrixTimeoutId) clearTimeout(matrixTimeoutId);
//         activateMatrixEffect(); 
//     }
// });
// === Fin Matrix Easter Egg ===

// === Settings Button Hacking Glitch Easter Egg ===
const settingsButton = document.querySelector('.settings-btn');
if (settingsButton) {
    const settingsClickThreshold = 7; // Nombre de clics requis
    const settingsClickTimeLimit = 1000; // Temps max entre les clics (ms)
    let settingsClickCount = 0;
    let settingsFirstClickTime = 0;
    let isGlitching = false;

    // Texte aléatoire pour le glitch
    const glitchChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+=-[]{}|;:'\",./<>?";
    function getRandomGlitchText(length = 20) {
        let text = '';
        for (let i = 0; i < length; i++) {
            text += glitchChars[Math.floor(Math.random() * glitchChars.length)];
        }
        return text;
    }

    settingsButton.addEventListener('click', (e) => {
        // Ne pas interférer avec l'ouverture/fermeture normale du menu paramètres
        // L'ouverture se fait déjà dans un autre script, on se concentre sur le glitch ici
        if (isGlitching) return; // Ne pas relancer si déjà en cours

        const now = Date.now();

        if (settingsClickCount === 0 || (now - settingsFirstClickTime > settingsClickTimeLimit)) {
            settingsClickCount = 1;
            settingsFirstClickTime = now;
        } else {
            settingsClickCount++;
        }

        if (settingsClickCount === settingsClickThreshold) {
            // Easter egg déclenché !
            isGlitching = true;
            console.log("Settings Button Glitch Activated!");

            // Générer un texte glitch aléatoire et l'appliquer
            settingsButton.setAttribute('data-glitch-text', getRandomGlitchText());
            settingsButton.classList.add('hacking-glitch-active');

            // Retirer la classe après 1 seconde
            setTimeout(() => {
                settingsButton.classList.remove('hacking-glitch-active');
                isGlitching = false;
                console.log("Settings Button Glitch Deactivated.");
            }, 1000); // Durée du glitch
            
            // Réinitialiser
            settingsClickCount = 0;
            settingsFirstClickTime = 0;
        }
    });
}
// === Fin Settings Button Hacking Glitch Easter Egg === 

// === Stranger Things Upside Down Easter Egg ===
const upsideDownTrigger = document.getElementById('upside-down-trigger');
if (upsideDownTrigger) {
    let isUpsideDownActive = false;
    const sporeCount = 50; 
    let currentSpores = [];
    let upsideDownIntroElement = null;
    let upsideDownTimeoutId = null;

    upsideDownTrigger.addEventListener('click', () => {
        if (document.documentElement.getAttribute('data-theme') !== 'light') {
            console.log("The Upside Down only opens in the light...");
            return; 
        }
        if (isUpsideDownActive) return; 
        
        startUpsideDownIntro();
    });

    function startUpsideDownIntro() {
        isUpsideDownActive = true; // Marquer comme actif pour éviter relance
        console.log("Upside Down Intro Sequence Started!");

        // Créer l'overlay d'intro si nécessaire
        if (!upsideDownIntroElement) {
            upsideDownIntroElement = document.createElement('div');
            upsideDownIntroElement.id = 'upside-down-intro';
            document.body.appendChild(upsideDownIntroElement);
        }

        // Activer les animations CSS d'intro
        upsideDownTrigger.classList.add('intro-active');
        upsideDownIntroElement.classList.add('show');

        // Jouer un son (à décommenter et adapter si vous avez un fichier audio)
        // try {
        //     const audio = new Audio('path/to/stranger-things-sound.mp3');
        //     audio.play();
        // } catch (err) {
        //     console.error("Could not play sound:", err);
        // }

        // Durée de l'intro (correspond à l'animation intro-pulse-fade)
        const introDuration = 3000; 

        // Arrêter l'animation du trigger un peu avant la fin de l'overlay
        setTimeout(() => {
             upsideDownTrigger.classList.remove('intro-active');
        }, introDuration - 500); 

        // Après l'intro, passer à l'effet Upside Down principal
        // Déclencher *pendant* le fade out de l'intro (qui commence à 90% des 3000ms)
        const activationDelay = introDuration * 0.9; // = 2700ms
        
        upsideDownTimeoutId = setTimeout(() => {
            console.log("Switching to Upside Down effect (during intro fade-out)...");
            
            document.body.classList.add('upside-down-active');

            // Créer les spores maintenant
            currentSpores = []; // S'assurer que c'est vide
            for (let i = 0; i < sporeCount; i++) {
                const spore = document.createElement('div');
                spore.className = 'spore';
                spore.style.left = `${Math.random() * 100}vw`;
                spore.style.top = `${Math.random() * 100}vh`;
                spore.style.animationDelay = `${Math.random() * 3}s, ${Math.random() * 0.5}s`; 
                spore.style.animationDuration = `${3 + Math.random() * 4}s, 1s`; 
                document.body.appendChild(spore);
                currentSpores.push(spore);
            }

            // Arrêter l'effet Upside Down après 7 secondes supplémentaires
            upsideDownTimeoutId = setTimeout(() => {
                document.body.classList.remove('upside-down-active');
                currentSpores.forEach(spore => spore.remove());
                currentSpores = []; 
                isUpsideDownActive = false;
                console.log("Upside Down Easter Egg Deactivated.");
                
                // Rafraîchir la page
                location.reload();

            }, 7000); // Durée de l'effet principal

        }, activationDelay); // Déclencher après 2.7s
    }
}
// === Fin Stranger Things Upside Down Easter Egg === 