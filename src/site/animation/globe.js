import * as THREE from "three";

/**
 * Legal World globe. A dark glass sphere carrying a dot-matrix of the continents, a faint graticule, gold great-circle
 * arcs between Indian cities and a few global hubs, and a teal atmosphere. It is drawn over the artwork's baked globe
 * (same position/size) so the supplied illustration keeps its sky, spheres and gold rings.
 *
 * The scene is tiny (≈ 3k dots, 12 lines) and only renders while it is on screen. Imported lazily, so three.js is a
 * separate chunk that only loads when the section is near the viewport.
 */

const CITIES = {
  Delhi: [28.6, 77.2], Mumbai: [19.1, 72.9], Bengaluru: [13.0, 77.6], Chennai: [13.1, 80.3], Hyderabad: [17.4, 78.5], Kolkata: [22.6, 88.4],
  London: [51.5, -0.1], Dubai: [25.2, 55.3], Singapore: [1.35, 103.8], "New York": [40.7, -74.0],
};
const ARCS = [
  ["Delhi", "Mumbai"], ["Delhi", "Kolkata"], ["Mumbai", "Bengaluru"], ["Delhi", "Hyderabad"], ["Kolkata", "Chennai"],
  ["Delhi", "London"], ["Mumbai", "Dubai"], ["Chennai", "Singapore"], ["Delhi", "New York"],
];
const TEAL = new THREE.Color("#9fe0d6"), GOLD = new THREE.Color("#e8c47a");

/** lat/lon (deg) → point on a sphere of radius r, matching an equirectangular texture (lon 0 at +x, lon −90 at +z). */
const toXYZ = (lat, lon, r = 1) => {
  const phi = THREE.MathUtils.degToRad(90 - lat), th = THREE.MathUtils.degToRad(lon + 180);
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(th), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(th));
};

const loadMask = (url) => new Promise((resolve, reject) => {
  const img = new Image();
  img.onload = () => {
    const c = document.createElement("canvas");
    c.width = img.width; c.height = img.height;
    const g = c.getContext("2d", { willReadFrequently: true });
    g.drawImage(img, 0, 0);
    resolve({ w: img.width, h: img.height, data: g.getImageData(0, 0, img.width, img.height).data });
  };
  img.onerror = reject;
  img.src = url;
});

