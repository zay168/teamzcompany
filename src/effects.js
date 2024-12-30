import * as THREE from 'three';

const createInteractiveBackground = () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    
    // Création d'un effet de particules interactives
    const particles = new THREE.Points(
        new THREE.BufferGeometry(),
        new THREE.ShaderMaterial({
            // Shaders personnalisés
        })
    );
    
    scene.add(particles);
} 