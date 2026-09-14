import './style.css';
import { City3DScene } from './engine/city3dScene.js';
import { SpaceGlobeEngine } from './engine/spaceGlobe.js';
import { GoogleEarthCesiumEngine } from './engine/googleEarthCesium.js';
import { SpaceSoundFX } from './audio/spaceSoundFX.js';
import { HUDController } from './ui/hud.js';
import { MAJOR_CITIES, ALL_INDIAN_STATES_UTS, INDIA_OVERVIEW } from './data/indiaData.js';

class Bharat3DApp {
  constructor() {
    this.currentMode = 'city'; // 'city' | 'space' | 'cesium' | 'google-maps'
    this.activeLocation = MAJOR_CITIES[0]; // New Delhi default

    this.cityEngine = null;
    this.spaceEngine = null;
    this.cesiumEngine = null;
    this.soundFX = null;
    this.hud = null;

    this.init();
  }

  init() {
    // 1. Web Audio Synthesizer
    this.soundFX = new SpaceSoundFX();

    // 2. City 3D Scene (Default High-Detail Architectural Monuments & Skylines)
    const cityContainer = document.getElementById('city-viewport');
    this.cityEngine = new City3DScene(
      cityContainer,
      (telemetry) => {
        if (this.currentMode === 'city' && this.hud) {
          this.hud.updateTelemetry(telemetry);
        }
      }
    );
    this.cityEngine.loadCity(this.activeLocation);

    // 3. Three.js Space Globe Engine
    const spaceContainer = document.getElementById('space-viewport');
    this.spaceEngine = new SpaceGlobeEngine(
      spaceContainer,
      (city) => this.handleCitySelect(city),
      (telemetry) => {
        if (this.currentMode === 'space' && this.hud) {
          this.hud.updateTelemetry(telemetry);
        }
      }
    );

    // 4. Cesium Photorealistic Satellite Engine (Pre-initialized for instant switching)
    this.cesiumEngine = new GoogleEarthCesiumEngine(
      'cesium-viewport',
      (location) => this.handleLocationSelect(location),
      (telemetry) => {
        if (this.currentMode === 'cesium' && this.hud) {
          this.hud.updateTelemetry(telemetry);
        }
      }
    );

    // 5. HUD Mission Control Overlay
    this.hud = new HUDController({
      container: document.getElementById('hud-overlay'),
      onSelectCity: (city) => this.handleCitySelect(city),
      onSelectState: (state) => this.handleStateSelect(state),
      onModeChange: (mode) => this.switchMode(mode),
      onAltitudeChange: (altVal) => this.handleAltitudeChange(altVal),
      onToggleSound: () => this.soundFX.toggleSound(),
      onGoogleApiKeySubmit: (apiKey) => this.cesiumEngine.enableGooglePhotorealistic3D(apiKey),
      onCameraPreset: (preset) => this.handleCameraPreset(preset),
      onResetView: () => this.resetView()
    });

    console.log('Bharat 3D: High-Quality Animated 3D Engine Initialized!');
  }

  handleCitySelect(city) {
    this.activeLocation = city;
    this.soundFX.playFlyoverSwoosh();
    this.soundFX.playMonumentSonar();

    if (this.currentMode === 'city') {
      this.cityEngine.loadCity(city);
    } else if (this.currentMode === 'space') {
      this.spaceEngine.flyToLocation(city.lat, city.lng, 1.25, 2400);
    } else if (this.currentMode === 'cesium') {
      this.cesiumEngine.flyToCity(city, true);
    } else if (this.currentMode === 'google-maps') {
      this.updateGoogleMapsEmbed(city);
    }
  }

  handleStateSelect(state) {
    this.activeLocation = state;
    this.soundFX.playFlyoverSwoosh();

    // Find if state has an associated featured city
    const repCity = MAJOR_CITIES.find(c => c.state === state.name || c.state.includes(state.name));

    if (this.currentMode === 'city') {
      if (repCity) {
        this.cityEngine.loadCity(repCity);
      } else {
        // Build state mountain/landscape
        this.cityEngine.loadCity({
          id: state.name.toLowerCase().replace(/[^a-z0-9]/g, ''),
          name: state.name,
          hindiName: `राजधानी: ${state.capital}`,
          state: state.name,
          elevationM: 200,
          lat: state.lat,
          lng: state.lng,
          highlight: state.highlight,
          monuments: [{ name: `Capital: ${state.capital}`, type: 'Administrative Capital', heightM: 30 }]
        });
      }
    } else if (this.currentMode === 'space') {
      this.spaceEngine.flyToLocation(state.lat, state.lng, 1.45, 2200);
    } else if (this.currentMode === 'cesium') {
      this.cesiumEngine.flyToState(state);
    } else if (this.currentMode === 'google-maps') {
      this.updateGoogleMapsEmbed(state);
    }
  }