export async function createGlobe(canvas, { maskUrl, spinLon = 78 }) {
  const mask = await loadMask(maskUrl);
  const isLand = (lat, lon) => {
    const x = Math.min(mask.w - 1, Math.max(0, Math.floor(((lon + 180) / 360) * mask.w)));
    const y = Math.min(mask.h - 1, Math.max(0, Math.floor(((90 - lat) / 180) * mask.h)));
    return mask.data[(y * mask.w + x) * 4] > 127;
  };

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const FOV = 30;
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 50);
  camera.position.set(0, 0, 5.3);

  const root = new THREE.Group();   // tilt + pointer
  const globe = new THREE.Group();  // spin
  root.add(globe);
  scene.add(root);
  root.rotation.x = 0.34;
  root.rotation.z = -0.08;

  const uniforms = { uTime: { value: 0 }, uPx: { value: 1000 }, uPulse: { value: 0 } };

  // Glass body — opaque so it fully covers the baked globe beneath it.
  const body = new THREE.Mesh(
    new THREE.SphereGeometry(1, 96, 64),
    new THREE.ShaderMaterial({
      uniforms: { uSun: { value: new THREE.Vector3(0.55, 0.45, 0.7).normalize() } },
      vertexShader: `varying vec3 vN; varying vec3 vV;
        void main(){ vec4 mv = modelViewMatrix * vec4(position,1.); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`,
      fragmentShader: `varying vec3 vN; varying vec3 vV; uniform vec3 uSun;
        void main(){
          float nv = clamp(dot(normalize(vN), normalize(vV)), 0., 1.);
          float rim = pow(1. - nv, 2.4);
          vec3 deep = vec3(.01,.07,.095), mid = vec3(.026,.15,.19), edge = vec3(.16,.42,.47);
          vec3 c = mix(deep, mid, smoothstep(0., 1., nv) * .55 + .1);
          float lit = clamp(dot(normalize(vN), uSun), 0., 1.);
          c += vec3(.05,.2,.22) * pow(lit, 1.6);
          c = mix(c, edge, rim * .7);
          c += vec3(1.,.93,.8) * pow(1. - nv, 7.) * .4 * (.4 + lit);       // thin glassy outline, warmer toward the sun
          c += vec3(1.,.9,.7) * pow(max(dot(reflect(-uSun, normalize(vN)), normalize(vV)), 0.), 38.) * .35;
          gl_FragColor = vec4(c, 1.);
        }`,
    }),
  );
  globe.add(body);
  // Invisible-in-the-main-pass occluder: in the glow pass it hides everything on the far side of the planet.
  const occ = new THREE.Mesh(new THREE.SphereGeometry(0.998, 64, 48), new THREE.MeshBasicMaterial({ color: 0x000000 }));
  occ.layers.set(1);
  globe.add(occ);

  // Continents as a dot matrix (Fibonacci lattice sampled against the land mask).
  const pts = [], N = 9200, GA = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = GA * i;
    const lat = THREE.MathUtils.radToDeg(Math.asin(y));
    const x = Math.cos(th) * r, z = Math.sin(th) * r;
    // invert toXYZ: lon from (x,z)
    const lon = THREE.MathUtils.radToDeg(Math.atan2(z, -x)) - 180;
    const lw = ((lon + 540) % 360) - 180;
    if (isLand(lat, lw)) pts.push(x * 1.004, y * 1.004, z * 1.004);
  }
  const dotGeo = new THREE.BufferGeometry();
  dotGeo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  const dots = new THREE.Points(dotGeo, new THREE.ShaderMaterial({
    uniforms: { ...uniforms, uSize: { value: 0.0155 }, uColor: { value: TEAL } },
    transparent: true, depthWrite: false,
    vertexShader: `uniform float uPx, uSize; varying float vF;
      void main(){ vec4 mv = modelViewMatrix * vec4(position,1.);
        vec3 n = normalize(normalMatrix * position); vF = clamp(dot(n, normalize(-mv.xyz)), 0., 1.);
        gl_PointSize = uSize * uPx / -mv.z; gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `uniform vec3 uColor; uniform float uPulse; varying float vF;
      void main(){ vec2 p = gl_PointCoord - .5; float d = length(p); if (d > .5) discard;
        float a = smoothstep(.5, .28, d) * smoothstep(.0, .38, vF);
        gl_FragColor = vec4(uColor * (.65 + .6 * vF + uPulse * .5), min(1., a * (.35 + .65 * vF) * (1. + uPulse * .8))); }`,
  }));
  dots.layers.enable(1); // layer 1 = the glow pass
  globe.add(dots);

  // Graticule
  const grat = [];
  const ring = (fn, n = 128) => { for (let i = 0; i < n; i++) { const a = fn(i / n), b = fn((i + 1) / n); grat.push(a.x, a.y, a.z, b.x, b.y, b.z); } };
  for (let lat = -60; lat <= 60; lat += 30) ring((t) => toXYZ(lat, t * 360 - 180, 1.002));
  for (let lon = -180; lon < 180; lon += 30) ring((t) => toXYZ(t * 180 - 90, lon, 1.002), 64);
  const gGeo = new THREE.BufferGeometry();
  gGeo.setAttribute("position", new THREE.Float32BufferAttribute(grat, 3));
  globe.add(new THREE.LineSegments(gGeo, new THREE.LineBasicMaterial({ color: TEAL, transparent: true, opacity: 0.09, depthWrite: false })));

  // City markers
  const cityPos = [], cityPhase = [];
  Object.values(CITIES).forEach(([la, lo], i) => { const p = toXYZ(la, lo, 1.008); cityPos.push(p.x, p.y, p.z); cityPhase.push(i * 0.9); });
  const cGeo = new THREE.BufferGeometry();
  cGeo.setAttribute("position", new THREE.Float32BufferAttribute(cityPos, 3));
  cGeo.setAttribute("phase", new THREE.Float32BufferAttribute(cityPhase, 1));
  const cities = new THREE.Points(cGeo, new THREE.ShaderMaterial({
    uniforms: { ...uniforms, uColor: { value: GOLD } },
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `uniform float uPx, uTime; attribute float phase; varying float vP; varying float vF;
      void main(){ vec4 mv = modelViewMatrix * vec4(position,1.);
        vec3 n = normalize(normalMatrix * position); vF = clamp(dot(n, normalize(-mv.xyz)), 0., 1.);
        vP = fract(uTime * .35 + phase);
        gl_PointSize = (.065 + .09 * vP) * uPx / -mv.z; gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `uniform vec3 uColor; varying float vP; varying float vF;
      void main(){ float d = length(gl_PointCoord - .5) * 2.; if (d > 1.) discard;
        float core = smoothstep(.28, .0, d), ringA = smoothstep(.12, .0, abs(d - (.35 + .6 * vP))) * (1. - vP);
        gl_FragColor = vec4(uColor, (core * .95 + ringA * .8) * smoothstep(.1, .4, vF)); }`,
  }));
  cities.layers.enable(1);
  globe.add(cities);

  // Arcs
  const arcMat = new THREE.ShaderMaterial({
    uniforms: { ...uniforms, uColor: { value: GOLD } },
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `attribute float t; attribute float off; varying float vT; varying float vO; varying float vF;
      void main(){ vT = t; vO = off; vec4 mv = modelViewMatrix * vec4(position,1.);
        vec3 n = normalize(normalMatrix * normalize(position)); vF = clamp(dot(n, normalize(-mv.xyz)) * 2.2 + .2, 0., 1.);
        gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `uniform vec3 uColor; uniform float uTime; uniform float uPulse; varying float vT; varying float vO; varying float vF;
      void main(){ float head = fract(uTime * .16 + vO);
        float d = fract(head - vT + 1.); float pulse = exp(-d * 9.) * step(vT, head + .0001) ;
        float a = (.38 + .8 * pulse + uPulse * .9) * sin(3.14159 * vT) * vF;
        gl_FragColor = vec4(uColor, a); }`,
  });
  ARCS.forEach(([a, b], k) => {
    const A = toXYZ(...CITIES[a]), B = toXYZ(...CITIES[b]);
    const ang = A.angleTo(B), lift = 0.04 + 0.22 * Math.min(1, ang / 1.6), seg = 64;
    const P = [], T = [], O = [];
    for (let i = 0; i <= seg; i++) {
      const u = i / seg;
      const v = A.clone().lerp(B, u).normalize().multiplyScalar(1.006 + lift * Math.sin(Math.PI * u));
      P.push(v.x, v.y, v.z); T.push(u); O.push((k * 0.37) % 1);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(P, 3));
    g.setAttribute("t", new THREE.Float32BufferAttribute(T, 1));
    g.setAttribute("off", new THREE.Float32BufferAttribute(O, 1));
    const line = new THREE.Line(g, arcMat); line.layers.enable(1); globe.add(line);
  });

  // Atmosphere
  const atmo = new THREE.Mesh(new THREE.SphereGeometry(1.1, 64, 48), new THREE.ShaderMaterial({
    side: THREE.BackSide, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `varying vec3 vN; void main(){ vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`,
    fragmentShader: `varying vec3 vN; void main(){ float i = pow(max(.74 - dot(vN, vec3(0.,0.,1.)), 0.), 4.);
      gl_FragColor = vec4(mix(vec3(.4,.8,.76), vec3(1.,.86,.55), .3), i * .4); }`,
  }));
  scene.add(atmo);

  // Bloom for a transparent canvas: render only the glowing layers to a half-res buffer and blur it once in two directions,
  // then add it back over the frame. (three's UnrealBloomPass drops alpha, which would paint a box around the globe.)
  const rtOpts = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat };
  const rtA = new THREE.WebGLRenderTarget(8, 8, { ...rtOpts, depthBuffer: true }), rtB = new THREE.WebGLRenderTarget(8, 8, { ...rtOpts, depthBuffer: false });
  const quadCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), quadScene = new THREE.Scene();
  const QV = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }`;
  const blurMat = new THREE.ShaderMaterial({
    uniforms: { tDiffuse: { value: null }, uDir: { value: new THREE.Vector2(1, 0) } }, vertexShader: QV, depthTest: false, depthWrite: false,
    fragmentShader: `uniform sampler2D tDiffuse; uniform vec2 uDir; varying vec2 vUv;
      void main(){ vec4 c = texture2D(tDiffuse, vUv) * .227027;
        c += texture2D(tDiffuse, vUv + uDir * 1.3846) * .316216; c += texture2D(tDiffuse, vUv - uDir * 1.3846) * .316216;
        c += texture2D(tDiffuse, vUv + uDir * 3.2308) * .070270; c += texture2D(tDiffuse, vUv - uDir * 3.2308) * .070270; gl_FragColor = c; }`,
  });
  const compMat = new THREE.ShaderMaterial({
    uniforms: { tGlow: { value: null }, uK: { value: 0.6 } }, vertexShader: QV, transparent: true, depthTest: false, depthWrite: false,
    blending: THREE.CustomBlending, blendEquation: THREE.AddEquation, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor, blendSrcAlpha: THREE.OneFactor, blendDstAlpha: THREE.OneFactor,
    fragmentShader: `uniform sampler2D tGlow; uniform float uK; varying vec2 vUv;
      void main(){ vec3 g = texture2D(tGlow, vUv).rgb * uK; gl_FragColor = vec4(g, max(g.r, max(g.g, g.b))); }`,
  });
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), blurMat);
  quad.frustumCulled = false;
  quadScene.add(quad);
  const pass = (mat, src, dst) => { quad.material = mat; if (src) mat.uniforms.tDiffuse.value = src.texture; renderer.setRenderTarget(dst); renderer.render(quadScene, quadCam); };
  const renderGlowed = (strength) => {
    camera.layers.set(0); renderer.setRenderTarget(null); renderer.render(scene, camera);          // 1. the normal frame
    camera.layers.set(1); renderer.setRenderTarget(rtA); renderer.setClearColor(0x000000, 0); renderer.render(scene, camera); camera.layers.set(0); // 2. glow layers only
    const spread = 2.2;
    blurMat.uniforms.uDir.value.set(spread / rtA.width, 0); pass(blurMat, rtA, rtB);              // 3. horizontal + vertical blur
    blurMat.uniforms.uDir.value.set(0, spread / rtA.height); pass(blurMat, rtB, rtA);
    compMat.uniforms.tGlow.value = rtA.texture; compMat.uniforms.uK.value = strength;             // 4. add it back, premultiplied
    quad.material = compMat; renderer.setRenderTarget(null); renderer.autoClear = false; renderer.render(quadScene, quadCam); renderer.autoClear = true;
  };

  // State
  const state = { px: 0, py: 0, cx: 0, cy: 0, scroll: 0, spin: THREE.MathUtils.degToRad(-90 - spinLon), focus: null, pulse: 0, running: false, raf: 0, last: 0, t: 0 };

  const resize = () => {
    const w = canvas.clientWidth || 600, dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, w, false);
    uniforms.uPx.value = (w * dpr) / 2 / Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    const g = Math.max(2, Math.round((w * dpr) / 2)); rtA.setSize(g, g); rtB.setSize(g, g);
  };
  const frame = (now) => {
    const dt = Math.min(0.05, (now - (state.last || now)) / 1000); state.last = now; state.t += dt;
    uniforms.uTime.value = state.t;
    state.cx += (state.px - state.cx) * Math.min(1, dt * 3);
    state.cy += (state.py - state.cy) * Math.min(1, dt * 3);
    if (state.focus == null) state.spin += dt * 0.07;
    else { // glide to the focused region by the shortest way round
      let d = state.focus - state.spin; d = Math.atan2(Math.sin(d), Math.cos(d));
      state.spin += d * Math.min(1, dt * 2.6);
    }
    state.pulse = Math.max(0, state.pulse - dt * 1.1); uniforms.uPulse.value = state.pulse;
    globe.rotation.y = state.spin + state.cx * 0.55 + state.scroll * 1.1;
    root.rotation.x = 0.34 + state.cy * 0.22;
    renderGlowed(0.55 + state.pulse * 0.6);
    if (state.running) state.raf = requestAnimationFrame(frame);
  };
  const api = {
    resize,
    setPointer(nx, ny) { state.px = nx; state.py = ny; },
    setScroll(p) { state.scroll = p; },
    /** Turn the globe to face a longitude (degrees east) and flare the network; focus(null) resumes the slow spin. */
    focus(lon) { state.focus = lon == null ? null : THREE.MathUtils.degToRad(-90 - lon); if (lon != null) state.pulse = 1; },
    pulse() { state.pulse = 1; },
    renderOnce() { state.last = 0; frame(performance.now()); },
    start() { if (state.running) return; state.running = true; state.last = 0; state.raf = requestAnimationFrame(frame); },
    stop() { state.running = false; cancelAnimationFrame(state.raf); },
    dispose() {
      api.stop();
      scene.traverse((o) => { o.geometry?.dispose?.(); o.material?.dispose?.(); });
      rtA.dispose(); rtB.dispose(); blurMat.dispose(); compMat.dispose(); quad.geometry.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
  resize();
  return api;
}
