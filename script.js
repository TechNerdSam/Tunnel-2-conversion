// Attendre que le DOM soit prêt
document.addEventListener('DOMContentLoaded', () => {

    // --- PARTIE 1: LOGIQUE DU TUNNEL DE CONVERSION ---

    const steps = Array.from(document.querySelectorAll('.form-step'));
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const submitBtn = document.getElementById('submitBtn');
    const progressBar = document.getElementById('progressBar');
    
    let currentStep = 0;
    const totalSteps = steps.length;

    function updateFunnelState() {
        steps.forEach((step, index) => {
            step.classList.toggle('active', index === currentStep);
        });

        const progressPercentage = (currentStep / (totalSteps - 1)) * 100;
        progressBar.style.width = `${progressPercentage}%`;

        prevBtn.style.display = currentStep === 0 ? 'none' : 'inline-block';
        nextBtn.style.display = currentStep === totalSteps - 1 ? 'none' : 'inline-block';
        submitBtn.style.display = currentStep === totalSteps - 1 ? 'inline-block' : 'none';
    }

    nextBtn.addEventListener('click', () => {
        if (currentStep < totalSteps - 1) {
            currentStep++;
            updateFunnelState();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            updateFunnelState();
        }
    });

    updateFunnelState();

    // --- PARTIE 2: ANIMATION THREE.JS ---

    // Initialisation de la scène
    const scene = new THREE.Scene();

    // Caméra
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('bg-canvas'),
        alpha: true // Permet un fond transparent
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Création de l'objet 3D (un tore noué pour un effet complexe et élégant)
    const geometry = new THREE.TorusKnotGeometry(1.2, 0.3, 100, 16);
    const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.8,
        roughness: 0.2
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Éclairage
    // Lumière d'ambiance pour éclairer toute la scène
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Lumière directionnelle pour créer des ombres et du relief
    const directionalLight = new THREE.DirectionalLight(0x007bff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Interaction avec la souris
    let mouseX = 0;
    let mouseY = 0;
    document.addEventListener('mousemove', (event) => {
        // Normaliser les coordonnées de la souris (-1 à +1)
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });


    // Boucle d'animation
    const clock = new THREE.Clock();
    const animate = () => {
        const elapsedTime = clock.getElapsedTime();

        // Rotation automatique lente
        mesh.rotation.y = elapsedTime * 0.2;
        mesh.rotation.x = elapsedTime * 0.1;
        
        // Mouvement subtil basé sur la position de la souris (effet parallax)
        camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
        camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        // Rendu de la scène
        renderer.render(scene, camera);

        // Demander la prochaine frame
        window.requestAnimationFrame(animate);
    };

    // Gérer le redimensionnement de la fenêtre
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    animate(); // Lancer l'animation
});