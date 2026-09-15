import * as THREE from "./vendor/three.module.js";

// Illustrative portal-frame hall with I-sections, bolted connections and bracing.
export function initScene(labels) {
  const canvas = document.querySelector("#architecture"),
    stage = canvas.parentElement;
  const hero = document.querySelector(".hero"),
    dock = document.querySelector(".model-dock");
  const toggle = document.querySelector(".motion-toggle");
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  let motionOptIn = false;
  const isReduced = () => motion.matches && !motionOptIn;
  const mobile = matchMedia("(max-width:700px)");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  const scene = new THREE.Scene(),
    camera = new THREE.OrthographicCamera(-7, 7, 6, -6, 0.1, 80);
  camera.position.set(11, 8, 13);
  camera.lookAt(0, 1.4, 0);
  scene.add(new THREE.HemisphereLight(0xe9f0ff, 0x8a867b, 2.2));
  const sun = new THREE.DirectionalLight(0xfff4df, 3.2);
  sun.position.set(-6, 10, 5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9 });
  sun.shadow.normalBias = 0.025;
  scene.add(sun);
  const fill = new THREE.DirectionalLight(0xb9d1ed, 2.4);
  fill.position.set(6, 5, -7);
  scene.add(fill);
  const model = new THREE.Group();
  scene.add(model);
  const material = (color, roughness = 0.6, metalness = 0) =>
    new THREE.MeshStandardMaterial({ color, roughness, metalness });
  const steel = material(0x43566a, 0.38, 0.65),
    plate = material(0x26394c, 0.45, 0.55),
    zinc = material(0xa3b2bd, 0.35, 0.72),
    concrete = material(0xc7c5ba, 0.95),
    roofMat = material(0x758896, 0.55, 0.5);
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const boltGeometry = new THREE.CylinderGeometry(0.035, 0.035, 0.035, 6);
  function box(g, w, h, d, x, y, z, mat) {
    const m = new THREE.Mesh(boxGeometry, mat);
    m.scale.set(w, h, d);
    m.position.set(x, y, z);
    m.castShadow = true;
    m.receiveShadow = true;
    g.add(m);
    return m;
  }
  const phases = [];
  function group(start, end, offset) {
    const g = new THREE.Group();
    model.add(g);
    phases.push({ g, start, end, offset });
    return g;
  }
  const foundation = new THREE.Group();
  model.add(foundation);
  const columns = group(0.02, 0.25, 1.6),
    rafters = group(0.23, 0.49, 2.0),
    braces = group(0.43, 0.69, 0.8),
    roof = group(0.68, 0.88, 1.5);
  box(foundation, 7.2, 0.2, 8.2, 0, -0.2, 0, concrete);
  // Separate flange and web meshes give each member a true I-shaped silhouette.
  function beam(g, a, b, width = 0.19, depth = 0.28, mat = steel) {
    const start = new THREE.Vector3(...a),
      end = new THREE.Vector3(...b);
    const length = start.distanceTo(end);
    const part = new THREE.Group();
    part.position.copy(start).add(end).multiplyScalar(0.5);
    part.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      end.sub(start).normalize(),
    );
    g.add(part);
    box(part, 0.038, length, depth, 0, 0, 0, mat);
    for (const z of [-1, 1])
      box(part, width, length, 0.035, 0, 0, (z * (depth - 0.035)) / 2, mat);
    return part;
  }
  function rod(g, a, b) {
    const start = new THREE.Vector3(...a),
      end = new THREE.Vector3(...b);
    const m = new THREE.Mesh(
      new THREE.CylinderGeometry(0.023, 0.023, start.distanceTo(end), 6),
      zinc,
    );
    m.position.copy(start).add(end).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      end.sub(start).normalize(),
    );
    g.add(m);
  }
  const boltTransforms = [];
  for (const z of [-3.3, -1.1, 1.1, 3.3]) {
    for (const x of [-2.8, 2.8]) {
      box(foundation, 0.7, 0.22, 0.7, x, 0.01, z, concrete);
      box(foundation, 0.46, 0.045, 0.5, x, 0.145, z, plate);
      for (const dx of [-0.16, 0.16])
        for (const dz of [-0.17, 0.17])
          boltTransforms.push([x + dx, 0.19, z + dz]);
      beam(columns, [x, 0.17, z], [x, 3.25, z], 0.24, 0.32);
      // Knee connection plates and haunches below each sloped rafter.
      box(rafters, 0.32, 0.42, 0.065, x, 3.12, z + 0.18, plate);
      beam(rafters, [x, 3.22, z], [0, 4.3, z], 0.22, 0.32);
      beam(rafters, [x, 2.8, z], [x * 0.72, 3.52, z], 0.15, 0.18);
    }
    box(rafters, 0.32, 0.24, 0.065, 0, 4.25, z + 0.18, plate);
  }
  const bolts = new THREE.InstancedMesh(
    boltGeometry,
    zinc,
    boltTransforms.length,
  );
  const dummy = new THREE.Object3D();
  boltTransforms.forEach((p, i) => {
    dummy.position.set(...p);
    dummy.updateMatrix();
    bolts.setMatrixAt(i, dummy.matrix);
  });
  foundation.add(bolts);
  // Longitudinal eave ties, roof purlins, and crossed tension rods.
  for (const x of [-2.8, 2.8])
    beam(braces, [x, 3.18, -3.3], [x, 3.18, 3.3], 0.13, 0.16, zinc);
  for (const x of [-2.2, -1.1, 0, 1.1, 2.2]) {
    const y = 4.3 - (Math.abs(x) / 2.8) * 1.08;
    beam(braces, [x, y + 0.08, -3.55], [x, y + 0.08, 3.55], 0.11, 0.14, zinc);
  }
  for (const x of [-2.8, 2.8]) {
    rod(braces, [x, 0.35, -3.3], [x, 3.1, -1.1]);
    rod(braces, [x, 3.1, -3.3], [x, 0.35, -1.1]);
  }
  for (const z of [-3.3, 3.3]) {
    rod(braces, [-2.65, 3.3, z], [0, 4.2, z]);
    rod(braces, [0, 4.2, z], [2.65, 3.3, z]);
  }
  rod(braces, [-2.7, 3.3, -3.3], [0, 4.35, -1.1]);
  rod(braces, [0, 4.35, -3.3], [-2.7, 3.3, -1.1]);
  // Partial standing-seam cladding keeps the structural connections visible.
  const slope = Math.atan2(1.08, 2.8);
  for (const side of [-1, 1]) {
    const panel = new THREE.Group();
    panel.position.set(side * 1.43, 3.91, -1.72);
    panel.rotation.z = -side * slope;
    roof.add(panel);
    box(panel, 3.12, 0.045, 3.25, 0, 0, 0, roofMat);
    for (let i = 0; i < 10; i++)
      box(panel, 3.12, 0.035, 0.018, 0, 0.035, -1.52 + i * 0.337, zinc);
  }
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.ShadowMaterial({ opacity: 0.16 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.31;
  ground.receiveShadow = true;
  scene.add(ground);
  const grid = new THREE.GridHelper(10, 20, 0x9ca4a6, 0xc5c8c3);
  grid.position.y = -0.305;
  grid.material.transparent = true;
  grid.material.opacity = 0.2;
  model.add(grid);
  let visible = true,
    paused = false,
    progress = 0,
    pointer = 0,
    currentPointer = 0,
    disposed = false,
    lastTime = 0;
  const smooth = (t) => {
    t = THREE.MathUtils.clamp(t, 0, 1);
    return t * t * (3 - 2 * t);
  };
  function render() {
    if (disposed) return;
    const p = isReduced() ? 1 : 0.08 + progress * 0.92;
    phases.forEach(({ g, start, end, offset }) => {
      const t = smooth((p - start) / (end - start));
      g.visible = t > 0;
      g.position.y = (1 - t) * offset;
    });
    model.rotation.y = -0.38 + p * 0.32 + currentPointer;
    renderer.render(scene, camera);
    stage.dataset.progress = p.toFixed(3);
  }
  function measure() {
    const track = document.querySelector(
      mobile.matches ? ".model-track" : ".hero-scroll",
    );
    const r = track.getBoundingClientRect();
    const travel = Math.max(1, track.offsetHeight - dock.offsetHeight);
    if (!paused) progress = THREE.MathUtils.clamp((12 - r.top) / travel, 0, 1);
    if (isReduced() || paused) render();
  }
  function resize() {
    const w = stage.clientWidth,
      h = stage.clientHeight;
    renderer.setSize(w, h, false);
    const aspect = w / h;
    const half = Math.max(5.2, 6.1 / aspect);
    camera.left = -half * aspect;
    camera.right = half * aspect;
    camera.top = half;
    camera.bottom = -half;
    camera.updateProjectionMatrix();
    measure();
    render();
  }
  function tick(time) {
    const dt = Math.min((time - lastTime) / 1000, 0.05);
    lastTime = time;
    currentPointer += (pointer - currentPointer) * (1 - Math.exp(-5 * dt));
    render();
  }
  function loop() {
    renderer.setAnimationLoop(
      visible && !document.hidden && !isReduced() && !paused ? tick : null,
    );
    render();
  }
  const io = new IntersectionObserver((e) => {
    visible = e[0].isIntersecting;
    loop();
  });
  io.observe(stage);
  const ro = new ResizeObserver(resize);
  ro.observe(stage);
  const onPointer = (e) => {
    if (e.pointerType === "mouse")
      pointer = (e.clientX / innerWidth - 0.5) * 0.1;
  };
  const onMotion = () => {
    toggle.hidden = false;
    toggle.textContent = isReduced() ? labels.start : (paused ? labels.resume : labels.pause);
    resize();
    loop();
  };
  addEventListener("scroll", measure, { passive: true });
  addEventListener("pointermove", onPointer, { passive: true });
  document.addEventListener("visibilitychange", loop);
  motion.addEventListener("change", onMotion);
  toggle.hidden = false;
    toggle.textContent = isReduced() ? labels.start : (paused ? labels.resume : labels.pause);
  toggle.onclick = () => {
    if (isReduced()) {
      motionOptIn = true;
      hero.classList.add("motion-enabled");
      paused = false;
      toggle.textContent = labels.pause;
      toggle.setAttribute("aria-pressed", "false");
      resize();
      loop();
      return;
    }
    paused = !paused;
    toggle.textContent = paused ? labels.resume : labels.pause;
    toggle.setAttribute("aria-pressed", String(paused));
    if (!paused) measure();
    loop();
  };
  canvas.addEventListener("webglcontextlost", (e) => {
    e.preventDefault();
    renderer.setAnimationLoop(null);
    const image = stage.querySelector(".model-fallback");
    image.onload = () => stage.classList.add("failed");
    image.src = image.dataset.src;
    stage.classList.remove("ready");
    hero.classList.add("scene-failed");
    toggle.hidden = true;
  });
  canvas.addEventListener("webglcontextrestored", () => {
    stage.classList.remove("failed");
    hero.classList.remove("scene-failed");
    resize();
    stage.classList.add("ready");
    toggle.hidden = false;
    toggle.textContent = isReduced() ? labels.start : (paused ? labels.resume : labels.pause);
    loop();
  });
  // Start with the first frame already partly assembled; finish before pin release.
  resize();
  render();
  stage.classList.add("ready");
  loop();
  addEventListener(
    "pagehide",
    (e) => {
      if (e.persisted) return;
      disposed = true;
      renderer.setAnimationLoop(null);
      io.disconnect();
      ro.disconnect();
      removeEventListener("scroll", measure);
      removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", loop);
      motion.removeEventListener("change", onMotion);
      const geometries = new Set(),
        materials = new Set();
      scene.traverse((o) => {
        if (o.geometry) geometries.add(o.geometry);
        if (o.material) materials.add(o.material);
      });
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      renderer.dispose();
    },
    { once: true },
  );
}
