// Attendre que le DOM soit prêt
document.addEventListener('DOMContentLoaded', () => {

    // --- LA LOGIQUE DU FORMULAIRE A ÉTÉ SUPPRIMÉE ---
    // Le tunnel est maintenant géré par un simple lien HTML.
    // Le JavaScript ne contrôle plus que l'animation en arrière-plan.

    // --- PARTIE ANIMATION THREE.JS (INCHANGÉE) ---

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

    // Création de l'objet 3D
    const geometry = new THREE.TorusKnotGeometry(1.2, 0.3, 100, 16);
    const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.8,
        roughness: 0.2
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Éclairage
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0x007bff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Interaction avec la souris
    let mouseX = 0;
    let mouseY = 0;
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });


    // Boucle d'animation
    const clock = new THREE.Clock();
    const animate = () => {
        const elapsedTime = clock.getElapsedTime();

        mesh.rotation.y = elapsedTime * 0.2;
        mesh.rotation.x = elapsedTime * 0.1;
        
        camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
        camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
        window.requestAnimationFrame(animate);
    };

    // Gérer le redimensionnement de la fenêtre
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    animate();
});