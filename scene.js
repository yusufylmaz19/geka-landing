import * as THREE from "./vendor/three.module.js";

// A small architectural maquette: concrete plinth, steel frame, glazing,
// timber fins and a floating roof. Scroll exposes the construction layers.
export function initScene(labels) {
  const canvas = document.querySelector("#architecture");
  const stage = canvas.parentElement;
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const toggle = document.querySelector(".motion-toggle");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-6, 6, 5, -5, 0.1, 80);
  camera.position.set(10, 8.5, 12);
  camera.lookAt(0, 1, 0);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x9b9b91, 2.5));
  const sun = new THREE.DirectionalLight(0xfff5e5, 4);
  sun.position.set(-5, 12, 8);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.left = -8;
  sun.shadow.camera.right = 8;
  sun.shadow.camera.top = 8;
  sun.shadow.camera.bottom = -8;
  sun.shadow.normalBias = 0.04;
  scene.add(sun);
  const fill = new THREE.DirectionalLight(0xb8c8df, 2);
  fill.position.set(7, 3, -5);
  scene.add(fill);
  const model = new THREE.Group();
  scene.add(model);
  model.rotation.y = -0.25;
  const mat = (color, roughness = 0.8, metalness = 0) =>
    new THREE.MeshStandardMaterial({ color, roughness, metalness });
  const navy = mat(0x233448, 0.65, 0.25),
    concrete = mat(0xd0cfc5),
    edge = mat(0xe6e3d8),
    wood = mat(0xa88663),
    dark = mat(0x101f2d, 0.7, 0.15);
  const glass = new THREE.MeshStandardMaterial({
    color: 0x8fadae,
    roughness: 0.2,
    metalness: 0.1,
    transparent: true,
    opacity: 0.28,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const layers = [];
  function layer(amount) {
    const g = new THREE.Group();
    g.userData.explode = amount;
    model.add(g);
    layers.push(g);
    return g;
  }
  const base = layer(0),
    frame = layer(0.16),
    walls = layer(0.45),
    roof = layer(1.25);
  function box(parent, w, h, d, x, y, z, material) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }
  box(base, 6.9, 0.22, 5.5, 0, -0.32, 0, concrete);
  box(base, 6.3, 0.18, 4.9, 0, -0.1, 0, edge);
  box(base, 5.8, 0.12, 4.35, 0, 0.04, 0, concrete);
  // Stepped entrance and slender structural columns.
  for (let i = 0; i < 3; i++)
    box(base, 2.4, 0.09, 0.4, 0.85, -0.2 + i * 0.07, 2.7 - i * 0.32, edge);
  for (const x of [-2.7, 0, 2.7])
    for (const z of [-1.95, 1.95])
      box(frame, 0.13, 2.55, 0.13, x, 1.3, z, navy);
  for (const z of [-1.95, 1.95]) box(frame, 5.55, 0.16, 0.16, 0, 2.53, z, navy);
  for (const x of [-2.7, 0, 2.7])
    box(frame, 0.14, 0.16, 4.05, x, 2.53, 0, navy);
  // Back wall, glass frontage, a timber screen and exposed steel rafters.
  box(walls, 5.4, 2.35, 0.13, 0, 1.24, -1.96, edge);
  box(walls, 0.1, 2.35, 3.85, -2.69, 1.24, 0, glass);
  for (const x of [-1.78, -0.88, 0.9, 1.8])
    box(walls, 0.045, 2.4, 0.06, x, 1.27, 1.97, navy);
  for (const x of [-1.8, 0, 1.8])
    box(walls, 1.72, 2.3, 0.025, x, 1.25, 1.97, glass);
  for (let i = 0; i < 13; i++)
    box(walls, 0.16, 2.35, 0.1, 2.68, 1.24, -1.9 + i * 0.22, wood);
  box(walls, 2.1, 1.75, 0.15, -1.3, 0.97, -0.65, navy);
  // Interior furniture establishes human scale.
  box(base, 1.5, 0.2, 0.7, 0.9, 0.58, -0.75, wood);
  box(base, 0.1, 0.5, 0.55, 0.3, 0.28, -0.75, dark);
  box(base, 0.1, 0.5, 0.55, 1.5, 0.28, -0.75, dark);
  box(base, 1.4, 0.35, 0.6, -1.15, 0.3, 0.35, edge);
  box(base, 1.4, 0.5, 0.13, -1.15, 0.52, 0.05, concrete);
  box(roof, 6.15, 0.18, 4.65, 0, 2.78, 0, navy);
  for (let i = 0; i < 12; i++)
    box(roof, 0.07, 0.12, 4.4, -2.8 + i * 0.51, 2.62, 0, wood);
  box(roof, 5.9, 0.055, 4.4, 0, 2.9, 0, concrete);
  // Roof seams add scale without textures or large model downloads.
  for (let i = 0; i < 14; i++)
    box(roof, 0.022, 0.025, 4.35, -2.78 + i * 0.425, 2.94, 0, navy);
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 200),
    new THREE.ShadowMaterial({ opacity: 0.13 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.45;
  ground.receiveShadow = true;
  scene.add(ground);
  const grid = new THREE.GridHelper(9, 12, 0x8b949a, 0xb9bebc);
  grid.position.y = -0.43;
  grid.material.transparent = true;
  grid.material.opacity = 0.24;
  model.add(grid);
  // A simple dimension frame grounds the object in architectural drawing.
  const points = [
    new THREE.Vector3(-3.45, -0.28, 3.2),
    new THREE.Vector3(3.45, -0.28, 3.2),
  ];
  const dimension = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(points),
    new THREE.LineBasicMaterial({ color: 0x7c8790 }),
  );
  model.add(dimension);
  for (const x of [-3.45, 3.45])
    box(base, 0.015, 0.015, 0.22, x, -0.28, 3.2, navy);
  let visible = true,
    paused = false,
    progress = 0,
    pointer = 0,
    currentPointer = 0,
    disposed = false;
  const hero = document.querySelector(".hero");
  function resize() {
    const w = stage.clientWidth,
      h = stage.clientHeight;
    renderer.setSize(w, h, false);
    const aspect = w / h;
    const view = 4.8;
    camera.left = -view * aspect;
    camera.right = view * aspect;
    camera.top = view;
    camera.bottom = -view;
    camera.updateProjectionMatrix();
    render();
  }
  function measure() {
    const rect = hero.getBoundingClientRect();
    progress = Math.max(0, Math.min(1, -rect.top / (rect.height * 0.8)));
    if (motion.matches || paused) render();
  }
  function render() {
    if (disposed) return;
    const amount = motion.matches || paused ? 0 : progress;
    layers.forEach(
      (l) => (l.position.y = l.userData.explode * (0.38 + amount * 1.8)),
    );
    model.rotation.y = -0.3 + amount * 0.7 + currentPointer;
    renderer.render(scene, camera);
  }
  function tick() {
    currentPointer += (pointer - currentPointer) * 0.035;
    render();
  }
  function updateLoop() {
    renderer.setAnimationLoop(
      visible && !document.hidden && !motion.matches && !paused ? tick : null,
    );
    render();
  }
  const io = new IntersectionObserver((e) => {
    visible = e[0].isIntersecting;
    updateLoop();
  });
  io.observe(stage);
  const ro = new ResizeObserver(resize);
  ro.observe(stage);
  const onPointer = (e) => {
    pointer = (e.clientX / innerWidth - 0.5) * 0.13;
  };
  const onMotion = () => {
    toggle.hidden = motion.matches;
    updateLoop();
  };
  addEventListener("pointermove", onPointer, { passive: true });
  addEventListener("scroll", measure, { passive: true });
  document.addEventListener("visibilitychange", updateLoop);
  motion.addEventListener("change", onMotion);
  toggle.hidden = motion.matches;
  toggle.onclick = () => {
    paused = !paused;
    toggle.textContent = paused ? labels.resume : labels.pause;
    toggle.setAttribute("aria-pressed", String(paused));
    updateLoop();
  };
  canvas.addEventListener("webglcontextlost", (e) => {
    e.preventDefault();
    renderer.setAnimationLoop(null);
    stage.classList.remove("ready");
    toggle.hidden = true;
  });
  canvas.addEventListener("webglcontextrestored", () => {
    stage.classList.add("ready");
    toggle.hidden = motion.matches;
    updateLoop();
  });
  resize();
  measure();
  stage.classList.add("ready");
  updateLoop();
  addEventListener(
    "pagehide",
    (e) => {
      if (e.persisted) return;
      disposed = true;
      renderer.setAnimationLoop(null);
      io.disconnect();
      ro.disconnect();
      removeEventListener("pointermove", onPointer);
      removeEventListener("scroll", measure);
      document.removeEventListener("visibilitychange", updateLoop);
      motion.removeEventListener("change", onMotion);
      const materials = new Set();
      scene.traverse((o) => {
        o.geometry?.dispose();
        if (o.material) materials.add(o.material);
      });
      materials.forEach((m) => m.dispose());
      renderer.dispose();
    },
    { once: true },
  );
}
