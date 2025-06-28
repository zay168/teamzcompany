@@ -1,1415 +1,479 @@
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
// ===== CONFIGURATION GLOBALE =====
const CONFIG = {
    matrix: {
        chars: 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        fontSize: 14,
        minSpeed: 0.5,
        maxSpeed: 3,
        trailLength: 15,
        glowIntensity: 0.8,
        flickerChance: 0.02,
        fadeSpeed: 0.05
    },
    strangerThings: {
        flickerDuration: 3000,
        glitchIntensity: 0.3,
        redTint: 0.8
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
};

// Crée l'élément de feedback s'il n'existe pas
function ensureKeyFeedbackElement() {
    if (!keyFeedbackElement) {
        keyFeedbackElement = document.createElement('div');
        keyFeedbackElement.id = 'key-feedback';
        document.body.appendChild(keyFeedbackElement);
// ===== ANIMATION MATRIX CINÉMATOGRAPHIQUE =====
class CinematicMatrixEffect {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.columns = [];
        this.animationId = null;
        this.isActive = false;
        this.glitchMode = false;
        this.time = 0;
        
        this.init();
    }

    init() {
        this.createCanvas();
        this.setupColumns();
        this.bindEvents();
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'matrix-canvas';
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: -1;
            pointer-events: none;
            opacity: 0;
            transition: opacity 1s ease-in-out;
            background: radial-gradient(ellipse at center, rgba(0,20,0,0.9) 0%, rgba(0,0,0,0.95) 100%);
        `;
        
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        
        document.body.appendChild(this.canvas);
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
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.setupColumns();
    }

    // Détecter M *seulement si* Ctrl et Alt sont déjà enfoncées
    if (isCtrlDown && isAltDown && e.key.toLowerCase() === 'm') {
        e.preventDefault(); 
        // showKeyFeedback('M'); // Suppression de l'affichage du 'M'
    setupColumns() {
        const columnCount = Math.floor(this.canvas.width / CONFIG.matrix.fontSize);
        this.columns = [];

        if (goldenMSpan) {
            goldenMSpan.classList.remove('golden-m-active');
        for (let i = 0; i < columnCount; i++) {
            this.columns.push({
                x: i * CONFIG.matrix.fontSize,
                y: Math.random() * this.canvas.height,
                speed: CONFIG.matrix.minSpeed + Math.random() * (CONFIG.matrix.maxSpeed - CONFIG.matrix.minSpeed),
                chars: [],
                lastUpdate: 0,
                intensity: Math.random(),
                phase: Math.random() * Math.PI * 2,
                glitchOffset: 0
            });
        }
    }

        // Éviter de lancer plusieurs fois si déjà actif
        if (document.body.classList.contains('matrix-intro-active') || 
            document.body.classList.contains('matrix-active') ||
            isMatrixIntroRunning) {
            return;
        }
        // Appeler la nouvelle fonction d'intro
        startMatrixIntroAnimation();
    generateChar() {
        return CONFIG.matrix.chars[Math.floor(Math.random() * CONFIG.matrix.chars.length)];
    }
});

// Réinitialiser les flags et le M doré quand Ctrl ou Alt sont relâchées
document.addEventListener('keyup', (e) => {
    if (e.key === 'Control') {
        isCtrlDown = false;
        if (goldenMSpan) {
            goldenMSpan.classList.remove('golden-m-active');
    updateColumn(column, deltaTime) {
        column.y += column.speed * deltaTime * 60;
        column.phase += 0.02;
        
        // Effet de glitch en mode Stranger Things
        if (this.glitchMode) {
            column.glitchOffset = (Math.random() - 0.5) * 10 * CONFIG.strangerThings.glitchIntensity;
        }
    }
    if (e.key === 'Alt') {
        isAltDown = false;
        if (goldenMSpan) {
            goldenMSpan.classList.remove('golden-m-active');
        
        // Réinitialiser la colonne si elle sort de l'écran
        if (column.y > this.canvas.height + CONFIG.matrix.trailLength * CONFIG.matrix.fontSize) {
            column.y = -CONFIG.matrix.trailLength * CONFIG.matrix.fontSize;
            column.speed = CONFIG.matrix.minSpeed + Math.random() * (CONFIG.matrix.maxSpeed - CONFIG.matrix.minSpeed);
            column.intensity = Math.random();
            column.chars = [];
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
        
        // Générer de nouveaux caractères
        if (Math.random() < 0.1) {
            column.chars.unshift(this.generateChar());
            if (column.chars.length > CONFIG.matrix.trailLength) {
                column.chars.pop();
            }
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
    const speeds = []; // Vitesse de chute pour chaque colonne
    const delays = []; // Délai avant que chaque colonne ne commence à tomber

    for (let x = 0; x < columns; x++) {
        drops[x] = 1; // Position y initiale
        speeds[x] = Math.random() * 0.5 + 0.2; // Vitesse entre 0.2 et 0.7
        delays[x] = Math.random() * 200; // Délai jusqu'à 200 frames
    }

    function drawMatrix() {
        // Plus de fond semi-transparent ici, car géré par le conteneur d'intro
        // ctx.fillStyle = "rgba(0, 0, 0, 0.05)"; 
        // ctx.fillRect(0, 0, matrixCanvasElement.width, matrixCanvasElement.height);
        // MAIS il faut un clearRect pour effacer les anciens frames une fois l'intro partie!
        // On le conditionne : si l'intro n'est plus active, on clear avec un alpha plus faible pour une trainée plus longue.
        if (!document.body.classList.contains('matrix-intro-active')) {
             ctx.fillStyle = "rgba(0, 0, 0, 0.04)"; // Effet de trainée un peu plus long
             ctx.fillRect(0, 0, matrixCanvasElement.width, matrixCanvasElement.height);
        } else {
             // Pendant l'intro, on ne dessine que les lettres sans effacer
             // (le fond noir de l'intro fait office d'arrière plan)
             // On pourrait même ne pas dessiner du tout pendant l'intro et commencer seulement après?
             // Pour l'instant, on dessine quand même en arrière plan.
        }

        // ctx.fillStyle = "#0F0"; // L'ancienne couleur fixe
        ctx.font = fontSize + "px monospace";

        for (let i = 0; i < drops.length; i++) {
            if (delays[i] > 0) {
                delays[i]--;
                continue; // Attend que le délai soit écoulé
    drawColumn(column) {
        const baseX = column.x + column.glitchOffset;
        
        for (let i = 0; i < column.chars.length; i++) {
            const char = column.chars[i];
            const y = column.y - i * CONFIG.matrix.fontSize;
            
            if (y < -CONFIG.matrix.fontSize || y > this.canvas.height + CONFIG.matrix.fontSize) continue;
            
            // Calcul de l'opacité avec effet de traînée
            let alpha = (1 - i / CONFIG.matrix.trailLength) * column.intensity;
            
            // Effet de scintillement
            if (Math.random() < CONFIG.matrix.flickerChance) {
                alpha *= 0.3;
            }

            const text = chars[Math.floor(Math.random() * chars.length)];

            // Le premier caractère de la goutte est plus brillant
            if (drops[i] * fontSize < fontSize * 2) { // Si c'est le "premier" caractère visible
                ctx.fillStyle = "#6F6"; // Vert plus clair
            // Effet de pulsation basé sur le temps
            const pulse = Math.sin(this.time * 0.01 + column.phase) * 0.2 + 0.8;
            alpha *= pulse;
            
            // Couleurs différentes selon le mode
            let color;
            if (this.glitchMode) {
                // Mode Stranger Things - rouge inquiétant
                const redIntensity = CONFIG.strangerThings.redTint * alpha;
                color = `rgba(${Math.floor(255 * redIntensity)}, ${Math.floor(50 * alpha)}, ${Math.floor(50 * alpha)}, ${alpha})`;
            } else {
                ctx.fillStyle = "#0F0"; // Vert standard
                // Mode Matrix classique - vert électrique
                const greenIntensity = Math.floor(255 * alpha);
                color = `rgba(0, ${greenIntensity}, ${Math.floor(greenIntensity * 0.7)}, ${alpha})`;
            }
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            // Si la goutte a atteint le bas de l'écran
            if (drops[i] * fontSize > matrixCanvasElement.height && Math.random() > 0.975) { // Le Math.random() ici contrôle la probabilité de redémarrer
                drops[i] = 0; // Réinitialise en haut
                speeds[i] = Math.random() * 0.5 + 0.2; // Nouvelle vitesse aléatoire pour cette colonne
                delays[i] = Math.random() * 150 + 50; // Nouveau délai aléatoire (50-200 frames) avant que cette colonne ne redémarre
            
            // Effet de lueur pour le premier caractère
            if (i === 0) {
                this.ctx.shadowBlur = CONFIG.matrix.glowIntensity * 20;
                this.ctx.shadowColor = this.glitchMode ? '#ff0000' : '#00ff00';
            } else {
                this.ctx.shadowBlur = CONFIG.matrix.glowIntensity * 5;
            }
            
            this.ctx.fillStyle = color;
            this.ctx.font = `${CONFIG.matrix.fontSize}px 'Courier New', monospace`;
            this.ctx.textAlign = 'center';
            
            // Effet de distorsion pour le mode glitch
            if (this.glitchMode && Math.random() < 0.1) {
                this.ctx.save();
                this.ctx.scale(1 + Math.random() * 0.2, 1);
                this.ctx.fillText(char, baseX + Math.random() * 4 - 2, y);
                this.ctx.restore();
            } else {
                this.ctx.fillText(char, baseX, y);
            }
            drops[i] += speeds[i]; // Incrémente la position y avec sa vitesse propre
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
    animate(currentTime) {
        if (!this.isActive) return;

        // Lancer le fondu
        if (matrixCanvasElement) {
            matrixCanvasElement.classList.add('fade-out');
        }
        const deltaTime = (currentTime - this.time) / 1000;
        this.time = currentTime;

        console.log("Matrix Rain Fading Out...");
        // Effet de fade cinématographique
        this.ctx.fillStyle = this.glitchMode 
            ? 'rgba(10, 0, 0, 0.1)' 
            : 'rgba(0, 5, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

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
        // Mise à jour et rendu des colonnes
        this.columns.forEach(column => {
            this.updateColumn(column, deltaTime);
            this.drawColumn(column);
        });
        
        // Effet de scanlines cinématographiques
        this.drawScanlines();
        
        this.animationId = requestAnimationFrame((time) => this.animate(time));
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
    drawScanlines() {
        const scanlineCount = Math.floor(this.canvas.height / 4);
        this.ctx.globalCompositeOperation = 'overlay';

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
        for (let i = 0; i < scanlineCount; i++) {
            const y = i * 4;
            const opacity = 0.02 + Math.sin(this.time * 0.001 + i * 0.1) * 0.01;
            
            this.ctx.fillStyle = this.glitchMode 
                ? `rgba(255, 0, 0, ${opacity})` 
                : `rgba(0, 255, 0, ${opacity})`;
            this.ctx.fillRect(0, y, this.canvas.width, 1);
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
        this.ctx.globalCompositeOperation = 'source-over';
    }
}
// === Fin Stranger Things Upside Down Easter Egg === 

// === Simulated CLI Easter Egg ===
let cliContainer = null;
let cliOutput = null;
let cliInput = null;
let isCliActive = false;
const cliHistory = [];
let cliHistoryIndex = -1;

document.addEventListener('keydown', (e) => {
    // Détecter Ctrl + Alt + T
    if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 't') {
        e.preventDefault(); 
        toggleCli();
    }
    // Gérer flèche haut/bas dans l'input pour l'historique
    if (isCliActive && document.activeElement === cliInput) {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            navigateCliHistory(1); // 1 pour monter (plus ancien)
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            navigateCliHistory(-1); // -1 pour descendre (plus récent)
        }
    start(glitchMode = false) {
        this.glitchMode = glitchMode;
        this.isActive = true;
        this.canvas.style.opacity = '1';
        this.time = performance.now();
        this.animate(this.time);
    }
});

function toggleCli() {
    if (!cliContainer) {
        createCliInterface();
    }
    
    if (isCliActive) {
        document.body.classList.remove('cli-active');
        isCliActive = false;
    } else {
        document.body.classList.add('cli-active');
        isCliActive = true;
        cliInput.focus();
        if (cliOutput.children.length === 0) { // Affiche le message de bienvenue si vide
            displayCliMessage("Bienvenue dans le terminal TEAMZ Horizon.\nTapez 'help' pour la liste des commandes.");
    stop() {
        this.isActive = false;
        this.canvas.style.opacity = '0';
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
}

function createCliInterface() {
    cliContainer = document.createElement('div');
    cliContainer.id = 'cli-container';
    
    cliOutput = document.createElement('div');
    cliOutput.id = 'cli-output';
    
    const cliInputLine = document.createElement('div');
    cliInputLine.id = 'cli-input-line';
    
    const cliPrompt = document.createElement('span');
    cliPrompt.id = 'cli-prompt';
    cliPrompt.textContent = 'TZH >';
    
    cliInput = document.createElement('input');
    cliInput.id = 'cli-input';
    cliInput.type = 'text';
    cliInput.setAttribute('spellcheck', 'false');
    
    cliInputLine.appendChild(cliPrompt);
    cliInputLine.appendChild(cliInput);
    
    cliContainer.appendChild(cliOutput);
    cliContainer.appendChild(cliInputLine);
    
    document.body.appendChild(cliContainer);
    
    // Gérer la saisie (Entrée)
    cliInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && cliInput.value.trim() !== '') {
            const command = cliInput.value.trim();
            cliInput.value = '';
            processCliCommand(command);
        }
    });
}

function processCliCommand(command) {
    // Ajoute la commande à l'historique
    displayCliMessage(`<span class="cli-prompt-color">TZH ></span> ${command}`);
    if (command.toLowerCase() !== cliHistory[cliHistory.length - 1]?.toLowerCase()) {
        cliHistory.push(command);
    toggleGlitchMode(enabled) {
        this.glitchMode = enabled;
    }
    cliHistoryIndex = -1; // Réinitialise l'index d'historique

    const parts = command.toLowerCase().split(' ');
    const cmd = parts[0];
    const arg = parts[1];
}

    switch (cmd) {
        case 'help':
            displayCliMessage(
`Commandes disponibles :
  help          - Affiche cette aide
  nav <page>    - Navigue vers une page (home, about, shop)
  clear         - Efface l'écran du terminal
  eastereggs    - Liste les easter eggs connus
  konami        - Active le code Konami
  matrix        - Active l'effet Matrix
  upside        - Active l'effet Upside Down (thème clair requis)
  snake         - Lance le jeu Snake
  retro         - Active/désactive le mode rétro
  exit          - Ferme le terminal`
            );
            break;
        case 'nav':
            if (!arg) {
                displayCliMessage("Usage: nav <page> (home, about, shop)", 'cli-error');
            } else {
                navigateToPage(arg);
// ===== EASTER EGG STRANGER THINGS =====
class StrangerThingsEasterEgg {
    constructor() {
        this.isActive = false;
        this.originalBodyFilter = '';
        this.flickerInterval = null;
        this.matrixEffect = null;
        
        this.init();
    }

    init() {
        this.createTrigger();
        this.matrixEffect = new CinematicMatrixEffect();
    }

    createTrigger() {
        const trigger = document.getElementById('upside-down-trigger');
        if (!trigger) return;

        trigger.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 30px;
            height: 30px;
            background: linear-gradient(45deg, #ff0000, #8b0000);
            border-radius: 50%;
            cursor: pointer;
            z-index: 1000;
            opacity: 0.3;
            transition: all 0.3s ease;
            box-shadow: 0 0 20px rgba(255, 0, 0, 0.5);
            animation: pulse 2s infinite;
        `;

        // Animation CSS pour le trigger
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0%, 100% { transform: scale(1); opacity: 0.3; }
                50% { transform: scale(1.1); opacity: 0.7; }
            }
            break;
        case 'clear':
            cliOutput.innerHTML = '';
            break;
        case 'exit':
            toggleCli();
            break;
        case 'eastereggs':
            displayCliMessage(
`Easter Eggs connus :
 - Code Konami (↑↑↓↓←→←→BA)
 - Accès Admin (Triple clic sur la citation dans 'À Propos')
 - Impatience Bientôt Dispo (Multi-clic sur 'Bientôt disponible')
 - Logo Animé (Multi-clic sur le logo)
 - Message Console (Ouvrez la console Dev)
 - Effet Matrix (Ctrl+Alt+M)
 - Glitch Paramètres (Multi-clic sur ⚙️)
 - Snake Game (Tapez S-N-A-K-E sur votre clavier)
 - Mode Rétro (Tapez R-E-T-R-O sur votre clavier)
 - Upside Down (Cliquez sur la faille en thème clair)`
            ); 
            break;
        case 'konami':
            document.body.classList.add('konami-active');
            displayCliMessage("Code Konami activé !");
            setTimeout(() => document.body.classList.remove('konami-active'), 5000);
            break;
        case 'matrix':
             if (!document.body.classList.contains('matrix-intro-active') && 
                 !document.body.classList.contains('matrix-active') && 
                 !isMatrixIntroRunning) {
                 startMatrixIntroAnimation();
                 displayCliMessage("Séquence Matrix initiée...");
             } else {
                 displayCliMessage("Effet Matrix déjà en cours.", "cli-error");
             }
            break;
         case 'upside':
             if (document.documentElement.getAttribute('data-theme') === 'light') {
                 if (!isUpsideDownActive) {
                     startUpsideDownIntro();
                     displayCliMessage("Ouverture de la faille...");
                 } else {
                     displayCliMessage("L'Upside Down est déjà actif.", "cli-error");
                 }
             } else {
                 displayCliMessage("La faille ne s'ouvre qu'en thème clair.", "cli-error");
             }
            break;
        case 'retro':
            displayCliMessage(isRetroModeActive ? 
                "Désactivation du mode rétro..." : 
                "Activation du mode rétro..."
            );
            setTimeout(toggleRetroMode, 500);
            break;
        case 'snake':
            displayCliMessage("Lancement du jeu Snake...");
            // Correction: ne lance le jeu que lorsque la commande est validée par Enter
            if (!isSnakeGameActive) {
                setTimeout(() => {
                    initSnakeGame();
                }, 500);
            } else {
                displayCliMessage("Le jeu Snake est déjà actif.", "cli-error");
            
            #upside-down-trigger:hover {
                opacity: 1 !important;
                transform: scale(1.2);
                box-shadow: 0 0 30px rgba(255, 0, 0, 0.8);
            }
            break;
        default:
            displayCliMessage(`Commande inconnue: ${cmd}`, 'cli-error');
            break;
    }
}
        `;
        document.head.appendChild(style);

function navigateToPage(page) {
    let url;
    switch (page) {
        case 'home': url = 'index.html'; break;
        case 'about': url = 'about.html'; break;
        case 'shop': url = 'shop.html'; break;
        default:
            displayCliMessage(`Page inconnue: ${page}`, 'cli-error');
            return;
        trigger.addEventListener('click', () => this.activate());
    }
    displayCliMessage(`Navigation vers ${page}...`);
    // Petite pause avant la redirection pour voir le message
    setTimeout(() => { window.location.href = url; }, 500);
}

function displayCliMessage(message, className = '') {
    const messageElement = document.createElement('div');
    if (className) {
        messageElement.classList.add(className);
    }
    messageElement.innerHTML = message; // Utilise innerHTML pour interpréter les spans
    cliOutput.appendChild(messageElement);
    // Fait défiler vers le bas automatiquement
    cliOutput.scrollTop = cliOutput.scrollHeight;
}

function navigateCliHistory(direction) {
    const newIndex = cliHistoryIndex + direction;
    
    // Si on monte (direction 1) et qu'on est au bout de l'historique
    if (direction === 1 && newIndex >= cliHistory.length) return;
    // Si on descend (direction -1) et qu'on est revenu au début (ou avant)
    if (direction === -1 && newIndex < -1) return;
    
    cliHistoryIndex = newIndex;
    
    if (cliHistoryIndex === -1) {
        // Si on est revenu à -1 (en descendant), on efface le champ
        cliInput.value = '';
    } else {
        cliInput.value = cliHistory[cliHistory.length - 1 - cliHistoryIndex];
        // Déplacer le curseur à la fin
        setTimeout(() => cliInput.selectionStart = cliInput.selectionEnd = cliInput.value.length, 0);
    }
}
// === Fin Simulated CLI Easter Egg === 

// === Snake Game Easter Egg ===
let snakeGameContainer = null;
let snakeCanvas = null;
let snakeContext = null;
let snakeKeysPressed = [];
const snakeKeySequence = ['s', 'n', 'a', 'k', 'e'];
let isSnakeGameActive = false;
let snakeGameInterval = null;

// Variables du jeu
let snake = [];
let food = {};
let direction = 'right';
let nextDirection = 'right';
let gridSize = 20; // Taille de chaque cellule
let gridWidth, gridHeight;
let score = 0;
let gameSpeed = 150; // Millisecondes entre chaque mise à jour

// Ajouter une variable pour indiquer l'attente de redémarrage
let isWaitingForRestart = false;

// Modifier la gestion des touches dans l'écouteur principal pour inclure le cas du redémarrage
document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    
    // Ne pas déclencher la séquence Snake si l'utilisateur est dans un champ de saisie
    // comme le terminal CLI ou tout autre input/textarea
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        // Gérer uniquement le cas où l'input est déjà dans le jeu (redémarrage)
        if (isSnakeGameActive && isWaitingForRestart && (e.key === ' ' || e.code === 'Space')) {
            isWaitingForRestart = false;
            resetSnakeGame();
            snakeGameInterval = setInterval(updateSnakeGame, gameSpeed);
        }
        return; // Ne pas continuer le traitement pour la séquence S-N-A-K-E
    }
    
    // Gérer le redémarrage du jeu si on est en attente après Game Over
    if (isSnakeGameActive && isWaitingForRestart && (e.key === ' ' || e.code === 'Space')) {
        isWaitingForRestart = false;
        resetSnakeGame();
        snakeGameInterval = setInterval(updateSnakeGame, gameSpeed);
        return;
    }
    
    // Ajouter la touche à la séquence et ne garder que les 5 dernières
    snakeKeysPressed.push(key);
    if (snakeKeysPressed.length > 5) {
        snakeKeysPressed.shift();
    }
    
    // Vérifier si la séquence complète est entrée (toutes les 5 lettres dans l'ordre)
    const sequenceMatched = snakeKeysPressed.length === 5 && 
                            snakeKeysPressed.every((k, i) => k === snakeKeySequence[i]);
    
    if (sequenceMatched && !isSnakeGameActive) {
        initSnakeGame();
    }
    
    // Contrôler le serpent quand le jeu est actif (et pas en attente de redémarrage)
    if (isSnakeGameActive && !isWaitingForRestart) {
        controlSnake(e.key);
    }
});

function initSnakeGame() {
    // Créer le conteneur du jeu s'il n'existe pas déjà
    if (!snakeGameContainer) {
        createSnakeGameInterface();
    }
    
    // Initialiser ou réinitialiser le jeu
    resetSnakeGame();
    
    // Afficher le jeu
    snakeGameContainer.classList.add('active');
    isSnakeGameActive = true;
    
    // Démarrer la boucle de jeu
    snakeGameInterval = setInterval(updateSnakeGame, gameSpeed);
}

function createSnakeGameInterface() {
    // Créer le conteneur principal
    snakeGameContainer = document.createElement('div');
    snakeGameContainer.id = 'snake-game-container';
    
    // Créer la modal
    const modal = document.createElement('div');
    modal.className = 'snake-game-modal';
    
    // Créer l'en-tête
    const header = document.createElement('div');
    header.className = 'snake-game-header';
    
    const title = document.createElement('h3');
    title.className = 'snake-game-title';
    title.textContent = 'TEAMZ SNAKE';
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'snake-game-close';
    closeBtn.textContent = '×';
    closeBtn.addEventListener('click', closeSnakeGame);
    
    header.appendChild(title);
    header.appendChild(closeBtn);
    
    // Créer le contenu
    const content = document.createElement('div');
    content.className = 'snake-game-content';
    
    snakeCanvas = document.createElement('canvas');
    snakeCanvas.id = 'snake-canvas';
    snakeCanvas.width = 400;
    snakeCanvas.height = 400;
    
    const info = document.createElement('div');
    info.className = 'snake-game-info';
    
    const scoreDiv = document.createElement('div');
    scoreDiv.className = 'snake-game-score';
    scoreDiv.textContent = 'Score: 0';
    
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'snake-game-controls';
    controlsDiv.textContent = 'Utilisez les flèches pour jouer';
    
    info.appendChild(scoreDiv);
    info.appendChild(controlsDiv);
    
    content.appendChild(snakeCanvas);
    content.appendChild(info);
    
    // Assembler les éléments
    modal.appendChild(header);
    modal.appendChild(content);
    snakeGameContainer.appendChild(modal);
    
    // Ajouter à la page
    document.body.appendChild(snakeGameContainer);
    
    // Initialiser le contexte de dessin
    snakeContext = snakeCanvas.getContext('2d');
    
    // Calculer la taille de la grille
    gridWidth = Math.floor(snakeCanvas.width / gridSize);
    gridHeight = Math.floor(snakeCanvas.height / gridSize);
}

function resetSnakeGame() {
    // Réinitialiser les variables du jeu
    snake = [
        {x: 5, y: Math.floor(gridHeight / 2)},
        {x: 4, y: Math.floor(gridHeight / 2)},
        {x: 3, y: Math.floor(gridHeight / 2)}
    ];
    
    generateFood();
    
    direction = 'right';
    nextDirection = 'right';
    score = 0;
    
    // Mise à jour du score affiché
    const scoreDiv = document.querySelector('.snake-game-score');
    if (scoreDiv) {
        scoreDiv.textContent = `Score: ${score}`;
    }
}

function generateFood() {
    // Générer de la nourriture à une position aléatoire
    let newFood;
    let foodOnSnake;
    
    do {
        newFood = {
            x: Math.floor(Math.random() * gridWidth),
            y: Math.floor(Math.random() * gridHeight)
        };
    activate() {
        if (this.isActive) return;

        // Vérifier si la nourriture est sur le serpent
        foodOnSnake = snake.some(segment => 
            segment.x === newFood.x && segment.y === newFood.y
        );
    } while (foodOnSnake);
    
    food = newFood;
}

function controlSnake(key) {
    // Changer la direction en fonction des touches
    switch (key) {
        case 'ArrowUp':
            if (direction !== 'down') nextDirection = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') nextDirection = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') nextDirection = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') nextDirection = 'right';
            break;
        case 'Escape':
            closeSnakeGame();
            break;
    }
}

function updateSnakeGame() {
    // Mettre à jour la direction
    direction = nextDirection;
    
    // Calculer la nouvelle position de la tête
    const head = {x: snake[0].x, y: snake[0].y};
    
    switch (direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }
    
    // Vérifier la collision avec les bords
    if (head.x < 0 || head.x >= gridWidth || head.y < 0 || head.y >= gridHeight) {
        gameOver();
        return;
    }
    
    // Vérifier la collision avec le serpent lui-même
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }
    
    // Ajouter la nouvelle tête
    snake.unshift(head);
    
    // Vérifier si le serpent a mangé la nourriture
    if (head.x === food.x && head.y === food.y) {
        // Augmenter le score
        score += 10;
        this.isActive = true;
        this.originalBodyFilter = document.body.style.filter;

        // Mise à jour de l'affichage du score
        const scoreDiv = document.querySelector('.snake-game-score');
        if (scoreDiv) {
            scoreDiv.textContent = `Score: ${score}`;
        }
        // Démarrer l'effet Matrix en mode glitch
        this.matrixEffect.start(true);

        // Générer une nouvelle nourriture
        generateFood();
        // Effet de scintillement de l'écran
        this.startFlicker();

        // Accélérer légèrement le jeu tous les 50 points
        if (score % 50 === 0 && gameSpeed > 60) {
            gameSpeed -= 10;
            clearInterval(snakeGameInterval);
            snakeGameInterval = setInterval(updateSnakeGame, gameSpeed);
        }
    } else {
        // Si pas de nourriture mangée, retirer la queue
        snake.pop();
        // Arrêter automatiquement après la durée configurée
        setTimeout(() => this.deactivate(), CONFIG.strangerThings.flickerDuration);
    }
    
    // Dessiner le jeu
    drawSnakeGame();
}

function drawSnakeGame() {
    // Effacer le canvas
    snakeContext.clearRect(0, 0, snakeCanvas.width, snakeCanvas.height);
    
    // Dessiner la grille (optionnel)
    snakeContext.strokeStyle = '#2a2a40';
    for (let x = 0; x < gridWidth; x++) {
        for (let y = 0; y < gridHeight; y++) {
            snakeContext.strokeRect(x * gridSize, y * gridSize, gridSize, gridSize);
        }
    }
    
    // Dessiner la nourriture avec un effet brillant
    snakeContext.fillStyle = '#ff00ff';
    snakeContext.shadowBlur = 10;
    snakeContext.shadowColor = '#ff00ff';
    snakeContext.beginPath();
    snakeContext.arc(
        (food.x * gridSize) + (gridSize / 2),
        (food.y * gridSize) + (gridSize / 2),
        gridSize / 2,
        0,
        Math.PI * 2
    );
    snakeContext.fill();
    
    // Réinitialiser l'effet de lueur
    snakeContext.shadowBlur = 0;
    
    // Dessiner le serpent
    snake.forEach((segment, index) => {
        // Dégradé de couleur pour le corps du serpent (cyan → bleu)
        const hue = 180 + (index * 2);
        snakeContext.fillStyle = `hsl(${hue}, 100%, 50%)`;
    startFlicker() {
        let flickerCount = 0;
        const maxFlickers = 15;

        // Tête légèrement plus grande
        if (index === 0) {
            snakeContext.shadowBlur = 15;
            snakeContext.shadowColor = '#00ffff';
            snakeContext.fillRect(
                segment.x * gridSize,
                segment.y * gridSize,
                gridSize,
                gridSize
            );
            snakeContext.shadowBlur = 0;
        } else {
            snakeContext.fillRect(
                segment.x * gridSize,
                segment.y * gridSize,
                gridSize,
                gridSize
            );
        }
    });
}

function gameOver() {
    clearInterval(snakeGameInterval);
    
    // Afficher "Game Over"
    snakeContext.fillStyle = 'rgba(0, 0, 0, 0.7)';
    snakeContext.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);
    
    snakeContext.font = 'bold 24px "Courier New", monospace';
    snakeContext.textAlign = 'center';
    snakeContext.fillStyle = '#ff00ff';
    snakeContext.shadowBlur = 10;
    snakeContext.shadowColor = '#00ffff';
    snakeContext.fillText('GAME OVER', snakeCanvas.width / 2, snakeCanvas.height / 2 - 10);
    
    snakeContext.font = '16px "Courier New", monospace';
    snakeContext.fillStyle = '#ffffff';
    snakeContext.shadowBlur = 0;
    snakeContext.fillText(`Score: ${score}`, snakeCanvas.width / 2, snakeCanvas.height / 2 + 30);
    snakeContext.fillText('Appuyez sur ESPACE pour rejouer', snakeCanvas.width / 2, snakeCanvas.height / 2 + 60);
    
    // Marquer le jeu comme prêt pour un redémarrage plutôt que d'utiliser un écouteur spécifique
    // Cela évite les conflits avec les autres écouteurs keydown globaux
    isWaitingForRestart = true;
}

function closeSnakeGame() {
    // Arrêter le jeu
    clearInterval(snakeGameInterval);
    snakeGameInterval = null;
    
    // Cacher le jeu
    if (snakeGameContainer) {
        snakeGameContainer.classList.remove('active');
        this.flickerInterval = setInterval(() => {
            if (flickerCount >= maxFlickers) {
                this.stopFlicker();
                return;
            }
            
            const intensity = Math.random() * CONFIG.strangerThings.redTint;
            const filters = [
                `hue-rotate(${Math.random() * 60 - 30}deg)`,
                `contrast(${1 + Math.random() * 0.5})`,
                `brightness(${0.8 + Math.random() * 0.4})`,
                `saturate(${1 + intensity})`,
                `sepia(${intensity * 0.5})`
            ];
            
            document.body.style.filter = filters.join(' ');
            
            // Effet de glitch sur le texte
            document.querySelectorAll('h1, h2, h3').forEach(el => {
                if (Math.random() < 0.3) {
                    el.style.textShadow = `
                        ${Math.random() * 4 - 2}px 0 #ff0000,
                        ${Math.random() * 4 - 2}px 0 #00ffff
                    `;
                    setTimeout(() => {
                        el.style.textShadow = '';
                    }, 100);
                }
            });
            
            flickerCount++;
        }, 150 + Math.random() * 200);
    }
    
    isSnakeGameActive = false;
}
// === Fin Snake Game Easter Egg === 

// === Retro Mode Easter Egg ===
let isRetroModeActive = false;
let retroKeyPressed = [];
const retroKeySequence = ['r', 'e', 't', 'r', 'o'];
let retroAudio = {
    keypress: null,
    startup: null,
    shutdown: null,
    beep: null
};
let retroSoundsLoaded = false;
let retroNotification = null;
let crtFrame = null;
let retroLoader = null;
let retroKeyHandler = null;

// Détecter la séquence R-E-T-R-O
document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    
    // Ne pas déclencher si l'utilisateur est dans un champ de saisie
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        if (isRetroModeActive && retroAudio.keypress && retroAudio.keypress.readyState >= 2) {
            // Jouer le son de frappe si en mode rétro
            const keySound = retroAudio.keypress.cloneNode();
            keySound.volume = 0.2;
            keySound.play().catch(err => console.error("Couldn't play keypress sound:", err));
    stopFlicker() {
        if (this.flickerInterval) {
            clearInterval(this.flickerInterval);
            this.flickerInterval = null;
        }
        return;
    }
    
    // Ajouter la touche à la séquence et ne garder que les 5 dernières
    retroKeyPressed.push(key);
    if (retroKeyPressed.length > 5) {
        retroKeyPressed.shift();
    }
    
    // Vérifier si la séquence complète est entrée
    const sequenceMatched = retroKeyPressed.length === 5 && 
                           retroKeyPressed.every((k, i) => k === retroKeySequence[i]);
    
    if (sequenceMatched) {
        toggleRetroMode();
    }
});

// Initialiser les éléments nécessaires pour le mode rétro
function initRetroMode() {
    if (!retroSoundsLoaded) {
        loadRetroSounds();
    }
    
    // Créer le cadre CRT s'il n'existe pas déjà
    if (!crtFrame) {
        crtFrame = document.createElement('div');
        crtFrame.className = 'crt-frame';
        document.body.appendChild(crtFrame);
    }
    
    // Créer la notification si elle n'existe pas déjà
    if (!retroNotification) {
        retroNotification = document.createElement('div');
        retroNotification.className = 'retro-notification';
        document.body.appendChild(retroNotification);
    }
    
    // Créer le loader s'il n'existe pas déjà
    if (!retroLoader) {
        retroLoader = document.createElement('div');
        retroLoader.className = 'retro-loader';
    deactivate() {
        this.isActive = false;
        this.stopFlicker();
        this.matrixEffect.stop();

        const loaderText = document.createElement('div');
        loaderText.className = 'retro-loader-text';
        loaderText.textContent = 'Chargement du mode rétro';
        // Restaurer l'apparence normale progressivement
        document.body.style.transition = 'filter 1s ease-out';
        document.body.style.filter = this.originalBodyFilter;

        retroLoader.appendChild(loaderText);
        document.body.appendChild(retroLoader);
        setTimeout(() => {
            document.body.style.transition = '';
        }, 1000);
    }
}

// Charger les sons rétro
function loadRetroSounds() {
    // Créer et configurer les éléments audio
    retroAudio.keypress = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-typewriter-hard-hit-1370.mp3'); // Remplacer par chemin réel
    retroAudio.startup = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-classic-short-computer-startup-2860.mp3'); // Remplacer par chemin réel
    retroAudio.shutdown = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-retro-game-notification-212.mp3'); // Remplacer par chemin réel
    retroAudio.beep = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-arcade-retro-jump-223.mp3'); // Remplacer par chemin réel
    
    // Précharger les sons
    for (const sound in retroAudio) {
        if (retroAudio[sound]) {
            retroAudio[sound].preload = 'auto';
            retroAudio[sound].load();
        }
// ===== GESTION DES ÉVÉNEMENTS GLOBAUX =====
class GlobalEventManager {
    constructor() {
        this.konamiCode = [
            'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
            'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
            'KeyB', 'KeyA'
        ];
        this.konamiIndex = 0;
        this.matrixEffect = null;
        
        this.init();
    }
    
    retroSoundsLoaded = true;
}

// Activer ou désactiver le mode rétro
function toggleRetroMode() {
    initRetroMode();
    
    if (isRetroModeActive) {
        // Désactiver le mode rétro
        disableRetroMode();
    } else {
        // Activer le mode rétro
        enableRetroMode();
    init() {
        this.matrixEffect = new CinematicMatrixEffect();
        this.bindKonamiCode();
        this.bindWindowEvents();
    }
}

// Activer le mode rétro
function enableRetroMode() {
    // Montrer l'animation de chargement
    retroLoader.classList.add('show');
    
    // Jouer le son de démarrage
    if (retroAudio.startup && retroAudio.startup.readyState >= 2) {
        retroAudio.startup.play().catch(err => console.error("Couldn't play startup sound:", err));
    bindKonamiCode() {
        document.addEventListener('keydown', (e) => {
            if (e.code === this.konamiCode[this.konamiIndex]) {
                this.konamiIndex++;
                if (this.konamiIndex === this.konamiCode.length) {
                    this.activateMatrixMode();
                    this.konamiIndex = 0;
                }
            } else {
                this.konamiIndex = 0;
            }
        });
    }
    
    // Simuler un temps de chargement
    setTimeout(() => {
        // Activer le mode
        document.body.classList.add('retro-mode');
        isRetroModeActive = true;

    bindWindowEvents() {
        window.addEventListener('resize', () => {
            if (this.matrixEffect) {
                this.matrixEffect.resizeCanvas();
            }
        });
    }

    activateMatrixMode() {
        // Notification discrète
        this.showNotification('Mode Matrix activé', 'success');

        // Cacher l'animation de chargement
        retroLoader.classList.remove('show');
        // Démarrer l'effet Matrix
        this.matrixEffect.start(false);

        // Afficher la notification
        retroNotification.textContent = "MODE RÉTRO ACTIVÉ";
        retroNotification.classList.add('show');
        // Arrêter automatiquement après 10 secondes
        setTimeout(() => {
            this.matrixEffect.stop();
            this.showNotification('Mode Matrix désactivé', 'info');
        }, 10000);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? '#00ff00' : '#0ff'};
            color: #000;
            border-radius: 5px;
            font-family: 'Courier New', monospace;
            font-weight: bold;
            z-index: 10000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            box-shadow: 0 4px 20px rgba(0, 255, 255, 0.3);
        `;

        // Jouer un bip de confirmation
        if (retroAudio.beep && retroAudio.beep.readyState >= 2) {
            retroAudio.beep.play().catch(err => console.error("Couldn't play beep sound:", err));
        }
        notification.textContent = message;
        document.body.appendChild(notification);

        // Cacher la notification après 3 secondes
        // Animation d'entrée
        setTimeout(() => {
            retroNotification.classList.remove('show');
        }, 3000);
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Ajouter l'écouteur de clavier pour les sons de frappe
        if (!retroKeyHandler) {
            retroKeyHandler = function(e) {
                if (isRetroModeActive && retroAudio.keypress && retroAudio.keypress.readyState >= 2 && 
                    !e.ctrlKey && !e.altKey && !e.metaKey) { // Ignorer les touches modifiées
                    const keySound = retroAudio.keypress.cloneNode();
                    keySound.volume = 0.1; // Volume réduit pour ne pas être trop intrusif
                    keySound.play().catch(err => {}); // Ignorer les erreurs (peut se produire si l'utilisateur n'a pas encore interagi)
        // Animation de sortie et suppression
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            };
            document.addEventListener('keydown', retroKeyHandler);
        }
        
    }, 1500); // Temps de "chargement" simulé
            }, 300);
        }, 3000);
    }
}

