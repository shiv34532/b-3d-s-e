import * as THREE from 'three';
import { MAJOR_CITIES, ALL_INDIAN_STATES_UTS, SPACE_SATELLITES } from '../data/indiaData.js';

/**
 * Three.js Space Globe Engine
 * Handles outer space rendering, realistic Earth globe with procedural textures,
 * atmospheric Rayleigh glow, orbiting ISRO satellites, and smooth camera flights.
 */
export class SpaceGlobeEngine {
  constructor(container, onCitySelect, onTelemetryUpdate) {
    this.container = container;
    this.onCitySelect = onCitySelect;
    this.onTelemetryUpdate = onTelemetryUpdate;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.globeGroup = null;
    this.earthMesh = null;
    this.cloudsMesh = null;
    this.atmosphereMesh = null;
    this.satellites = [];
    this.cityPins = [];
    this.statePins = [];
    this.sunLight = null;

    this.isTransitioning = false;
    this.targetCameraPos = new THREE.Vector3();
    this.targetLookAt = new THREE.Vector3();
    this.currentLookAt = new THREE.Vector3(0, 0, 0);
    this.transitionProgress = 1;
    this.transitionDuration = 2500; // ms
    this.transitionStartTime = 0;
    this.startCameraPos = new THREE.Vector3();
    this.startLookAt = new THREE.Vector3();

    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.rotationSpeed = { x: 0, y: 0.0008 };
    this.autoRotate = true;
    this.dayNightFactor = 0.5; // 0 = midnight, 0.5 = noon, 1 = midnight

    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.init();
  }

