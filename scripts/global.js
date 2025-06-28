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
};

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

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.setupColumns();
    }

    setupColumns() {
        const columnCount = Math.floor(this.canvas.width / CONFIG.matrix.fontSize);
        this.columns = [];
        
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

    generateChar() {
        return CONFIG.matrix.chars[Math.floor(Math.random() * CONFIG.matrix.chars.length)];
    }

    updateColumn(column, deltaTime) {
        column.y += column.speed * deltaTime * 60;
        column.phase += 0.02;
        
        // Effet de glitch en mode Stranger Things
        if (this.glitchMode) {
            column.glitchOffset = (Math.random() - 0.5) * 10 * CONFIG.strangerThings.glitchIntensity;
        }
        
        // Réinitialiser la colonne si elle sort de l'écran
        if (column.y > this.canvas.height + CONFIG.matrix.trailLength * CONFIG.matrix.fontSize) {
            column.y = -CONFIG.matrix.trailLength * CONFIG.matrix.fontSize;
            column.speed = CONFIG.matrix.minSpeed + Math.random() * (CONFIG.matrix.maxSpeed - CONFIG.matrix.minSpeed);
            column.intensity = Math.random();
            column.chars = [];
        }
        
        // Générer de nouveaux caractères
        if (Math.random() < 0.1) {
            column.chars.unshift(this.generateChar());
            if (column.chars.length > CONFIG.matrix.trailLength) {
                column.chars.pop();
            }
        }
    }

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
                // Mode Matrix classique - vert électrique
                const greenIntensity = Math.floor(255 * alpha);
                color = `rgba(0, ${greenIntensity}, ${Math.floor(greenIntensity * 0.7)}, ${alpha})`;
            }
            
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
        }
    }

    animate(currentTime) {
        if (!this.isActive) return;
        
        const deltaTime = (currentTime - this.time) / 1000;
        this.time = currentTime;
        
        // Effet de fade cinématographique
        this.ctx.fillStyle = this.glitchMode 
            ? 'rgba(10, 0, 0, 0.1)' 
            : 'rgba(0, 5, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Mise à jour et rendu des colonnes
        this.columns.forEach(column => {
            this.updateColumn(column, deltaTime);
            this.drawColumn(column);
        });
        
        // Effet de scanlines cinématographiques
        this.drawScanlines();
        
        this.animationId = requestAnimationFrame((time) => this.animate(time));
    }

    drawScanlines() {
        const scanlineCount = Math.floor(this.canvas.height / 4);
        this.ctx.globalCompositeOperation = 'overlay';
        
        for (let i = 0; i < scanlineCount; i++) {
            const y = i * 4;
            const opacity = 0.02 + Math.sin(this.time * 0.001 + i * 0.1) * 0.01;
            
            this.ctx.fillStyle = this.glitchMode 
                ? `rgba(255, 0, 0, ${opacity})` 
                : `rgba(0, 255, 0, ${opacity})`;
            this.ctx.fillRect(0, y, this.canvas.width, 1);
        }
        
        this.ctx.globalCompositeOperation = 'source-over';
    }

    start(glitchMode = false) {
        this.glitchMode = glitchMode;
        this.isActive = true;
        this.canvas.style.opacity = '1';
        this.time = performance.now();
        this.animate(this.time);
    }

    stop() {
        this.isActive = false;
        this.canvas.style.opacity = '0';
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    toggleGlitchMode(enabled) {
        this.glitchMode = enabled;
    }
}

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
            
            #upside-down-trigger:hover {
                opacity: 1 !important;
                transform: scale(1.2);
                box-shadow: 0 0 30px rgba(255, 0, 0, 0.8);
            }
        `;
        document.head.appendChild(style);

        trigger.addEventListener('click', () => this.activate());
    }

    activate() {
        if (this.isActive) return;
        
        this.isActive = true;
        this.originalBodyFilter = document.body.style.filter;
        
        // Démarrer l'effet Matrix en mode glitch
        this.matrixEffect.start(true);
        
        // Effet de scintillement de l'écran
        this.startFlicker();
        
        // Arrêter automatiquement après la durée configurée
        setTimeout(() => this.deactivate(), CONFIG.strangerThings.flickerDuration);
    }

    startFlicker() {
        let flickerCount = 0;
        const maxFlickers = 15;
        
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

    stopFlicker() {
        if (this.flickerInterval) {
            clearInterval(this.flickerInterval);
            this.flickerInterval = null;
        }
    }

    deactivate() {
        this.isActive = false;
        this.stopFlicker();
        this.matrixEffect.stop();
        
        // Restaurer l'apparence normale progressivement
        document.body.style.transition = 'filter 1s ease-out';
        document.body.style.filter = this.originalBodyFilter;
        
        setTimeout(() => {
            document.body.style.transition = '';
        }, 1000);
    }
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

    init() {
        this.matrixEffect = new CinematicMatrixEffect();
        this.bindKonamiCode();
        this.bindWindowEvents();
    }

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
        
        // Démarrer l'effet Matrix
        this.matrixEffect.start(false);
        
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
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Animation d'entrée
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Animation de sortie et suppression
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser les effets globaux
    new GlobalEventManager();
    new StrangerThingsEasterEgg();
    
    console.log('%c🎬 Effets cinématographiques chargés', 'color: #00ff00; font-size: 14px; font-weight: bold;');
    console.log('%c↑↑↓↓←→←→BA pour activer le mode Matrix', 'color: #0ff; font-size: 12px;');
});

// ===== EXPORT POUR UTILISATION EXTERNE =====
window.TEAMZ = {
    matrix: CinematicMatrixEffect,
    strangerThings: StrangerThingsEasterEgg,
    events: GlobalEventManager
};