import { MAJOR_CITIES, ALL_INDIAN_STATES_UTS } from '../data/indiaData.js';

/**
 * GoogleEarthCesiumEngine
 * Core 3D Photorealistic Satellite Engine for Bharat 3D.
 * Uses CesiumJS with high-resolution global satellite photography (ESRI World Imagery)
 * and boundary reference overlays, plus supports authentic Google Photorealistic 3D Tiles.
 */
export class GoogleEarthCesiumEngine {
  constructor(containerId, onCitySelect, onTelemetryUpdate) {
    this.containerId = containerId;
    this.onCitySelect = onCitySelect;
    this.onTelemetryUpdate = onTelemetryUpdate;

    this.viewer = null;
    this.google3DTileset = null;
    this.orbitInterval = null;
    this.isOrbiting = false;
    this.currentTarget = null;
    this.isInitialized = false;

    this.init();
  }

  async init() {
    if (this.isInitialized) return;
    const Cesium = window.Cesium;

    if (!Cesium) {
      console.error('Cesium library not found on window. Ensure CDN script tag is loaded.');
      return;
    }

    try {
      // 1. High-Resolution Satellite Layer (ESRI World Imagery - Sub-meter resolution across India)
      const satelliteImagery = new Cesium.UrlTemplateImageryProvider({
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        maximumLevel: 19,
        credit: 'Esri, Maxar, Earthstar Geographics, CNES/Airbus DS, USGS, AeroGRID, IGN, and the GIS User Community'
      });

      // 2. High-Definition State Borders & Place Names Layer
      const referenceImagery = new Cesium.UrlTemplateImageryProvider({
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        maximumLevel: 19
      });

      // 3. Initialize Viewer with Space Atmosphere & Photorealistic Globe
      this.viewer = new Cesium.Viewer(this.containerId, {
        baseLayer: new Cesium.ImageryLayer(satelliteImagery),
        animation: false,
        baseLayerPicker: false,
        fullscreenButton: false,
        geocoder: false,
        homeButton: false,
        infoBox: false,
        sceneModePicker: false,
        selectionIndicator: false,
        timeline: false,
        navigationHelpButton: false,
        shadows: true,
        skyAtmosphere: new Cesium.SkyAtmosphere()
      });

      // Add boundary overlay
      this.viewer.imageryLayers.addImageryProvider(referenceImagery);

      // Enhance atmosphere and lighting
      this.viewer.scene.globe.enableLighting = true;
      this.viewer.scene.globe.depthTestAgainstTerrain = false;
      this.viewer.scene.highDynamicRange = true;

      // 4. Add 3D Glowing Beacons for Indian Cities & States
      this.createIndianLocationPins();

      // 5. Add Orbiting ISRO Satellites in 3D Space
      this.createSatellites();

      // 6. Set initial camera view in Deep Space overlooking India
      this.flyToLocation(20.5937, 78.9629, 6500000, -85, 0, 2.0);

      // 7. Telemetry & Click Handlers
      this.setupHandlers();

      this.isInitialized = true;
      console.log('Cesium Photorealistic Satellite Globe successfully initialized!');
    } catch (err) {
      console.error('Failed to initialize Cesium Viewer:', err);
    }
  }

  createIndianLocationPins() {
    const Cesium = window.Cesium;
    if (!this.viewer || !Cesium) return;

    // Major Cities
    MAJOR_CITIES.forEach(city => {
      this.viewer.entities.add({
        id: `city-${city.id}`,
        name: city.name,
        position: Cesium.Cartesian3.fromDegrees(city.lng, city.lat, 20),
        point: {
          pixelSize: 10,
          color: Cesium.Color.fromCssColorString('#ff9933'), // Indian Saffron
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 2,
          scaleByDistance: new Cesium.NearFarScalar(1.5e2, 2.0, 8.0e6, 0.8)
        },
        label: {
          text: ` ${city.name} `,
          font: 'bold 13px Rajdhani, Outfit, sans-serif',
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          fillColor: Cesium.Color.WHITE,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 3,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, -12),
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(100, 6000000)
        },
        userData: { isCity: true, data: city }
      });
    });