  init() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x02030a, 0.02);

    // Camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 100);
    // Initial position: Deep space looking at India
    this.setCameraToSpaceCoordinates(20.5937, 78.9629, 3.8);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.container.appendChild(this.renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x223355, 0.7);
    this.scene.add(ambientLight);

    this.sunLight = new THREE.DirectionalLight(0xfffaed, 2.8);
    this.sunLight.position.set(5, 3, 5);
    this.scene.add(this.sunLight);

    // Globe root group
    this.globeGroup = new THREE.Group();
    this.scene.add(this.globeGroup);

    // Build space assets
    this.createStarfield();
    this.createEarthGlobe();
    this.createAtmosphereGlow();
    this.createIndiaMarkers();
    this.createSatellites();

    // Event listeners
    this.setupEventListeners();

    // Start render loop
    this.animate();
  }

  createStarfield() {
    const starCount = 3500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    const colorChoices = [
      new THREE.Color(0xffffff),
      new THREE.Color(0xaaccff),
      new THREE.Color(0xffeedd),
      new THREE.Color(0x88ccff),
      new THREE.Color(0xffaa66)
    ];

    for (let i = 0; i < starCount; i++) {
      // Distribute stars on a large sphere radius 35 to 60
      const radius = 35 + Math.random() * 25;
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const starColor = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      colors[i * 3] = starColor.r;
      colors[i * 3 + 1] = starColor.g;
      colors[i * 3 + 2] = starColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true
    });

    const starField = new THREE.Points(geometry, material);
    this.scene.add(starField);

    // Subtle Milky Way nebula glow particles
    this.createNebulaBand();
  }

  createNebulaBand() {
    const nebulaCount = 800;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(nebulaCount * 3);
    const colors = new Float32Array(nebulaCount * 3);

    for (let i = 0; i < nebulaCount; i++) {
      const angle = (i / nebulaCount) * Math.PI * 2;
      const radius = 45 + (Math.random() - 0.5) * 6;
      const y = (Math.random() - 0.5) * 8 + Math.sin(angle * 2) * 4;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      colors[i * 3] = 0.2 + Math.random() * 0.2;
      colors[i * 3 + 1] = 0.3 + Math.random() * 0.3;
      colors[i * 3 + 2] = 0.6 + Math.random() * 0.4;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 1.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });

    const nebula = new THREE.Points(geometry, material);
    this.scene.add(nebula);
  }

  createEarthGlobe() {
    const earthRadius = 1.0;
    const sphereGeo = new THREE.SphereGeometry(earthRadius, 64, 64);

    // Procedural High-Detail Earth Texture Canvas
    const { surfaceTexture, bumpTexture, lightsTexture } = this.generateProceduralEarthTextures();

    // Realistic Material with Night Lights & Bump
    const earthMaterial = new THREE.MeshStandardMaterial({
      map: surfaceTexture,
      bumpMap: bumpTexture,
      bumpScale: 0.03,
      roughness: 0.65,
      metalness: 0.1,
      emissive: new THREE.Color(0xffdf88),
      emissiveMap: lightsTexture,
      emissiveIntensity: 0.6
    });

    this.earthMesh = new THREE.Mesh(sphereGeo, earthMaterial);
    this.globeGroup.add(this.earthMesh);

    // Cloud Layer
    const cloudsGeo = new THREE.SphereGeometry(earthRadius * 1.015, 64, 64);
    const cloudsTexture = this.generateCloudsTexture();
    const cloudsMaterial = new THREE.MeshStandardMaterial({
      map: cloudsTexture,
      transparent: true,
      opacity: 0.38,
      blending: THREE.AdditiveBlending,
      roughness: 0.9
    });

    this.cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMaterial);
    this.globeGroup.add(this.cloudsMesh);
  }

  createAtmosphereGlow() {
    const atmosRadius = 1.0;
    const atmosGeo = new THREE.SphereGeometry(atmosRadius * 1.15, 48, 48);

    // Custom Fresnel Atmosphere Shader
    const vertexShader = `
      varying vec3 vNormal;
      varying vec3 vPositionNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPositionNormal = normalize((modelViewMatrix * vec4(position, 1.0)).xyz);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      varying vec3 vNormal;
      varying vec3 vPositionNormal;
      void main() {
        float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
        vec3 atmosphereColor = vec3(0.15, 0.55, 0.98); // Rayleigh blue glow
        gl_FragColor = vec4(atmosphereColor, intensity * 0.85);
      }
    `;

    const atmosMat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });

    this.atmosphereMesh = new THREE.Mesh(atmosGeo, atmosMat);
    this.globeGroup.add(this.atmosphereMesh);
  }

  generateProceduralEarthTextures() {
    const width = 2048;
    const height = 1024;

    // 1. Surface Texture Canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Ocean gradient base
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, height);
    oceanGrad.addColorStop(0, '#0a2342'); // Arctic
    oceanGrad.addColorStop(0.2, '#0d3268');
    oceanGrad.addColorStop(0.5, '#0c3875'); // Equatorial Indian Ocean & Pacific
    oceanGrad.addColorStop(0.8, '#0d3268');
    oceanGrad.addColorStop(1, '#0a2342'); // Antarctic
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Bump Map Canvas
    const bumpCanvas = document.createElement('canvas');
    bumpCanvas.width = width;
    bumpCanvas.height = height;
    const bCtx = bumpCanvas.getContext('2d');
    bCtx.fillStyle = '#808080';
    bCtx.fillRect(0, 0, width, height);

    // 3. Night Lights Canvas
    const lightsCanvas = document.createElement('canvas');
    lightsCanvas.width = width;
    lightsCanvas.height = height;
    const lCtx = lightsCanvas.getContext('2d');
    lCtx.fillStyle = '#000000';
    lCtx.fillRect(0, 0, width, height);

    // Helper: convert Lat/Lng to Canvas X/Y (Equirectangular)
    const toXY = (lat, lng) => {
      const x = ((lng + 180) / 360) * width;
      const y = ((90 - lat) / 180) * height;
      return { x, y };
    };

    // Draw Major Continents
    const continents = [
      // Eurasia
      {
        poly: [
          [70, -10], [72, 60], [70, 140], [60, 170], [40, 140], [30, 120], [10, 105], [5, 100],
          [20, 90], [25, 60], [35, 50], [42, 28], [36, -5], [45, -8], [55, 5], [65, 15]
        ],
        color: '#2e492b',
        bump: '#aaaaaa'
      },
      // Africa
      {
        poly: [
          [35, -5], [32, 32], [12, 50], [-4, 40], [-25, 33], [-34, 18], [-20, 12], [5, 2], [15, -16]
        ],
        color: '#4a442d',
        bump: '#999999'
      },
      // Australia
      {
        poly: [
          [-12, 130], [-15, 145], [-28, 153], [-37, 148], [-35, 115], [-20, 115]
        ],
        color: '#6e563b',
        bump: '#999999'
      },
      // Americas
      {
        poly: [
          [70, -160], [70, -70], [50, -60], [30, -80], [25, -98], [15, -92], [8, -78],
          [-10, -78], [-20, -70], [-55, -67], [-50, -75], [-20, -40], [5, -50], [12, -75]
        ],
        color: '#344c2f',
        bump: '#999999'
      }
    ];

    continents.forEach(c => {
      ctx.beginPath();
      bCtx.beginPath();
      c.poly.forEach(([lat, lng], idx) => {
        const pt = toXY(lat, lng);
        if (idx === 0) {
          ctx.moveTo(pt.x, pt.y);
          bCtx.moveTo(pt.x, pt.y);
        } else {
          ctx.lineTo(pt.x, pt.y);
          bCtx.lineTo(pt.x, pt.y);
        }
      });
      ctx.closePath();
      bCtx.closePath();
      ctx.fillStyle = c.color;
      ctx.fill();
      bCtx.fillStyle = c.bump;
      bCtx.fill();
    });

    // Detailed Outline of Indian Subcontinent
    // (Gujarat, Arabian Sea coast, Kerala, Tamil Nadu tip, Coromandel coast, Bengal delta, Himalayas, Kashmir, Rajasthan)
    const indiaPolygon = [
      [36.5, 74.0], // Northernmost Kashmir / Karakoram
      [34.5, 78.5], // Ladakh
      [31.5, 79.5], // Himachal / Uttarakhand
      [28.0, 88.5], // Sikkim / Nepal border
      [27.8, 97.0], // Arunachal eastern tip
      [25.0, 94.5], // Nagaland / Manipur
      [22.0, 92.5], // Mizoram
      [21.8, 89.0], // Sundarbans / Bengal
      [19.8, 86.0], // Odisha coast
      [16.0, 81.5], // Andhra coast
      [13.1, 80.3], // Chennai / Coromandel
      [9.5, 79.0],  // Palk Strait
      [8.08, 77.5], // Kanyakumari (Southernmost mainland tip)
      [9.9, 76.2],  // Kerala coast (Kochi)
      [15.0, 73.8], // Goa coast
      [19.0, 72.8], // Mumbai / Konkan
      [20.8, 72.8], // Gulf of Khambhat
      [22.3, 69.0], // Dwarka / Kathiawar peninsula
      [23.8, 68.5], // Rann of Kutch
      [27.0, 71.0], // Thar Desert / Rajasthan
      [31.5, 74.5], // Punjab plains
      [34.0, 74.8]  // Kashmir Valley
    ];

    // Draw India Subcontinent Base
    ctx.beginPath();
    bCtx.beginPath();
    indiaPolygon.forEach(([lat, lng], idx) => {
      const pt = toXY(lat, lng);
      if (idx === 0) {
        ctx.moveTo(pt.x, pt.y);
        bCtx.moveTo(pt.x, pt.y);
      } else {
        ctx.lineTo(pt.x, pt.y);
        bCtx.lineTo(pt.x, pt.y);
      }
    });
    ctx.closePath();
    bCtx.closePath();

    // Vibrant Terrain Gradient across India (Himalayan snow -> Indo-Gangetic lush green -> Deccan plateau gold -> Western Ghats emerald)
    const indPtNorth = toXY(36.0, 77.0);
    const indPtSouth = toXY(8.0, 77.0);
    const indGrad = ctx.createLinearGradient(indPtNorth.x, indPtNorth.y, indPtSouth.x, indPtSouth.y);
    indGrad.addColorStop(0.0, '#f2f7fc'); // Himalayan Snow
    indGrad.addColorStop(0.12, '#386641'); // Himalayan foothills & Terai
    indGrad.addColorStop(0.28, '#4a7c36'); // Indo-Gangetic lush agriculture
    indGrad.addColorStop(0.55, '#8c7836'); // Deccan plateau
    indGrad.addColorStop(0.85, '#2e5b32'); // Western & Eastern Ghats lush canopy
    indGrad.addColorStop(1.0, '#265430'); // Cape Comorin
    ctx.fillStyle = indGrad;
    ctx.fill();

    // Subcontinent Glowing Boundary
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Himalayan High-Elevation Bump
    bCtx.fillStyle = '#ffffff';
    bCtx.fill();

    // Night Lights in India (Clusters for Mega-Cities)
    const drawCityGlow = (lat, lng, radius, intensity = 1.0) => {
      const { x, y } = toXY(lat, lng);
      const glow = lCtx.createRadialGradient(x, y, 1, x, y, radius);
      glow.addColorStop(0, `rgba(255, 230, 150, ${intensity})`);
      glow.addColorStop(0.4, `rgba(255, 170, 50, ${intensity * 0.7})`);
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      lCtx.fillStyle = glow;
      lCtx.beginPath();
      lCtx.arc(x, y, radius, 0, Math.PI * 2);
      lCtx.fill();
    };

    // Populate lights for Indian Metros
    drawCityGlow(28.6139, 77.2090, 16, 1.0); // Delhi NCR
    drawCityGlow(18.9220, 72.8347, 18, 1.0); // Mumbai MMR
    drawCityGlow(12.9716, 77.5946, 14, 0.95); // Bengaluru
    drawCityGlow(17.3850, 78.4867, 13, 0.9); // Hyderabad
    drawCityGlow(13.0827, 80.2707, 14, 0.9); // Chennai
    drawCityGlow(22.5726, 88.3639, 15, 0.95); // Kolkata
    drawCityGlow(23.0225, 72.5714, 12, 0.85); // Ahmedabad
    drawCityGlow(26.9124, 75.7873, 10, 0.8); // Jaipur
    drawCityGlow(26.8467, 80.9462, 10, 0.8); // Lucknow
    drawCityGlow(18.5204, 73.8567, 11, 0.85); // Pune
    drawCityGlow(25.3176, 82.9739, 8, 0.8); // Varanasi
    drawCityGlow(31.6200, 74.8765, 8, 0.75); // Amritsar
    drawCityGlow(9.9312, 76.2673, 9, 0.8); // Kochi

    // Global lights for context (London, Tokyo, NY, Dubai)
    drawCityGlow(51.5, -0.12, 10, 0.8);
    drawCityGlow(35.6, 139.6, 14, 0.9);
    drawCityGlow(40.7, -74.0, 14, 0.9);
    drawCityGlow(25.2, 55.2, 11, 0.85);

    const surfaceTexture = new THREE.CanvasTexture(canvas);
    surfaceTexture.anisotropy = 8;

    const bumpTexture = new THREE.CanvasTexture(bumpCanvas);
    const lightsTexture = new THREE.CanvasTexture(lightsCanvas);

    return { surfaceTexture, bumpTexture, lightsTexture };
  }

  generateCloudsTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Procedural soft cloud bands (Intertropical Convergence Zone, Monsoon swirl over Bay of Bengal)
    const drawCloudCluster = (cx, cy, rx, ry, opacity) => {
      const grad = ctx.createRadialGradient(cx, cy, 5, cx, cy, rx);
      grad.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
      grad.addColorStop(0.5, `rgba(255, 255, 255, ${opacity * 0.5})`);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, Math.PI / 6, 0, Math.PI * 2);
      ctx.fill();
    };

    // Draw realistic cloud clusters
    for (let i = 0; i < 45; i++) {
      const x = Math.random() * canvas.width;
      const y = (0.2 + Math.random() * 0.6) * canvas.height;
      drawCloudCluster(x, y, 40 + Math.random() * 60, 20 + Math.random() * 30, 0.35 + Math.random() * 0.3);
    }

    // Southwest Monsoon swirl over Indian Ocean / Bay of Bengal
    drawCloudCluster(750, 230, 110, 60, 0.5);
    drawCloudCluster(720, 260, 90, 45, 0.45);

    return new THREE.CanvasTexture(canvas);
  }

  // Convert Latitude & Longitude on Earth Sphere (radius r) to 3D Cartesian coordinates
  latLngToVector3(lat, lng, radius = 1.0) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);

    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);

    return new THREE.Vector3(x, y, z);
  }

  createIndiaMarkers() {
    // 1. Major Cities 3D Glowing Beacons
    MAJOR_CITIES.forEach(city => {
      const pos = this.latLngToVector3(city.lat, city.lng, 1.006);

      // Pin group
      const pinGroup = new THREE.Group();
      pinGroup.position.copy(pos);

      // Orient pin outward from globe center
      pinGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pos.clone().normalize());

      // Beacon Pole
      const poleGeo = new THREE.CylinderGeometry(0.003, 0.003, 0.05, 8);
      const poleMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff });
      const poleMesh = new THREE.Mesh(poleGeo, poleMat);
      poleMesh.position.y = 0.025;
      pinGroup.add(poleMesh);

      // Glowing Beacon Orb
      const orbGeo = new THREE.SphereGeometry(0.012, 16, 16);
      const orbMat = new THREE.MeshBasicMaterial({ color: 0xff9933 }); // Indian Saffron
      const orbMesh = new THREE.Mesh(orbGeo, orbMat);
      orbMesh.position.y = 0.05;
      orbMesh.userData = { isCityPin: true, cityData: city };
      pinGroup.add(orbMesh);

      // Halo ring
      const ringGeo = new THREE.RingGeometry(0.012, 0.022, 16);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x00e5ff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.position.y = 0.005;
      pinGroup.add(ringMesh);

      this.globeGroup.add(pinGroup);
      this.cityPins.push({ group: pinGroup, orbMesh, ringMesh, data: city });
    });

    // 2. State & UT Subtle Markers
    ALL_INDIAN_STATES_UTS.forEach(state => {
      const pos = this.latLngToVector3(state.lat, state.lng, 1.004);
      const markerGeo = new THREE.SphereGeometry(0.005, 8, 8);
      const markerMat = new THREE.MeshBasicMaterial({
        color: 0x138808, // Indian Green
        transparent: true,
        opacity: 0.65
      });
      const markerMesh = new THREE.Mesh(markerGeo, markerMat);
      markerMesh.position.copy(pos);
      markerMesh.userData = { isStateMarker: true, stateData: state };

      this.globeGroup.add(markerMesh);
      this.statePins.push(markerMesh);
    });
  }

  createSatellites() {
    SPACE_SATELLITES.forEach(sat => {
      const satGroup = new THREE.Group();

      // Satellite body
      const bodyGeo = new THREE.BoxGeometry(0.03, 0.03, 0.04);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: 0xdddddd,
        metalness: 0.8,
        roughness: 0.2
      });
      const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
      satGroup.add(bodyMesh);

      // Solar Panels
      const panelGeo = new THREE.BoxGeometry(0.12, 0.02, 0.002);
      const panelMat = new THREE.MeshStandardMaterial({
        color: 0x0033aa,
        roughness: 0.3,
        metalness: 0.6
      });
      const panelMesh = new THREE.Mesh(panelGeo, panelMat);
      satGroup.add(panelMesh);

      // Telemetry Beacon Glow
      const beaconGeo = new THREE.SphereGeometry(0.008, 8, 8);
      const beaconMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(sat.color) });
      const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
      beaconMesh.position.y = 0.02;
      satGroup.add(beaconMesh);

      // Orbit track line
      const orbitCurve = new THREE.EllipseCurve(
        0, 0,
        sat.orbitRadius, sat.orbitRadius,
        0, 2 * Math.PI,
        false,
        0
      );
      const points = orbitCurve.getPoints(64);
      const orbitGeo = new THREE.BufferGeometry().setFromPoints(
        points.map(p => new THREE.Vector3(p.x, 0, p.y))
      );
      const orbitMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(sat.color),
        transparent: true,
        opacity: 0.25
      });
      const orbitLine = new THREE.Line(orbitGeo, orbitMat);
      orbitLine.rotation.x = sat.inclination;
      this.scene.add(orbitLine);

      this.scene.add(satGroup);
      this.satellites.push({
        group: satGroup,
        data: sat,
        orbitRadius: sat.orbitRadius,
        speed: sat.speed,
        inclination: sat.inclination,
        angle: Math.random() * Math.PI * 2
      });
    });
  }

  setCameraToSpaceCoordinates(lat, lng, distance = 3.5) {
    const targetPos = this.latLngToVector3(lat, lng, distance);
    this.camera.position.copy(targetPos);
    this.camera.lookAt(0, 0, 0);
    this.currentLookAt.set(0, 0, 0);
  }

  flyToLocation(lat, lng, altitudeFactor = 1.35, duration = 2800) {
    this.isTransitioning = true;
    this.transitionProgress = 0;
    this.transitionDuration = duration;
    this.transitionStartTime = performance.now();

    this.startCameraPos.copy(this.camera.position);
    this.startLookAt.copy(this.currentLookAt);

    // Calculate final camera position
    // As we zoom closer, add camera tilt for a dramatic 3D fly-in
    const targetGround = this.latLngToVector3(lat, lng, 1.0);
    const targetCam = this.latLngToVector3(lat - 3.5, lng, altitudeFactor);

    this.targetCameraPos.copy(targetCam);
    this.targetLookAt.copy(targetGround);

    // Temporarily pause auto-rotation during flight
    this.autoRotate = false;
  }

  setupEventListeners() {
    const dom = this.renderer.domElement;

    // Pointer dragging for rotation
    dom.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
      this.autoRotate = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        const deltaX = e.clientX - this.previousMousePosition.x;
        const deltaY = e.clientY - this.previousMousePosition.y;

        this.globeGroup.rotation.y += deltaX * 0.005;
        this.globeGroup.rotation.x += deltaY * 0.005;

        // Clamp x rotation to avoid flip
        this.globeGroup.rotation.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, this.globeGroup.rotation.x));

        this.previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    // Touch support for mobile/tablets
    dom.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        this.autoRotate = false;
      }
    });

    dom.addEventListener('touchmove', (e) => {
      if (this.isDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - this.previousMousePosition.x;
        const deltaY = e.touches[0].clientY - this.previousMousePosition.y;
        this.globeGroup.rotation.y += deltaX * 0.006;
        this.globeGroup.rotation.x += deltaY * 0.006;
        this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    });

    dom.addEventListener('touchend', () => {
      this.isDragging = false;
    });

    // Wheel zooming
    dom.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomSpeed = 0.002;
      const curDist = this.camera.position.length();
      const newDist = Math.max(1.15, Math.min(6.0, curDist + e.deltaY * zoomSpeed));
      this.camera.position.setLength(newDist);
    }, { passive: false });

    // Click Raycasting for City and State Pins
    dom.addEventListener('click', (e) => {
      const rect = dom.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.globeGroup.children, true);

      for (let hit of intersects) {
        if (hit.object.userData && hit.object.userData.isCityPin) {
          const city = hit.object.userData.cityData;
          if (this.onCitySelect) this.onCitySelect(city);
          break;
        } else if (hit.object.userData && hit.object.userData.isStateMarker) {
          const state = hit.object.userData.stateData;
          this.flyToLocation(state.lat, state.lng, 1.45, 2200);
          break;
        }
      }
    });

    // Window Resize
    window.addEventListener('resize', () => this.onResize());
  }

  onResize() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  setDayNightLighting(factor) {
    // factor from 0.0 (midnight) to 0.5 (noon) to 1.0 (midnight)
    this.dayNightFactor = factor;
    const angle = factor * Math.PI * 2;
    this.sunLight.position.set(Math.sin(angle) * 8, 3, Math.cos(angle) * 8);

    // Update emissive intensity of night lights when sun is away
    if (this.earthMesh && this.earthMesh.material) {
      const nightStrength = 0.3 + (1.0 - Math.abs(factor - 0.5) * 2) * 0.7;
      this.earthMesh.material.emissiveIntensity = nightStrength;
    }
  }

  setAltitude(km) {
    // Map altitude in km (500 km to 20,000 km) to 3D distance (1.15 to 4.5)
    const normalized = Math.min(1.0, Math.max(0.0, (km - 200) / 19800));
    const dist = 1.15 + normalized * (4.5 - 1.15);
    this.camera.position.setLength(dist);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // Auto-rotate globe slowly when idle
    if (this.autoRotate && !this.isTransitioning) {
      this.globeGroup.rotation.y += this.rotationSpeed.y;
    }

    // Clouds drift slowly
    if (this.cloudsMesh) {
      this.cloudsMesh.rotation.y += 0.0003;
    }

    // Animate Satellites in Orbit
    this.satellites.forEach(sat => {
      sat.angle += sat.speed;
      const x = Math.cos(sat.angle) * sat.orbitRadius;
      const z = Math.sin(sat.angle) * sat.orbitRadius;
      const y = Math.sin(sat.angle) * Math.sin(sat.inclination) * (sat.orbitRadius * 0.4);

      sat.group.position.set(x, y, z);
      sat.group.rotation.y += 0.02;
    });

    // Animate City Beacons (gentle pulsing rings)
    const pulseScale = 1.0 + Math.sin(elapsedTime * 4) * 0.25;
    this.cityPins.forEach(pin => {
      pin.ringMesh.scale.set(pulseScale, pulseScale, pulseScale);
    });

    // Handle Camera Flight Tweening
    if (this.isTransitioning) {
      const now = performance.now();
      const elapsed = now - this.transitionStartTime;
      this.transitionProgress = Math.min(1.0, elapsed / this.transitionDuration);

      // Smooth easeInOutCubic curve
      const t = this.transitionProgress < 0.5
        ? 4 * this.transitionProgress * this.transitionProgress * this.transitionProgress
        : 1 - Math.pow(-2 * this.transitionProgress + 2, 3) / 2;

      this.camera.position.lerpVectors(this.startCameraPos, this.targetCameraPos, t);
      this.currentLookAt.lerpVectors(this.startLookAt, this.targetLookAt, t);
      this.camera.lookAt(this.currentLookAt);

      if (this.transitionProgress >= 1.0) {
        this.isTransitioning = false;
      }
    }

    // Emit live telemetry to HUD
    if (this.onTelemetryUpdate) {
      const dist = this.camera.position.length();
      const altitudeKm = Math.round((dist - 1.0) * 6371);
      const speedKmH = this.isTransitioning ? 28400 : 0;
      this.onTelemetryUpdate({
        altitudeKm,
        speedKmH,
        cameraX: this.camera.position.x.toFixed(2),
        cameraY: this.camera.position.y.toFixed(2),
        cameraZ: this.camera.position.z.toFixed(2)
      });
    }

    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    if (this.renderer && this.renderer.domElement) {
      this.container.removeChild(this.renderer.domElement);
      this.renderer.dispose();
    }
  }
}