  handleLocationSelect(location) {
    if (location.isCity || location.cameraHeightM) {
      this.handleCitySelect(location);
    } else {
      this.handleStateSelect(location);
    }
  }

  switchMode(mode) {
    this.currentMode = mode;
    this.soundFX.playUiBeep(880, 0.08);

    const cityEl = document.getElementById('city-viewport');
    const spaceEl = document.getElementById('space-viewport');
    const cesiumEl = document.getElementById('cesium-viewport');
    const googleEl = document.getElementById('google-satellite-viewport');

    // Hide all
    cityEl.style.display = 'none';
    spaceEl.style.display = 'none';
    cesiumEl.style.display = 'none';
    googleEl.style.display = 'none';

    if (mode === 'city') {
      cityEl.style.display = 'block';
      if (this.activeLocation) {
        if (this.activeLocation.cameraHeightM || this.activeLocation.isCity) {
          this.cityEngine.loadCity(this.activeLocation);
        } else {
          this.handleStateSelect(this.activeLocation);
        }
      }
    } else if (mode === 'space') {
      spaceEl.style.display = 'block';
      if (this.activeLocation) {
        this.spaceEngine.flyToLocation(this.activeLocation.lat, this.activeLocation.lng, 1.3, 1800);
      }
    } else if (mode === 'cesium') {
      cesiumEl.style.display = 'block';
      if (this.activeLocation) {
        if (this.activeLocation.cameraHeightM) this.cesiumEngine.flyToCity(this.activeLocation);
        else this.cesiumEngine.flyToState(this.activeLocation);
      }
    } else if (mode === 'google-maps') {
      googleEl.style.display = 'block';
      this.updateGoogleMapsEmbed(this.activeLocation);
    }
  }

  handleAltitudeChange(val) {
    if (this.currentMode === 'city') {
      this.cityEngine.cameraElevation = Math.max(30, Math.min(600, val));
    } else if (this.currentMode === 'space') {
      this.spaceEngine.setAltitude(val);
    } else if (this.currentMode === 'cesium') {
      this.cesiumEngine.setAltitude(val);
    }
  }

  handleCameraPreset(preset) {
    this.soundFX.playUiBeep(720, 0.07);
    if (this.currentMode === 'city') {
      if (preset === 'orbit') {
        this.cityEngine.isAutoOrbit = true;
        this.cityEngine.orbitRadius = 380;
        this.cityEngine.cameraElevation = 150;
      } else if (preset === 'cinematic') {
        this.cityEngine.isAutoOrbit = false;
        this.cityEngine.orbitRadius = 450;
        this.cityEngine.cameraElevation = 220;
      } else if (preset === 'nadir') {
        this.cityEngine.isAutoOrbit = false;
        this.cityEngine.orbitRadius = 60;
        this.cityEngine.cameraElevation = 460;
      }
    }
  }

  updateGoogleMapsEmbed(item) {
    const iframe = document.getElementById('google-maps-frame');
    if (!iframe) return;

    if (item.googleMapsEmbed) {
      iframe.src = item.googleMapsEmbed;
    } else {
      const q = encodeURIComponent(`${item.name} ${item.capital || ''} India`);
      iframe.src = `https://maps.google.com/maps?q=${q}&t=k&z=15&ie=UTF8&iwloc=&output=embed`;
    }
  }

  resetView() {
    this.soundFX.playFlyoverSwoosh();
    if (this.currentMode === 'space') {
      this.spaceEngine.setCameraToSpaceCoordinates(20.5937, 78.9629, 3.8);
    } else if (this.currentMode === 'cesium') {
      this.cesiumEngine.flyToLocation(20.5937, 78.9629, 6500000, -85, 0, 2.5);
    } else {
      this.cityEngine.loadCity(this.activeLocation);
    }
  }
}

// Bootstrap on DOM Ready
window.addEventListener('DOMContentLoaded', () => {
  window.app = new Bharat3DApp();
});