    // States & UTs (Subtle green markers)
    ALL_INDIAN_STATES_UTS.forEach(state => {
      this.viewer.entities.add({
        id: `state-${state.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        name: state.name,
        position: Cesium.Cartesian3.fromDegrees(state.lng, state.lat, 10),
        point: {
          pixelSize: 7,
          color: Cesium.Color.fromCssColorString('#138808'), // Indian Green
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 1.5,
          scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.5, 8.0e6, 0.5)
        },
        label: {
          text: state.name,
          font: '11px Outfit, sans-serif',
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          fillColor: Cesium.Color.fromCssColorString('#00e5ff'),
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, -10),
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(30000, 7000000)
        },
        userData: { isState: true, data: state }
      });
    });
  }

  createSatellites() {
    const Cesium = window.Cesium;
    if (!this.viewer || !Cesium) return;

    // Chandrayaan & NavIC Orbital representation
    const satPositions = [
      { name: 'Chandrayaan-3', lat: 10, lng: 75, alt: 1800000, color: '#ff9933' },
      { name: 'Aditya-L1 Relay', lat: 25, lng: 85, alt: 2400000, color: '#ffd700' },
      { name: 'NavIC Satellite 1I', lat: 0, lng: 83, alt: 3578600, color: '#00e5ff' }
    ];

    satPositions.forEach(sat => {
      this.viewer.entities.add({
        name: sat.name,
        position: Cesium.Cartesian3.fromDegrees(sat.lng, sat.lat, sat.alt),
        point: {
          pixelSize: 8,
          color: Cesium.Color.fromCssColorString(sat.color),
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 2
        },
        label: {
          text: `🛰️ ${sat.name}`,
          font: '11px Rajdhani, monospace',
          fillColor: Cesium.Color.fromCssColorString(sat.color),
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
          pixelOffset: new Cesium.Cartesian2(0, -14)
        }
      });
    });
  }

  setupHandlers() {
    const Cesium = window.Cesium;
    if (!this.viewer || !Cesium) return;

    // Telemetry tracker on render
    this.viewer.scene.postRender.addEventListener(() => {
      if (this.onTelemetryUpdate) {
        const cartographic = this.viewer.camera.positionCartographic;
        if (cartographic) {
          const lat = Cesium.Math.toDegrees(cartographic.latitude);
          const lng = Cesium.Math.toDegrees(cartographic.longitude);
          const altM = cartographic.height;
          const altText = altM > 10000 ? `${(altM / 1000).toFixed(0)} km` : `${altM.toFixed(0)} m`;

          this.onTelemetryUpdate({
            latitude: lat.toFixed(2),
            longitude: lng.toFixed(2),
            altitudeText: altText,
            heading: Cesium.Math.toDegrees(this.viewer.camera.heading).toFixed(0),
            pitch: Cesium.Math.toDegrees(this.viewer.camera.pitch).toFixed(0)
          });
        }
      }
    });

    // Click handler for 3D Pins
    const handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    handler.setInputAction((click) => {
      const pickedObject = this.viewer.scene.pick(click.position);
      if (Cesium.defined(pickedObject) && pickedObject.id && pickedObject.id.userData) {
        const userData = pickedObject.id.userData;
        if (userData.isCity) {
          this.flyToCity(userData.data);
          if (this.onCitySelect) this.onCitySelect(userData.data);
        } else if (userData.isState) {
          this.flyToState(userData.data);
          if (this.onCitySelect) this.onCitySelect(userData.data);
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }

  // Smooth Supersonic Camera Flight to City
  flyToCity(city, enableOrbit = true) {
    const Cesium = window.Cesium;
    if (!this.viewer || !Cesium) return;

    this.stopOrbit();
    this.currentTarget = city;

    const alt = city.cameraHeightM || 1400;
    const pitch = city.pitchDeg || -40;
    const heading = city.headingDeg || 0;

    this.viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(city.lng, city.lat, alt),
      orientation: {
        heading: Cesium.Math.toRadians(heading),
        pitch: Cesium.Math.toRadians(pitch),
        roll: 0.0
      },
      duration: 3.2,
      complete: () => {
        if (enableOrbit) {
          this.startOrbit(city.lat, city.lng, alt * 0.85);
        }
      }
    });
  }

  // Smooth Flight to State
  flyToState(state) {
    const Cesium = window.Cesium;
    if (!this.viewer || !Cesium) return;

    this.stopOrbit();
    this.currentTarget = state;

    this.viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(state.lng, state.lat, 450000), // Regional satellite perspective
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-65),
        roll: 0.0
      },
      duration: 2.8
    });
  }

  // Fly to General Space Coordinates
  flyToLocation(lat, lng, heightMeters = 6500000, pitchDeg = -85, headingDeg = 0, durationSec = 2.5) {
    const Cesium = window.Cesium;
    if (!this.viewer || !Cesium) return;

    this.stopOrbit();

    this.viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(lng, lat, heightMeters),
      orientation: {
        heading: Cesium.Math.toRadians(headingDeg),
        pitch: Cesium.Math.toRadians(pitchDeg),
        roll: 0.0
      },
      duration: durationSec
    });
  }

  // Smooth 360-degree Continuous Orbit around landmark
  startOrbit(lat, lng, distanceMeters = 1000) {
    const Cesium = window.Cesium;
    if (!this.viewer || !Cesium) return;

    this.stopOrbit();
    this.isOrbiting = true;

    let currentHeading = this.viewer.camera.heading;
    const center = Cesium.Cartesian3.fromDegrees(lng, lat, 20);

    this.orbitInterval = setInterval(() => {
      if (!this.isOrbiting) return;
      currentHeading += 0.003; // Smooth gentle rotation speed

      const transform = Cesium.Transforms.eastNorthUpToFixedFrame(center);
      this.viewer.camera.lookAtTransform(
        transform,
        new Cesium.HeadingPitchRange(currentHeading, Cesium.Math.toRadians(-35), distanceMeters)
      );
    }, 30);
  }

  stopOrbit() {
    this.isOrbiting = false;
    if (this.orbitInterval) {
      clearInterval(this.orbitInterval);
      this.orbitInterval = null;
    }
    if (this.viewer) {
      const Cesium = window.Cesium;
      this.viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
    }
  }

  // Set Altitude Slider
  setAltitude(meters) {
    const Cesium = window.Cesium;
    if (!this.viewer || !Cesium) return;

    const cartographic = this.viewer.camera.positionCartographic;
    if (cartographic) {
      const lat = Cesium.Math.toDegrees(cartographic.latitude);
      const lng = Cesium.Math.toDegrees(cartographic.longitude);
      this.viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(lng, lat, meters)
      });
    }
  }

  // Activate Official Google Photorealistic 3D Tiles
  async enableGooglePhotorealistic3D(apiKey) {
    const Cesium = window.Cesium;
    if (!this.viewer || !Cesium) return false;

    try {
      if (this.google3DTileset) {
        this.viewer.scene.primitives.remove(this.google3DTileset);
      }

      // Hide standard globe
      this.viewer.scene.globe.show = false;

      // Add Google 3D Tileset
      this.google3DTileset = await Cesium.createGooglePhotorealistic3DTileset({
        key: apiKey,
        onlyUsingWithGoogleGeocoder: true
      });

      this.viewer.scene.primitives.add(this.google3DTileset);
      console.log('Google Photorealistic 3D Tiles activated!');
      return true;
    } catch (err) {
      console.error('Failed to load Google 3D Tiles:', err);
      this.viewer.scene.globe.show = true;
      return false;
    }
  }

  destroy() {
    this.stopOrbit();
    if (this.viewer) {
      this.viewer.destroy();
      this.viewer = null;
      this.isInitialized = false;
    }
  }
}
