import * as THREE from 'three';

/**
 * City3DScene (Awwwards / AAA-Tier 3D City & Monument Engine)
 * Renders rich, fully animated 3D architectural landmarks, illuminated skylines,
 * multi-lane laser traffic streams, animated water reflections, and cinematic drone camera choreography.
 */
export class City3DScene {
  constructor(container, onTelemetryUpdate) {
    this.container = container;
    this.onTelemetryUpdate = onTelemetryUpdate;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.cityGroup = null;
    this.monumentGroup = null;
    this.trafficSystems = [];
    this.waterMesh = null;
    this.spotlights = [];

    this.currentCity = null;
    this.orbitRadius = 380;
    this.orbitAngle = 0;
    this.orbitSpeed = 0.0035;
    this.isAutoOrbit = true;
    this.cameraElevation = 160;
    this.cameraTarget = new THREE.Vector3(0, 35, 0);

    this.isDragging = false;
    this.prevMouse = { x: 0, y: 0 };
    this.clock = new THREE.Clock();

    this.init();
  }

  init() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x040814);
    this.scene.fog = new THREE.FogExp2(0x060c1c, 0.0016);

    // Camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 4000);
    this.camera.position.set(0, this.cameraElevation, this.orbitRadius);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.4;
    this.container.appendChild(this.renderer.domElement);

    // Dynamic Lighting
    this.setupLighting();

    // Scene Groups
    this.cityGroup = new THREE.Group();
    this.scene.add(this.cityGroup);

    this.setupEventListeners();
    this.animate();
  }

  setupLighting() {
    // Ambient hemisphere light (cool sky, warm ground)
    this.hemiLight = new THREE.HemisphereLight(0x446699, 0x111c2e, 0.9);
    this.scene.add(this.hemiLight);

    // Sun / Moon Key Directional Light
    this.sunLight = new THREE.DirectionalLight(0xffecd0, 2.5);
    this.sunLight.position.set(250, 450, 200);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 50;
    this.sunLight.shadow.camera.far = 1000;
    const d = 400;
    this.sunLight.shadow.camera.left = -d;
    this.sunLight.shadow.camera.right = d;
    this.sunLight.shadow.camera.top = d;
    this.sunLight.shadow.camera.bottom = -d;
    this.sunLight.shadow.bias = -0.0005;
    this.scene.add(this.sunLight);

    // Ambient fill light
    this.fillLight = new THREE.DirectionalLight(0x00e5ff, 0.6);
    this.fillLight.position.set(-200, 150, -200);
    this.scene.add(this.fillLight);
  }

  loadCity(cityData) {
    this.currentCity = cityData;

    // Clean up previous city objects and lights
    while (this.cityGroup.children.length > 0) {
      const obj = this.cityGroup.children[0];
      this.cityGroup.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
        else obj.material.dispose();
      }
    }
    this.trafficSystems = [];
    this.spotlights = [];

    // Reset camera orbit parameters
    this.orbitRadius = 380;
    this.orbitAngle = 0;
    this.cameraElevation = 150;
    this.cameraTarget.set(0, 32, 0);

    // 1. Build Cyber-Realistic Ground Grid & Reflective Waterway
    this.buildGroundAndEnvironment(cityData);

    // 2. Build High-Detail 3D Architectural Monument
    this.monumentGroup = new THREE.Group();
    this.buildArchitecturalMonument(cityData);
    this.cityGroup.add(this.monumentGroup);

    // 3. Build Animated City Skyline with Lit Windows & Rooftop Beacons
    this.buildFuturisticSkyline(cityData);

    // 4. Build Multi-lane Animated Traffic Light Streams
    this.buildLaserTrafficStreams();

    // 5. Add Volumetric Dramatic Spotlights on the Monument
    this.buildMonumentSpotlights();
  }

  buildGroundAndEnvironment(city) {
    // 1. Base Terrain Ground Plane
    const groundGeo = new THREE.PlaneGeometry(1600, 1600, 48, 48);
    let groundColor = 0x0c1220;
    let gridColor = 0x00e5ff;

    if (city.id === 'jaipur') {
      groundColor = 0x1f1412; // Rajasthan red sandstone ground
      gridColor = 0xff9933;
    } else if (city.id === 'leh' || city.id === 'srinagar') {
      groundColor = 0x141a24;
      gridColor = 0x88ccff;
    }

    const groundMat = new THREE.MeshStandardMaterial({
      color: groundColor,
      roughness: 0.85,
      metalness: 0.2
    });

    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.cityGroup.add(ground);

    // 2. Cybernetic Holographic Ground Grid Rings
    const gridHelper = new THREE.GridHelper(1200, 60, gridColor, 0x182845);
    gridHelper.position.y = 0.2;
    this.cityGroup.add(gridHelper);

    // Concentric glowing radar rings around the landmark
    for (let r of [80, 180, 300]) {
      const ringGeo = new THREE.RingGeometry(r - 0.8, r + 0.8, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: gridColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.35
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.3;
      this.cityGroup.add(ring);
    }

    // 3. Reflective Water Basin / River / Ocean Coastline
    const hasWater = ['mumbai', 'delhi', 'agra', 'varanasi', 'kolkata', 'chennai', 'kochi', 'srinagar'].includes(city.id);
    if (hasWater) {
      const waterGeo = new THREE.PlaneGeometry(1600, 340);
      const waterMat = new THREE.MeshStandardMaterial({
        color: 0x082548,
        roughness: 0.08,
        metalness: 0.95
      });
      this.waterMesh = new THREE.Mesh(waterGeo, waterMat);
      this.waterMesh.rotation.x = -Math.PI / 2;
      this.waterMesh.position.set(0, 0.6, 260);
      this.waterMesh.receiveShadow = true;
      this.cityGroup.add(this.waterMesh);
    }
  }

  buildArchitecturalMonument(city) {
    switch (city.id) {
      case 'agra':
        this.buildTajMahalDetailed();
        break;
      case 'hyderabad':
        this.buildCharminarDetailed();
        break;
      case 'delhi':
        this.buildIndiaGateDetailed();
        break;
      case 'mumbai':
        this.buildGatewayOfIndiaDetailed();
        break;
      case 'bengaluru':
        this.buildVidhanaSoudhaDetailed();
        break;
      case 'jaipur':
        this.buildHawaMahalDetailed();
        break;
      case 'amritsar':
        this.buildGoldenTempleDetailed();
        break;
      case 'varanasi':
        this.buildVaranasiGhatsDetailed();
        break;
      case 'srinagar':
      case 'leh':
        this.buildHimalayanMountainPeaksDetailed();
        break;
      default:
        this.buildMetropolisLandmarkDetailed(city);
        break;
    }
  }

  // 1. Taj Mahal (Agra) - High Quality Marble Architecture
  buildTajMahalDetailed() {
    const group = this.monumentGroup;

    // Materials
    const marbleMat = new THREE.MeshStandardMaterial({
      color: 0xfbfcfe,
      roughness: 0.2,
      metalness: 0.1
    });
    const sandstoneMat = new THREE.MeshStandardMaterial({
      color: 0xa8483b,
      roughness: 0.75,
      metalness: 0.1
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.9,
      roughness: 0.15
    });

    // Elevated Red Sandstone Terrace Base (Plinth)
    const baseGeo = new THREE.BoxGeometry(190, 12, 190);
    const base = new THREE.Mesh(baseGeo, sandstoneMat);
    base.position.y = 6;
    base.castShadow = true;
    base.receiveShadow = true;
    group.add(base);

    // Marble Podium (Second Tier)
    const marblePodiumGeo = new THREE.BoxGeometry(150, 6, 150);
    const marblePodium = new THREE.Mesh(marblePodiumGeo, marbleMat);
    marblePodium.position.y = 12 + 3;
    marblePodium.castShadow = true;
    group.add(marblePodium);

    // Main Mausoleum Body with Chamfered Corners (Octagonal Cube)
    const mainGeo = new THREE.BoxGeometry(78, 54, 78);
    const mainBody = new THREE.Mesh(mainGeo, marbleMat);
    mainBody.position.y = 15 + 27;
    mainBody.castShadow = true;
    group.add(mainBody);

    // Grand Iwan Arches on all 4 faces
    for (let r = 0; r < 4; r++) {
      const archGeo = new THREE.BoxGeometry(32, 42, 4);
      const archMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.9 });
      const arch = new THREE.Mesh(archGeo, archMat);
      const angle = (r * Math.PI) / 2;
      arch.position.set(Math.sin(angle) * 38, 15 + 24, Math.cos(angle) * 38);
      arch.rotation.y = angle;
      group.add(arch);
    }

    // Cylindrical Dome Drum
    const drumGeo = new THREE.CylinderGeometry(24, 24, 14, 32);
    const drum = new THREE.Mesh(drumGeo, marbleMat);
    drum.position.y = 15 + 54 + 7;
    group.add(drum);

    // Main Onion Dome (Bulbous Dome)
    const domeGeo = new THREE.SphereGeometry(26, 32, 28, 0, Math.PI * 2, 0, Math.PI * 0.72);
    const dome = new THREE.Mesh(domeGeo, marbleMat);
    dome.position.y = 15 + 54 + 14;
    dome.castShadow = true;
    group.add(dome);

    // Golden Finial Crown
    const finialGeo = new THREE.ConeGeometry(2.2, 24, 16);
    const finial = new THREE.Mesh(finialGeo, goldMat);
    finial.position.y = 15 + 54 + 38;
    group.add(finial);

    // 4 Corner Chattris (Cupolas around Dome)
    const chattriOffsets = [
      { x: -28, z: -28 }, { x: 28, z: -28 },
      { x: -28, z: 28 }, { x: 28, z: 28 }
    ];
    chattriOffsets.forEach(pos => {
      const cDrum = new THREE.CylinderGeometry(6, 6, 8, 16);
      const cMesh = new THREE.Mesh(cDrum, marbleMat);
      cMesh.position.set(pos.x, 15 + 54 + 4, pos.z);
      group.add(cMesh);

      const cDome = new THREE.SphereGeometry(7, 16, 12);
      const cDomeMesh = new THREE.Mesh(cDome, marbleMat);
      cDomeMesh.position.set(pos.x, 15 + 54 + 9, pos.z);
      group.add(cDomeMesh);
    });

    // 4 Free-standing Corner Minarets with Triple Balconies
    const minaretCorners = [
      { x: -64, z: -64 }, { x: 64, z: -64 },
      { x: -64, z: 64 }, { x: 64, z: 64 }
    ];

    minaretCorners.forEach(pos => {
      // Tapered shaft
      const shaftGeo = new THREE.CylinderGeometry(3.6, 5.2, 88, 20);
      const shaft = new THREE.Mesh(shaftGeo, marbleMat);
      shaft.position.set(pos.x, 15 + 44, pos.z);
      shaft.castShadow = true;
      group.add(shaft);

      // 3 Balcony rings
      for (let b of [28, 56, 84]) {
        const balcGeo = new THREE.CylinderGeometry(5.8, 5.8, 2.5, 16);
        const balc = new THREE.Mesh(balcGeo, marbleMat);
        balc.position.set(pos.x, 15 + b, pos.z);
        group.add(balc);
      }

      // Minaret Dome Cupola & Gilded Spire
      const cupolaGeo = new THREE.SphereGeometry(4.8, 16, 14);
      const cupola = new THREE.Mesh(cupolaGeo, marbleMat);
      cupola.position.set(pos.x, 15 + 88 + 3, pos.z);
      group.add(cupola);

      const mFinial = new THREE.ConeGeometry(1.2, 8, 8);
      const mFinialMesh = new THREE.Mesh(mFinial, goldMat);
      mFinialMesh.position.set(pos.x, 15 + 88 + 9, pos.z);
      group.add(mFinialMesh);
    });

    // Reflecting Pool with Cyan Water & Charbagh Fountain Jets
    const poolGeo = new THREE.BoxGeometry(40, 2, 260);
    const poolMat = new THREE.MeshStandardMaterial({ color: 0x0b3c66, roughness: 0.1, metalness: 0.9 });
    const pool = new THREE.Mesh(poolGeo, poolMat);
    pool.position.set(0, 1.2, 160);
    group.add(pool);

    // Illuminating Warm Amber Spotlights
    const spot = new THREE.PointLight(0xfffae0, 3.5, 220);
    spot.position.set(0, 40, 90);
    group.add(spot);
  }

  // 2. Charminar (Hyderabad) - Detailed 4-Minaret Masterpiece
  buildCharminarDetailed() {
    const group = this.monumentGroup;

    const stuccoMat = new THREE.MeshStandardMaterial({
      color: 0xdfcb9f,
      roughness: 0.72,
      metalness: 0.15
    });
    const darkArchMat = new THREE.MeshStandardMaterial({
      color: 0x28231c,
      roughness: 0.9
    });
    const goldTrimMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.85,
      roughness: 0.2
    });

    // Base Square Citadel Body (Two Tiers)
    const baseLowerGeo = new THREE.BoxGeometry(64, 28, 64);
    const baseLower = new THREE.Mesh(baseLowerGeo, stuccoMat);
    baseLower.position.y = 14;
    baseLower.castShadow = true;
    group.add(baseLower);

    const baseUpperGeo = new THREE.BoxGeometry(58, 22, 58);
    const baseUpper = new THREE.Mesh(baseUpperGeo, stuccoMat);
    baseUpper.position.y = 28 + 11;
    baseUpper.castShadow = true;
    group.add(baseUpper);

    // Four Grand Arched Portals (North, South, East, West)
    for (let r = 0; r < 4; r++) {
      const archwayGeo = new THREE.BoxGeometry(26, 26, 6);
      const archway = new THREE.Mesh(archwayGeo, darkArchMat);
      const angle = (r * Math.PI) / 2;
      archway.position.set(Math.sin(angle) * 31, 14, Math.cos(angle) * 31);
      archway.rotation.y = angle;
      group.add(archway);
    }

    // Four Iconic Corner Minarets (56 Meters High)
    const minaretCorners = [
      { x: -28, z: -28 }, { x: 28, z: -28 },
      { x: -28, z: 28 }, { x: 28, z: 28 }
    ];

    minaretCorners.forEach(pos => {
      // 4-Tier fluted minaret shaft
      const shaftGeo = new THREE.CylinderGeometry(4.2, 5.5, 92, 24);
      const shaft = new THREE.Mesh(shaftGeo, stuccoMat);
      shaft.position.set(pos.x, 46, pos.z);
      shaft.castShadow = true;
      group.add(shaft);

      // Balconies with carved stone lattices
      for (let b of [32, 58, 82]) {
        const balcGeo = new THREE.CylinderGeometry(6.6, 6.6, 3, 20);
        const balc = new THREE.Mesh(balcGeo, stuccoMat);
        balc.position.set(pos.x, b, pos.z);
        group.add(balc);
      }

      // Bulbous Fluted Domelet
      const domeletGeo = new THREE.SphereGeometry(5.8, 20, 16);
      const domelet = new THREE.Mesh(domeletGeo, stuccoMat);
      domelet.position.set(pos.x, 92 + 4, pos.z);
      group.add(domelet);

      // Golden Finial Spire
      const finialGeo = new THREE.ConeGeometry(1.5, 12, 12);
      const finial = new THREE.Mesh(finialGeo, goldTrimMat);
      finial.position.set(pos.x, 92 + 12, pos.z);
      group.add(finial);
    });

    // Rooftop Gallery & Mosque Parapet
    const parapetGeo = new THREE.BoxGeometry(54, 4, 54);
    const parapet = new THREE.Mesh(parapetGeo, stuccoMat);
    parapet.position.y = 52;
    group.add(parapet);

    // Warm Gold Spotlights on Charminar
    const charminarLight = new THREE.PointLight(0xffbe6b, 4.0, 180);
    charminarLight.position.set(0, 50, 60);
    group.add(charminarLight);
  }

  // 3. India Gate (New Delhi)
  buildIndiaGateDetailed() {
    const group = this.monumentGroup;

    const sandstoneMat = new THREE.MeshStandardMaterial({
      color: 0xdf844e,
      roughness: 0.75,
      metalness: 0.1
    });

    // Dual Grand Archway Columns
    const colGeo = new THREE.BoxGeometry(24, 76, 34);
    const leftCol = new THREE.Mesh(colGeo, sandstoneMat);
    leftCol.position.set(-24, 38, 0);
    leftCol.castShadow = true;
    group.add(leftCol);

    const rightCol = new THREE.Mesh(colGeo, sandstoneMat);
    rightCol.position.set(24, 38, 0);
    rightCol.castShadow = true;
    group.add(rightCol);

    // Archway Crown Lintel Beam
    const lintelGeo = new THREE.BoxGeometry(72, 28, 36);
    const lintel = new THREE.Mesh(lintelGeo, sandstoneMat);
    lintel.position.set(0, 76 + 14, 0);
    lintel.castShadow = true;
    group.add(lintel);

    // Top Attic Tier with Memorial Inscription Relief
    const atticGeo = new THREE.BoxGeometry(60, 14, 32);
    const attic = new THREE.Mesh(atticGeo, sandstoneMat);
    attic.position.set(0, 76 + 28 + 7, 0);
    attic.castShadow = true;
    group.add(attic);

    // Amar Jawan Jyoti Eternal Flame Pedestal with Black Granite
    const flamePedestalGeo = new THREE.CylinderGeometry(4, 5, 8, 16);
    const blackGranite = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.2, metalness: 0.8 });
    const flamePed = new THREE.Mesh(flamePedestalGeo, blackGranite);
    flamePed.position.set(0, 4, 0);
    group.add(flamePed);

    // Flickering Eternal Flame Light
    const flameLight = new THREE.PointLight(0xff5500, 4.0, 50);
    flameLight.position.set(0, 10, 0);
    group.add(flameLight);

    // Ceremonial Kartavya Path Avenue
    const boulevardGeo = new THREE.BoxGeometry(80, 1.2, 500);
    const boulevardMat = new THREE.MeshStandardMaterial({ color: 0x1c222e, roughness: 0.8 });
    const boulevard = new THREE.Mesh(boulevardGeo, boulevardMat);
    boulevard.position.set(0, 0.6, 0);
    boulevard.receiveShadow = true;
    group.add(boulevard);
  }

  // 4. Gateway of India (Mumbai)
  buildGatewayOfIndiaDetailed() {
    const group = this.monumentGroup;

    const basaltMat = new THREE.MeshStandardMaterial({
      color: 0xc49b76,
      roughness: 0.65,
      metalness: 0.1
    });

    // Triple Arch Portico
    const mainPillarsGeo = new THREE.BoxGeometry(20, 62, 26);
    const leftP = new THREE.Mesh(mainPillarsGeo, basaltMat);
    leftP.position.set(-22, 31, 0);
    leftP.castShadow = true;
    group.add(leftP);

    const rightP = new THREE.Mesh(mainPillarsGeo, basaltMat);
    rightP.position.set(22, 31, 0);
    rightP.castShadow = true;
    group.add(rightP);

    const crownGeo = new THREE.BoxGeometry(64, 22, 28);
    const crown = new THREE.Mesh(crownGeo, basaltMat);
    crown.position.set(0, 62 + 11, 0);
    crown.castShadow = true;
    group.add(crown);

    // Central Dome & 4 Corner Turrets
    const centralDome = new THREE.Mesh(new THREE.SphereGeometry(15, 24, 18, 0, Math.PI * 2, 0, Math.PI * 0.6), basaltMat);
    centralDome.position.set(0, 73, 0);
    group.add(centralDome);

    const turrets = [
      { x: -30, z: -12 }, { x: 30, z: -12 },
      { x: -30, z: 12 }, { x: 30, z: 12 }
    ];
    turrets.forEach(t => {
      const turretMesh = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.8, 84, 16), basaltMat);
      turretMesh.position.set(t.x, 42, t.z);
      turretMesh.castShadow = true;
      group.add(turretMesh);

      const tDome = new THREE.Mesh(new THREE.SphereGeometry(4.2, 14, 12), basaltMat);
      tDome.position.set(t.x, 84 + 3, t.z);
      group.add(tDome);
    });

    // Waterfront Promenade Deck
    const promenadeGeo = new THREE.BoxGeometry(200, 2, 140);
    const promenade = new THREE.Mesh(promenadeGeo, new THREE.MeshStandardMaterial({ color: 0x2e3540, roughness: 0.8 }));
    promenade.position.set(0, 1, 40);
    group.add(promenade);
  }

  // 5. Vidhana Soudha (Bengaluru)
  buildVidhanaSoudhaDetailed() {
    const group = this.monumentGroup;

    const graniteMat = new THREE.MeshStandardMaterial({
      color: 0xd9dede,
      roughness: 0.55,
      metalness: 0.15
    });
    const goldEmblemMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.9,
      roughness: 0.2
    });

    // Sprawling Dravidian Wings
    const wingGeo = new THREE.BoxGeometry(240, 38, 64);
    const wing = new THREE.Mesh(wingGeo, graniteMat);
    wing.position.set(0, 19, 0);
    wing.castShadow = true;
    group.add(wing);

    // Central Portico with 12 Grand Columns
    const porticoGeo = new THREE.BoxGeometry(80, 52, 74);
    const portico = new THREE.Mesh(porticoGeo, graniteMat);
    portico.position.set(0, 26, 6);
    portico.castShadow = true;
    group.add(portico);

    // Central 60-Foot Dome
    const dome = new THREE.Mesh(new THREE.SphereGeometry(20, 28, 20, 0, Math.PI * 2, 0, Math.PI * 0.72), graniteMat);
    dome.position.set(0, 52 + 10, 6);
    group.add(dome);

    // Ashoka Four Lions National Emblem Finial
    const emblem = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 3.5, 18, 12), goldEmblemMat);
    emblem.position.set(0, 52 + 26, 6);
    group.add(emblem);

    // Grand Stairs Approach
    const stairs = new THREE.Mesh(new THREE.BoxGeometry(100, 8, 45), graniteMat);
    stairs.position.set(0, 4, 52);
    group.add(stairs);
  }

  // 6. Hawa Mahal (Jaipur)
  buildHawaMahalDetailed() {
    const group = this.monumentGroup;
    const pinkMat = new THREE.MeshStandardMaterial({ color: 0xe07263, roughness: 0.75 });

    // 5-Tier Crown of Krishna Facade
    const tiers = [
      { w: 96, h: 16, d: 22, y: 8 },
      { w: 82, h: 14, d: 20, y: 23 },
      { w: 64, h: 13, d: 18, y: 36.5 },
      { w: 46, h: 11, d: 16, y: 48.5 },
      { w: 28, h: 11, d: 14, y: 59.5 }
    ];

    tiers.forEach(t => {
      const tierMesh = new THREE.Mesh(new THREE.BoxGeometry(t.w, t.h, t.d), pinkMat);
      tierMesh.position.set(0, t.y, 0);
      tierMesh.castShadow = true;
      group.add(tierMesh);
    });
  }

  // 7. Golden Temple (Amritsar)
  buildGoldenTempleDetailed() {
    const group = this.monumentGroup;

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.95,
      roughness: 0.15
    });
    const whiteMarbleMat = new THREE.MeshStandardMaterial({
      color: 0xfbfcfe,
      roughness: 0.3
    });

    // Lower Marble Tier
    const lowerTier = new THREE.Mesh(new THREE.BoxGeometry(50, 16, 50), whiteMarbleMat);
    lowerTier.position.y = 8;
    lowerTier.castShadow = true;
    group.add(lowerTier);

    // Upper 24-Karat Gold Tier
    const upperTier = new THREE.Mesh(new THREE.BoxGeometry(44, 20, 44), goldMat);
    upperTier.position.y = 16 + 10;
    upperTier.castShadow = true;
    group.add(upperTier);

    // Golden Fluted Central Dome
    const dome = new THREE.Mesh(new THREE.SphereGeometry(14, 28, 20, 0, Math.PI * 2, 0, Math.PI * 0.7), goldMat);
    dome.position.y = 36 + 6;
    group.add(dome);

    // Surrounding Amrit Sarovar (Holy Pool of Nectar)
    const sarovar = new THREE.Mesh(new THREE.BoxGeometry(220, 2, 220), new THREE.MeshStandardMaterial({ color: 0x07355c, roughness: 0.05, metalness: 0.95 }));
    sarovar.position.set(0, 1, 0);
    group.add(sarovar);

    // Causeway Bridge
    const causeway = new THREE.Mesh(new THREE.BoxGeometry(14, 3, 100), whiteMarbleMat);
    causeway.position.set(0, 1.5, 70);
    group.add(causeway);

    // Golden Glow
    const light = new THREE.PointLight(0xffe066, 4.5, 160);
    light.position.set(0, 40, 0);
    group.add(light);
  }

  // 8. Varanasi Ancient Ghats (River Ganga)
  buildVaranasiGhatsDetailed() {
    const group = this.monumentGroup;
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0xbf9b6b, roughness: 0.85 });
    const templeMat = new THREE.MeshStandardMaterial({ color: 0xff9933, roughness: 0.6 });

    // Descending Stone Stepways
    for (let i = 0; i < 7; i++) {
      const step = new THREE.Mesh(new THREE.BoxGeometry(320, 4.5, 32), stoneMat);
      step.position.set(0, (7 - i) * 4.5, 90 + i * 26);
      step.receiveShadow = true;
      group.add(step);
    }

    // Sacred Temple Shikharas
    for (let j = -3; j <= 3; j++) {
      const temple = new THREE.Mesh(new THREE.ConeGeometry(12, 52, 8), templeMat);
      temple.position.set(j * 50, 52, 70);
      temple.castShadow = true;
      group.add(temple);
    }
  }

  // 9. Himalayan Valleys (Srinagar & Ladakh)
  buildHimalayanMountainPeaksDetailed() {
    const group = this.monumentGroup;
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x3d3834, roughness: 0.9 });
    const snowMat = new THREE.MeshStandardMaterial({ color: 0xf5f8ff, roughness: 0.25 });

    const peaks = [
      { x: -170, z: -130, r: 130, h: 260 },
      { x: 0, z: -190, r: 160, h: 320 },
      { x: 190, z: -110, r: 140, h: 280 },
      { x: -100, z: -60, r: 100, h: 190 },
      { x: 120, z: -50, r: 110, h: 210 }
    ];

    peaks.forEach(p => {
      const rock = new THREE.Mesh(new THREE.ConeGeometry(p.r, p.h * 0.7, 7), rockMat);
      rock.position.set(p.x, p.h * 0.35, p.z);
      rock.castShadow = true;
      group.add(rock);

      const snow = new THREE.Mesh(new THREE.ConeGeometry(p.r * 0.45, p.h * 0.35, 7), snowMat);
      snow.position.set(p.x, p.h * 0.75, p.z);
      snow.castShadow = true;
      group.add(snow);
    });
  }

  // 10. Modern Metropolis Central Landmark (Fallback for Metros)
  buildMetropolisLandmarkDetailed(city) {
    const group = this.monumentGroup;

    const towerGeo = new THREE.BoxGeometry(48, 180, 48);
    const towerMat = new THREE.MeshStandardMaterial({
      color: 0x1a4570,
      metalness: 0.85,
      roughness: 0.15
    });
    const tower = new THREE.Mesh(towerGeo, towerMat);
    tower.position.set(0, 90, 0);
    tower.castShadow = true;
    group.add(tower);

    // Glowing Communications Spire
    const spire = new THREE.Mesh(new THREE.ConeGeometry(2.5, 45, 8), new THREE.MeshBasicMaterial({ color: 0x00e5ff }));
    spire.position.set(0, 180 + 22.5, 0);
    group.add(spire);
  }

  buildFuturisticSkyline(city) {
    const skylineGroup = new THREE.Group();
    const count = 110;
    const boxGeo = new THREE.BoxGeometry(1, 1, 1);

    const glassMats = [
      new THREE.MeshStandardMaterial({ color: 0x162238, roughness: 0.3, metalness: 0.8 }),
      new THREE.MeshStandardMaterial({ color: 0x1c2e4a, roughness: 0.25, metalness: 0.85 }),
      new THREE.MeshStandardMaterial({ color: 0x223a5e, roughness: 0.35, metalness: 0.75 })
    ];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 140 + Math.random() * 380;
      const x = Math.cos(angle) * dist;
      const z = Math.sin(angle) * dist;

      // Keep waterfront clear
      if (['mumbai', 'delhi', 'agra', 'varanasi', 'kolkata'].includes(city.id) && z > 180) {
        continue;
      }

      const w = 18 + Math.random() * 28;
      const d = 18 + Math.random() * 28;
      let h = 30 + Math.random() * 90;

      // Extra super-tall towers in Mumbai, Bengaluru, Hyderabad
      if (['mumbai', 'bengaluru', 'hyderabad'].includes(city.id) && Math.random() > 0.68) {
        h = 110 + Math.random() * 140;
      }

      const mat = glassMats[Math.floor(Math.random() * glassMats.length)];
      const building = new THREE.Mesh(boxGeo, mat);
      building.scale.set(w, h, d);
      building.position.set(x, h / 2, z);
      building.castShadow = true;
      building.receiveShadow = true;

      // Rooftop Beacon Light on tall towers
      if (h > 90) {
        const beacon = new THREE.Mesh(
          new THREE.SphereGeometry(2, 8, 8),
          new THREE.MeshBasicMaterial({ color: 0xff3333 })
        );
        beacon.position.set(x, h + 2, z);
        skylineGroup.add(beacon);
      }

      skylineGroup.add(building);
    }

    this.cityGroup.add(skylineGroup);
  }

  buildLaserTrafficStreams() {
    // 3 Concentric arterial avenues with animated light streams
    const laneRadii = [160, 260, 360];
    const particleColors = [0x00e5ff, 0xff9933, 0xff3366];

    laneRadii.forEach((r, laneIdx) => {
      const pCount = 140;
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(pCount * 3);
      const angles = new Float32Array(pCount);
      const speeds = new Float32Array(pCount);

      for (let i = 0; i < pCount; i++) {
        angles[i] = (i / pCount) * Math.PI * 2;
        speeds[i] = (laneIdx % 2 === 0 ? 1 : -1) * (0.006 + Math.random() * 0.003);
        pos[i * 3] = Math.cos(angles[i]) * r;
        pos[i * 3 + 1] = 1.5;
        pos[i * 3 + 2] = Math.sin(angles[i]) * r;
      }

      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

      const mat = new THREE.PointsMaterial({
        size: 4.0,
        color: particleColors[laneIdx % particleColors.length],
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
      });

      const points = new THREE.Points(geo, mat);
      this.cityGroup.add(points);

      this.trafficSystems.push({ points, angles, speeds, radius: r, count: pCount });
    });
  }

  buildMonumentSpotlights() {
    // Upward volumetric spot beams lighting the central landmark
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2 + Math.PI / 4;
      const x = Math.cos(angle) * 75;
      const z = Math.sin(angle) * 75;

      const spot = new THREE.SpotLight(0x00e5ff, 3.5);
      spot.position.set(x, 2, z);
      spot.target.position.set(0, 45, 0);
      spot.angle = Math.PI / 6;
      spot.penumbra = 0.5;
      this.cityGroup.add(spot);
      this.cityGroup.add(spot.target);
      this.spotlights.push(spot);
    }
  }

  setupEventListeners() {
    const dom = this.renderer.domElement;

    dom.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.prevMouse = { x: e.clientX, y: e.clientY };
      this.isAutoOrbit = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        const dx = e.clientX - this.prevMouse.x;
        const dy = e.clientY - this.prevMouse.y;

        this.orbitAngle -= dx * 0.004;
        this.cameraElevation = Math.max(30, Math.min(420, this.cameraElevation + dy * 0.8));

        this.prevMouse = { x: e.clientX, y: e.clientY };
      }
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    // Touch
    dom.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        this.isAutoOrbit = false;
      }
    });

    dom.addEventListener('touchmove', (e) => {
      if (this.isDragging && e.touches.length === 1) {
        const dx = e.touches[0].clientX - this.prevMouse.x;
        const dy = e.touches[0].clientY - this.prevMouse.y;
        this.orbitAngle -= dx * 0.005;
        this.cameraElevation = Math.max(30, Math.min(420, this.cameraElevation + dy * 0.8));
        this.prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    });

    dom.addEventListener('touchend', () => {
      this.isDragging = false;
    });

    // Zoom
    dom.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.orbitRadius = Math.max(120, Math.min(750, this.orbitRadius + e.deltaY * 0.35));
    }, { passive: false });

    window.addEventListener('resize', () => this.onResize());
  }

  onResize() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // 1. Auto-drone orbit around the landmark
    if (this.isAutoOrbit) {
      this.orbitAngle += this.orbitSpeed;
    }

    const camX = Math.cos(this.orbitAngle) * this.orbitRadius;
    const camZ = Math.sin(this.orbitAngle) * this.orbitRadius;
    this.camera.position.set(camX, this.cameraElevation, camZ);
    this.camera.lookAt(this.cameraTarget);

    // 2. Animate Traffic Streams
    this.trafficSystems.forEach(sys => {
      const pos = sys.points.geometry.attributes.position.array;
      for (let i = 0; i < sys.count; i++) {
        sys.angles[i] += sys.speeds[i];
        pos[i * 3] = Math.cos(sys.angles[i]) * sys.radius;
        pos[i * 3 + 2] = Math.sin(sys.angles[i]) * sys.radius;
      }
      sys.points.geometry.attributes.position.needsUpdate = true;
    });

    // 3. Subtle pulsing of spotlights
    this.spotlights.forEach((spot, idx) => {
      spot.intensity = 2.8 + Math.sin(elapsedTime * 3 + idx) * 0.7;
    });

    // Telemetry update
    if (this.onTelemetryUpdate && this.currentCity) {
      this.onTelemetryUpdate({
        latitude: this.currentCity.lat.toFixed(2),
        longitude: this.currentCity.lng.toFixed(2),
        altitudeText: `${Math.round(this.cameraElevation)} m (3D Drone)`,
        heading: Math.round((this.orbitAngle * 180) / Math.PI) % 360,
        pitch: -35
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
