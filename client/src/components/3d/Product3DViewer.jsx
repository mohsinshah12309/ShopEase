import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function Product3DViewer({ productName = "Product Showcase" }) {
  const containerRef = useRef(null);
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const meshRef = useRef(null);
  const materialRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.5, 5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // 3D Glass Pedestal Base
    const pedestalGeom = new THREE.CylinderGeometry(2, 2.2, 0.25, 32);
    const pedestalMat = new THREE.MeshPhysicalMaterial({
      color: 0x1c1e29,
      metalness: 0.9,
      roughness: 0.1,
      clearcoat: 1.0,
      transmission: 0.6,
      opacity: 0.8,
      transparent: true,
    });
    const pedestal = new THREE.Mesh(pedestalGeom, pedestalMat);
    pedestal.position.y = -1.5;
    scene.add(pedestal);

    // Dynamic 3D Product Geometric Mesh (Rounded Chamfer Box)
    const geometry = new THREE.BoxGeometry(1.8, 1.8, 1.8, 16, 16, 16);
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x7c82ff,
      metalness: 0.7,
      roughness: 0.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      wireframe: false,
      emissive: 0x111133,
      emissiveIntensity: 0.2,
    });
    materialRef.current = material;

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = 0.2;
    meshRef.current = mesh;
    scene.add(mesh);

    // Floating Ring detail
    const ringGeom = new THREE.TorusGeometry(1.6, 0.05, 16, 100);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x00f2fe,
      metalness: 1.0,
      roughness: 0.1,
      emissive: 0x00f2fe,
      emissiveIntensity: 0.5,
    });
    const ring = new THREE.Mesh(ringGeom, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -0.5;
    scene.add(ring);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x7c82ff, 2);
    dirLight1.position.set(5, 8, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x00f2fe, 1.5);
    dirLight2.position.set(-5, -2, -5);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xff8a5c, 2, 10);
    pointLight.position.set(0, 3, 2);
    scene.add(pointLight);

    // Mouse Dragging to Rotate 3D Object
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging || !meshRef.current) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      meshRef.current.rotation.y += deltaX * 0.01;
      meshRef.current.rotation.x += deltaY * 0.01;
      ring.rotation.z += deltaX * 0.005;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.style.cursor = "grab";
    domElement.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // Handle Resize
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

      if (autoRotate && meshRef.current && !isDragging) {
        meshRef.current.rotation.y += 0.008;
        meshRef.current.rotation.x = Math.sin(elapsedTime * 0.5) * 0.15;
      }

      pedestal.rotation.y += 0.002;
      ring.rotation.z = elapsedTime * 0.3;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      domElement.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      pedestalGeom.dispose();
      pedestalMat.dispose();
      ringGeom.dispose();
      ringMat.dispose();
      renderer.dispose();
    };
  }, [autoRotate]);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.wireframe = wireframe;
    }
  }, [wireframe]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "380px",
        borderRadius: "20px",
        overflow: "hidden",
        background: "radial-gradient(circle at center, rgba(124, 130, 255, 0.08) 0%, rgba(10, 11, 13, 0.95) 100%)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
      }}
    >
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />

      {/* Overlay UI Controls */}
      <div
        style={{
          position: "absolute",
          top: "14px",
          left: "16px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "rgba(10, 11, 13, 0.75)",
          backdropFilter: "blur(12px)",
          padding: "6px 14px",
          borderRadius: "999px",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          fontSize: "12px",
          color: "var(--accent)",
          fontWeight: 600,
          letterSpacing: "0.5px",
        }}
      >
        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#00f2fe", boxShadow: "0 0 8px #00f2fe" }} />
        3D Interactive View
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "14px",
          right: "16px",
          display: "flex",
          gap: "8px",
          zIndex: 10,
        }}
      >
        <button
          type="button"
          onClick={() => setAutoRotate(!autoRotate)}
          style={{
            background: autoRotate ? "rgba(124, 130, 255, 0.25)" : "rgba(255, 255, 255, 0.08)",
            border: "1px solid " + (autoRotate ? "var(--accent)" : "rgba(255,255,255,0.15)"),
            color: autoRotate ? "#fff" : "var(--text-secondary)",
            padding: "6px 12px",
            borderRadius: "8px",
            fontSize: "12px",
            cursor: "pointer",
            backdropFilter: "blur(8px)",
            transition: "all 0.2s ease",
          }}
        >
          {autoRotate ? "Pause Spin" : "Auto Spin"}
        </button>
        <button
          type="button"
          onClick={() => setWireframe(!wireframe)}
          style={{
            background: wireframe ? "rgba(0, 242, 254, 0.25)" : "rgba(255, 255, 255, 0.08)",
            border: "1px solid " + (wireframe ? "#00f2fe" : "rgba(255,255,255,0.15)"),
            color: wireframe ? "#00f2fe" : "var(--text-secondary)",
            padding: "6px 12px",
            borderRadius: "8px",
            fontSize: "12px",
            cursor: "pointer",
            backdropFilter: "blur(8px)",
            transition: "all 0.2s ease",
          }}
        >
          {wireframe ? "Shaded" : "Wireframe"}
        </button>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "14px",
          left: "16px",
          fontSize: "11px",
          color: "rgba(255, 255, 255, 0.4)",
          pointerEvents: "none",
        }}
      >
        Drag cursor to rotate 3D model
      </div>
    </div>
  );
}