// Désactiver le mode rétro
function disableRetroMode() {
    // Jouer le son d'arrêt
    if (retroAudio.shutdown && retroAudio.shutdown.readyState >= 2) {
        retroAudio.shutdown.play().catch(err => console.error("Couldn't play shutdown sound:", err));
    }
    
    // Mettre à jour la notification
    retroNotification.textContent = "MODE RÉTRO DÉSACTIVÉ";
    retroNotification.classList.add('show');
    
    // Désactiver le mode après une brève pause
    setTimeout(() => {
        document.body.classList.remove('retro-mode');
        isRetroModeActive = false;
        
        // Cacher la notification
        retroNotification.classList.remove('show');
        
    }, 1000);
// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser les effets globaux
    new GlobalEventManager();
    new StrangerThingsEasterEgg();

    // Supprimer l'écouteur de clavier si présent
    if (retroKeyHandler) {
        document.removeEventListener('keydown', retroKeyHandler);
        retroKeyHandler = null;
    }
}
// === Fin Retro Mode Easter Egg ===
    console.log('%c🎬 Effets cinématographiques chargés', 'color: #00ff00; font-size: 14px; font-weight: bold;');
    console.log('%c↑↑↓↓←→←→BA pour activer le mode Matrix', 'color: #0ff; font-size: 12px;');
});

// ===== EXPORT POUR UTILISATION EXTERNE =====
window.TEAMZ = {
    matrix: CinematicMatrixEffect,
    strangerThings: StrangerThingsEasterEgg,
    events: GlobalEventManager
};
