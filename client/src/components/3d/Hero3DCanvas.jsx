import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Hero3DCanvas() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 7;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Main 3D Floating Geometry: Metallic Torus Knot
    const geometry = new THREE.TorusKnotGeometry(1.6, 0.45, 128, 32);
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x7c82ff,
      metalness: 0.85,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      wireframe: false,
      emissive: 0x221144,
      emissiveIntensity: 0.4,
    });
    const torusKnot = new THREE.Mesh(geometry, material);
    scene.add(torusKnot);

    // Secondary 3D Floating Orbiting Elements (Icosahedrons & Spheres)
    const floatingGroup = new THREE.Group();
    const orbGeom = new THREE.IcosahedronGeometry(0.35, 1);
    const orbMat = new THREE.MeshStandardMaterial({
      color: 0x00f2fe,
      metalness: 0.9,
      roughness: 0.2,
      wireframe: true,
    });

    const numOrbs = 8;
    const orbs = [];
    for (let i = 0; i < numOrbs; i++) {
      const orb = new THREE.Mesh(orbGeom, orbMat);
      const angle = (i / numOrbs) * Math.PI * 2;
      const radius = 3.8 + Math.random() * 0.8;
      orb.position.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 2.5,
        Math.sin(angle) * radius - 1
      );
      orb.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      floatingGroup.add(orb);
      orbs.push({ mesh: orb, angle, radius, speed: 0.005 + Math.random() * 0.005, yOffset: orb.position.y });
    }
    scene.add(floatingGroup);

    // Background 3D Particles Dust
    const particleCount = 200;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 20;
      positions[i + 1] = (Math.random() - 0.5) * 20;
      positions[i + 2] = (Math.random() - 0.5) * 15;
      scales[i / 3] = Math.random() * 0.08 + 0.02;
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xa855f7,
      size: 0.08,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0x7c82ff, 2.5);
    mainLight.position.set(5, 5, 5);
    scene.add(mainLight);

    const cyanPointLight = new THREE.PointLight(0x00f2fe, 3, 10);
    cyanPointLight.position.set(-4, -2, 3);
    scene.add(cyanPointLight);

    const pinkPointLight = new THREE.PointLight(0xff007f, 3, 10);
    pinkPointLight.position.set(4, 3, 2);
    scene.add(pinkPointLight);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseX = (x / container.clientWidth - 0.5) * 2;
      mouseY = (y / container.clientHeight - 0.5) * 2;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse damping
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      // Torus knot rotation
      torusKnot.rotation.x = elapsedTime * 0.4 + targetY * 0.8;
      torusKnot.rotation.y = elapsedTime * 0.6 + targetX * 0.8;

      // Orbiting elements
      orbs.forEach((item) => {
        item.angle += item.speed;
        item.mesh.position.x = Math.cos(item.angle) * item.radius + targetX * 0.5;
        item.mesh.position.z = Math.sin(item.angle) * item.radius - 1;
        item.mesh.position.y = item.yOffset + Math.sin(elapsedTime * 2 + item.angle) * 0.3 - targetY * 0.5;
        item.mesh.rotation.x += 0.01;
        item.mesh.rotation.y += 0.01;
      });

      // Particles rotation
      particles.rotation.y = elapsedTime * 0.05;
      particles.rotation.x = elapsedTime * 0.02;

      // Point lights dynamic movement
      cyanPointLight.position.x = Math.sin(elapsedTime * 1.5) * 4;
      cyanPointLight.position.y = Math.cos(elapsedTime * 1.2) * 3;
      pinkPointLight.position.x = Math.cos(elapsedTime * 1.3) * 4;
      pinkPointLight.position.y = Math.sin(elapsedTime * 1.6) * 3;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      orbGeom.dispose();
      orbMat.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
}
