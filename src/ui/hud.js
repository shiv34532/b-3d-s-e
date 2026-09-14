import { MAJOR_CITIES, ALL_INDIAN_STATES_UTS, INDIA_OVERVIEW } from '../data/indiaData.js';

/**
 * HUDController
 * Fully responsive, modern glassmorphic interface.
 * Coordinates 4 distinct 3D visual engines:
 * 1. 3D Architectural Monuments & Skylines
 * 2. 3D Planetary Space Globe
 * 3. Photorealistic Satellite Globe (Cesium)
 * 4. Google Satellite & Street Hybrid
 */
export class HUDController {
  constructor(options) {
    this.container = options.container;
    this.onSelectCity = options.onSelectCity;
    this.onSelectState = options.onSelectState;
    this.onModeChange = options.onModeChange;
    this.onAltitudeChange = options.onAltitudeChange;
    this.onToggleSound = options.onToggleSound;
    this.onGoogleApiKeySubmit = options.onGoogleApiKeySubmit;
    this.onCameraPreset = options.onCameraPreset;
    this.onResetView = options.onResetView;

    this.currentMode = 'city'; // Default mode
    this.activeFilter = 'all';
    this.searchQuery = '';
    this.activeLocation = MAJOR_CITIES[0]; // New Delhi default
    this.isTourPlaying = false;
    this.tourIndex = 0;
    this.tourTimer = null;
    this.leftDrawerOpen = true;
    this.rightDrawerOpen = true;

    // Responsive auto-collapse drawers on mobile/tablets
    if (window.innerWidth < 1024) {
      this.leftDrawerOpen = false;
      this.rightDrawerOpen = false;
    }

    this.render();
    this.bindEvents();
    this.startClock();
  }

  render() {
    this.container.innerHTML = `
      <!-- Top Navigation Bar -->
      <header class="hud-topbar">
        <div class="topbar-left">
          <button class="drawer-toggle-btn" id="toggle-left-btn" title="Toggle States & Cities Drawer">
            <span class="btn-icon">☰</span> <span class="btn-text">EXPLORE INDIA</span>
          </button>

          <div class="hud-brand">
            <div class="tricolor-badge">
              <span class="saffron"></span>
              <span class="white"></span>
              <span class="green"></span>
            </div>
            <div class="brand-text">
              <h1>BHARAT 3D <span class="badge-tag">FULLY ANIMATED 3D</span></h1>
              <p class="brand-sub">ALL 28 STATES • 8 UNION TERRITORIES • ARCHITECTURAL MONUMENTS</p>
            </div>
          </div>
        </div>

        <!-- Center 4-Mode View Switcher -->
        <div class="view-switcher">
          <button class="view-btn active" data-mode="city">
            <span class="icon">🏙️</span> 3D MONUMENTS & CITY
          </button>
          <button class="view-btn" data-mode="space">
            <span class="icon">🪐</span> 3D SPACE GLOBE
          </button>
          <button class="view-btn" data-mode="cesium">
            <span class="icon">🌐</span> SATELLITE 3D
          </button>
          <button class="view-btn" data-mode="google-maps">
            <span class="icon">🛰️</span> GOOGLE AERIAL
          </button>
        </div>

        <!-- Top Right Controls -->
        <div class="topbar-right">
          <div class="telemetry-pill" id="telemetry-pill">
            <span class="pulse-dot"></span>
            <span class="tel-text" id="pill-coords">New Delhi • 3D Drone View</span>
          </div>

          <button class="action-pill" id="sound-btn" title="Toggle Space Audio">
            <span id="sound-icon">🔇</span>
          </button>

          <button class="action-pill" id="settings-btn" title="Google 3D Tiles Settings">
            <span>⚙️</span>
          </button>

          <button class="drawer-toggle-btn" id="toggle-right-btn" title="Toggle Location Details">
            <span class="btn-icon">ℹ️</span> <span class="btn-text">DETAILS</span>
          </button>
        </div>
      </header>

      <!-- Left Drawer: State & City Navigator -->
      <aside class="left-drawer ${this.leftDrawerOpen ? 'open' : ''}" id="left-drawer">
        <div class="drawer-header">
          <div class="dh-title">
            <h2>STATES & CITIES OF INDIA</h2>
            <span class="dh-sub">Select any region to fly and view in animated 3D</span>
          </div>
          <button class="close-drawer-btn" id="close-left-drawer">✕</button>
        </div>

        <!-- Search Bar -->
        <div class="search-box">
          <span class="s-icon">🔍</span>
          <input type="text" id="search-input" placeholder="Search state, city, monument (e.g. Hyderabad, Taj Mahal)...">
          <button class="clear-search-btn" id="clear-search" style="display:none;">✕</button>
        </div>

        <!-- Region Filters -->
        <div class="filter-chips" id="filter-chips">
          <button class="chip active" data-filter="all">All (44)</button>
          <button class="chip" data-filter="metros">Top Metros</button>
          <button class="chip" data-filter="North">North</button>
          <button class="chip" data-filter="South">South</button>
          <button class="chip" data-filter="West">West</button>
          <button class="chip" data-filter="East">East</button>
          <button class="chip" data-filter="Central">Central</button>
          <button class="chip" data-filter="North-East">North-East</button>
          <button class="chip" data-filter="Islands">Islands/UT</button>
        </div>

        <!-- Locations Card List -->
        <div class="locations-scroll" id="locations-scroll">
          <!-- Populated dynamically -->
        </div>
      </aside>

      <!-- Right Drawer: Location Intelligence & Media Card -->
      <aside class="right-drawer ${this.rightDrawerOpen ? 'open' : ''}" id="right-drawer">
        <div class="rd-header">
          <button class="close-drawer-btn" id="close-right-drawer">✕</button>
        </div>

        <!-- Hero Photo -->
        <div class="location-hero-media" id="hero-media">
          <img id="hero-img" src="${this.activeLocation.image || 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80'}" alt="${this.activeLocation.name}">
          <div class="hero-overlay">
            <span class="location-badge" id="loc-badge">NATIONAL CAPITAL</span>
            <h2 class="location-title" id="loc-title">New Delhi</h2>
            <span class="location-hindi" id="loc-hindi">नई दिल्ली</span>
          </div>
        </div>

        <!-- Quick 3D View Switcher Actions for this Location -->
        <div class="location-action-bar">
          <button class="act-btn primary-3d-btn" id="btn-view-3d-monument">
            <span class="icon">🏙️</span> 3D MONUMENT MODEL
          </button>
          <button class="act-btn secondary-3d-btn" id="btn-fly-space">
            <span class="icon">🪐</span> FLY FROM SPACE
          </button>
          <a class="act-btn google-earth-btn" id="open-ge-link" href="${this.activeLocation.googleEarthUrl || '#'}" target="_blank" rel="noopener noreferrer">
            <span class="icon">🌍</span> OPEN IN GOOGLE EARTH 3D ↗
          </a>
        </div>

        <!-- Narrative Highlight -->
        <p class="location-highlight" id="loc-highlight">
          ${this.activeLocation.highlight || ''}
        </p>

        <!-- Stats Grid -->
        <div class="stats-row">
          <div class="stat-box">
            <span class="stat-label">Elevation</span>
            <span class="stat-value" id="loc-elev">${this.activeLocation.elevationM || 216} m</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">Coordinates</span>
            <span class="stat-value" id="loc-coords">${this.activeLocation.lat ? this.activeLocation.lat.toFixed(2) : 28.61}°N</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">Region</span>
            <span class="stat-value" id="loc-state">${this.activeLocation.state || 'India'}</span>
          </div>
        </div>

        <!-- Monuments / Highlights Section -->
        <div class="monuments-container">
          <h3>KEY 3D LANDMARKS & HERITAGE</h3>
          <div class="monuments-list" id="loc-monuments">
            <!-- Dynamic items -->
          </div>
        </div>
      </aside>

      <!-- Bottom Floating Flight Control Deck -->
      <footer class="bottom-dock">
        <!-- Tour of India Player -->
        <div class="dock-segment tour-segment">
          <span class="dock-title">GRAND TOUR OF INDIA</span>
          <div class="tour-controls">
            <button class="dock-btn" id="tour-prev-btn" title="Previous Destination">⏮</button>
            <button class="dock-btn play-tour-btn" id="tour-play-btn">
              <span id="tour-icon">▶</span> <span id="tour-label">START TOUR</span>
            </button>
            <button class="dock-btn" id="tour-next-btn" title="Next Destination">⏭</button>
          </div>
          <span class="tour-status" id="tour-status">Automated cinematic flight across India</span>
        </div>

        <!-- Altitude Zoom Slider -->
        <div class="dock-segment slider-segment">
          <div class="dock-label-row">
            <span class="dock-title">ALTITUDE ZOOM</span>
            <span class="dock-readout" id="alt-readout">150 m (City)</span>
          </div>
          <input type="range" id="alt-slider" min="50" max="1000" value="150" step="10">
          <div class="slider-ticks">
            <span>Street (50m)</span>
            <span>Drone (250m)</span>
            <span>High Altitude (1km)</span>
          </div>
        </div>

        <!-- Camera Presets -->
        <div class="dock-segment preset-segment">
          <span class="dock-title">CAMERA ORBIT</span>
          <div class="preset-buttons">
            <button class="preset-btn active" data-preset="orbit">360° Orbit</button>
            <button class="preset-btn" data-preset="cinematic">45° Angle</button>
            <button class="preset-btn" data-preset="nadir">Top-Down</button>
          </div>
        </div>
      </footer>

      <!-- Google Earth 3D Tiles Modal -->
      <div class="modal-layer" id="settings-modal" style="display: none;">
        <div class="modal-box">
          <div class="modal-top">
            <h3>GOOGLE EARTH 3D TILES CONFIGURATION</h3>
            <button class="close-modal" id="close-modal-btn">✕</button>
          </div>
          <div class="modal-content">
            <p>
              Stream official <strong>Google Photorealistic 3D Tiles</strong> across India with sub-meter 3D building meshes.
            </p>
            <div class="input-field">
              <label>Google Maps API Key (with Map Tiles API enabled):</label>
              <input type="password" id="google-key-input" placeholder="AIzaSy..." class="text-input">
              <small>Enable 'Map Tiles API' in your Google Cloud Console.</small>
            </div>
            <div class="modal-note">
              ✨ <em>Instant High-Res Mode:</em> Bharat 3D already streams high-definition sub-meter satellite photography, 3D architectural monuments, and planetary space views out of the box!
            </div>
          </div>
          <div class="modal-bottom">
            <button class="btn btn-muted" id="cancel-modal-btn">Close</button>
            <button class="btn btn-accent" id="save-tiles-btn">Activate Google 3D</button>
          </div>
        </div>
      </div>
    `;

    this.renderLocationsList();
    this.updateRightDrawer(this.activeLocation);
  }

  renderLocationsList() {
    const scrollEl = document.getElementById('locations-scroll');
    if (!scrollEl) return;

    let items = [];

    // Filter logic
    if (this.activeFilter === 'metros' || this.activeFilter === 'all') {
      items = items.concat(MAJOR_CITIES.map(c => ({ ...c, isCity: true })));
    }

    if (this.activeFilter !== 'metros') {
      const filteredStates = ALL_INDIAN_STATES_UTS.filter(s => {
        if (this.activeFilter === 'all') return true;
        if (this.activeFilter === 'Islands') return s.region === 'Islands';
        return s.region === this.activeFilter;
      });
      items = items.concat(filteredStates.map(s => ({ ...s, isState: true })));
    }

    // Search filter
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      items = items.filter(item =>
        item.name.toLowerCase().includes(q) ||
        (item.hindiName && item.hindiName.includes(q)) ||
        (item.capital && item.capital.toLowerCase().includes(q)) ||
        (item.state && item.state.toLowerCase().includes(q)) ||
        (item.highlight && item.highlight.toLowerCase().includes(q))
      );
    }

    if (items.length === 0) {
      scrollEl.innerHTML = `<div class="empty-search">No results found for "${this.searchQuery}"</div>`;
      return;
    }

    scrollEl.innerHTML = items.map(item => {
      const isCity = item.isCity;
      const subtitle = isCity ? (item.state || 'Major City') : `Capital: ${item.capital}`;
      const badge = isCity ? 'CITY' : 'STATE / UT';
      const isSelected = this.activeLocation && this.activeLocation.name === item.name;

      return `
        <div class="loc-card ${isSelected ? 'selected' : ''}" data-name="${item.name}">
          <div class="loc-card-media">
            <img src="${item.image || 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=150&q=60'}" alt="${item.name}" loading="lazy">
          </div>
          <div class="loc-card-details">
            <div class="loc-card-name-row">
              <span class="loc-card-name">${item.name}</span>
              <span class="loc-card-badge ${isCity ? 'badge-city' : 'badge-state'}">${badge}</span>
            </div>
            <span class="loc-card-sub">${subtitle}</span>
          </div>
          <button class="loc-card-fly" title="Fly to 3D View">FLY ➔</button>
        </div>
      `;
    }).join('');

    // Bind card clicks
    scrollEl.querySelectorAll('.loc-card').forEach(card => {
      card.addEventListener('click', () => {
        const name = card.getAttribute('data-name');
        const city = MAJOR_CITIES.find(c => c.name === name);
        if (city) {
          this.activeLocation = city;
          this.updateRightDrawer(city);
          this.highlightSelectedCard(name);
          if (this.onSelectCity) this.onSelectCity(city);
        } else {
          const state = ALL_INDIAN_STATES_UTS.find(s => s.name === name);
          if (state) {
            this.activeLocation = state;
            this.updateRightDrawer(state);
            this.highlightSelectedCard(name);
            if (this.onSelectState) this.onSelectState(state);
          }
        }
      });
    });
  }

  highlightSelectedCard(name) {
    document.querySelectorAll('.loc-card').forEach(c => {
      c.classList.toggle('selected', c.getAttribute('data-name') === name);
    });
  }

  updateRightDrawer(item) {
    this.activeLocation = item;
    const heroImg = document.getElementById('hero-img');
    const badge = document.getElementById('loc-badge');
    const title = document.getElementById('loc-title');
    const hindi = document.getElementById('loc-hindi');
    const highlight = document.getElementById('loc-highlight');
    const elev = document.getElementById('loc-elev');
    const coords = document.getElementById('loc-coords');
    const state = document.getElementById('loc-state');
    const geLink = document.getElementById('open-ge-link');
    const monList = document.getElementById('loc-monuments');

    if (heroImg) {
      heroImg.src = item.image || 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80';
    }
    if (badge) badge.textContent = item.type || (item.capital ? `STATE CAPITAL: ${item.capital}` : 'INDIA REGION');
    if (title) title.textContent = item.name;
    if (hindi) hindi.textContent = item.hindiName || (item.capital ? `राजधानी: ${item.capital}` : '');
    if (highlight) highlight.textContent = item.highlight || '';
    if (elev) elev.textContent = item.elevationM ? `${item.elevationM} m` : 'Variable';
    if (coords) coords.textContent = `${item.lat ? item.lat.toFixed(2) : 20.59}°N, ${item.lng ? item.lng.toFixed(2) : 78.96}°E`;
    if (state) state.textContent = item.state || item.region || 'India';

    if (geLink) {
      geLink.href = item.googleEarthUrl || `https://earth.google.com/web/@${item.lat},${item.lng},1000a,1500d,35y,0h,60t,0r`;
    }

    if (monList) {
      if (item.monuments && item.monuments.length > 0) {
        monList.innerHTML = item.monuments.map(m => `
          <div class="monument-card">
            <span class="m-icon">🏛️</span>
            <div class="m-text">
              <span class="m-title">${m.name}</span>
              <span class="m-desc">${m.type} • Height: ${m.heightM}m</span>
            </div>
          </div>
        `).join('');
      } else {
        monList.innerHTML = `
          <div class="monument-card">
            <span class="m-icon">📍</span>
            <div class="m-text">
              <span class="m-title">Capital: ${item.capital || item.name}</span>
              <span class="m-desc">Regional Hub • Coordinates: ${item.lat.toFixed(2)}°N, ${item.lng.toFixed(2)}°E</span>
            </div>
          </div>
        `;
      }
    }

    if (window.innerWidth >= 1024) {
      this.setRightDrawerOpen(true);
    }
  }

  updateTelemetry(data) {
    const pill = document.getElementById('pill-coords');
    if (pill && data) {
      pill.textContent = `${data.latitude}°N, ${data.longitude}°E • ${data.altitudeText || '3D View'}`;
    }
  }

  setLeftDrawerOpen(open) {
    this.leftDrawerOpen = open;
    const drawer = document.getElementById('left-drawer');
    if (drawer) drawer.classList.toggle('open', open);
  }

  setRightDrawerOpen(open) {
    this.rightDrawerOpen = open;
    const drawer = document.getElementById('right-drawer');
    if (drawer) drawer.classList.toggle('open', open);
  }

  setModeButtonActive(mode) {
    this.currentMode = mode;
    document.querySelectorAll('.view-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-mode') === mode);
    });

    // Update altitude slider range according to mode
    const altSlider = document.getElementById('alt-slider');
    const altReadout = document.getElementById('alt-readout');
    if (altSlider) {
      if (mode === 'city') {
        altSlider.min = '50';
        altSlider.max = '600';
        altSlider.value = '160';
        if (altReadout) altReadout.textContent = '160 m (3D Drone)';
      } else if (mode === 'space') {
        altSlider.min = '500';
        altSlider.max = '20000';
        altSlider.value = '4200';
        if (altReadout) altReadout.textContent = '4,200 km (Space)';
      } else if (mode === 'cesium') {
        altSlider.min = '500';
        altSlider.max = '6500000';
        altSlider.value = '1500';
        if (altReadout) altReadout.textContent = '1.5 km (Satellite)';
      }
    }
  }

  bindEvents() {
    // Drawer Toggles
    const toggleLeftBtn = document.getElementById('toggle-left-btn');
    const closeLeftBtn = document.getElementById('close-left-drawer');
    if (toggleLeftBtn) toggleLeftBtn.addEventListener('click', () => this.setLeftDrawerOpen(!this.leftDrawerOpen));
    if (closeLeftBtn) closeLeftBtn.addEventListener('click', () => this.setLeftDrawerOpen(false));

    const toggleRightBtn = document.getElementById('toggle-right-btn');
    const closeRightBtn = document.getElementById('close-right-drawer');
    if (toggleRightBtn) toggleRightBtn.addEventListener('click', () => this.setRightDrawerOpen(!this.rightDrawerOpen));
    if (closeRightBtn) closeRightBtn.addEventListener('click', () => this.setRightDrawerOpen(false));

    // View Switcher Buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-mode');
        this.setModeButtonActive(mode);
        if (this.onModeChange) this.onModeChange(mode);
      });
    });

    // Right Drawer Direct View Switchers
    const btnView3D = document.getElementById('btn-view-3d-monument');
    const btnFlySpace = document.getElementById('btn-fly-space');

    if (btnView3D) {
      btnView3D.addEventListener('click', () => {
        this.setModeButtonActive('city');
        if (this.onModeChange) this.onModeChange('city');
      });
    }

    if (btnFlySpace) {
      btnFlySpace.addEventListener('click', () => {
        this.setModeButtonActive('space');
        if (this.onModeChange) this.onModeChange('space');
      });
    }

    // Sound Toggle
    const soundBtn = document.getElementById('sound-btn');
    const soundIcon = document.getElementById('sound-icon');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        if (this.onToggleSound) {
          const isAudioOn = this.onToggleSound();
          soundIcon.textContent = isAudioOn ? '🔊' : '🔇';
          soundBtn.classList.toggle('active', isAudioOn);
        }
      });
    }

    // Settings Modal
    const settingsBtn = document.getElementById('settings-btn');
    const modal = document.getElementById('settings-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const cancelModalBtn = document.getElementById('cancel-modal-btn');
    const saveTilesBtn = document.getElementById('save-tiles-btn');

    if (settingsBtn && modal) settingsBtn.addEventListener('click', () => modal.style.display = 'flex');
    if (closeModalBtn) closeModalBtn.addEventListener('click', () => modal.style.display = 'none');
    if (cancelModalBtn) cancelModalBtn.addEventListener('click', () => modal.style.display = 'none');

    if (saveTilesBtn) {
      saveTilesBtn.addEventListener('click', () => {
        const apiKey = document.getElementById('google-key-input').value.trim();
        if (this.onGoogleApiKeySubmit) this.onGoogleApiKeySubmit(apiKey);
        modal.style.display = 'none';
      });
    }

    // Search Input
    const searchInput = document.getElementById('search-input');
    const clearBtn = document.getElementById('clear-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        if (clearBtn) clearBtn.style.display = this.searchQuery ? 'block' : 'none';
        this.renderLocationsList();
      });
    }
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        this.searchQuery = '';
        clearBtn.style.display = 'none';
        this.renderLocationsList();
      });
    }

    // Filter Chips
    document.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.activeFilter = chip.getAttribute('data-filter');
        this.renderLocationsList();
      });
    });

    // Altitude Slider
    const altSlider = document.getElementById('alt-slider');
    const altReadout = document.getElementById('alt-readout');
    if (altSlider) {
      altSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        if (altReadout) {
          if (this.currentMode === 'city') altReadout.textContent = `${val.toFixed(0)} m (3D Drone)`;
          else if (this.currentMode === 'space') altReadout.textContent = `${val.toFixed(0)} km (Space)`;
          else altReadout.textContent = val > 10000 ? `${(val / 1000).toFixed(0)} km` : `${val.toFixed(0)} m`;
        }
        if (this.onAltitudeChange) this.onAltitudeChange(val);
      });
    }

    // Camera Presets
    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const preset = btn.getAttribute('data-preset');
        if (this.onCameraPreset) this.onCameraPreset(preset);
      });
    });

    // Grand Tour
    const tourPlayBtn = document.getElementById('tour-play-btn');
    const tourPrev = document.getElementById('tour-prev-btn');
    const tourNext = document.getElementById('tour-next-btn');

    if (tourPlayBtn) tourPlayBtn.addEventListener('click', () => this.toggleGrandTour());
    if (tourPrev) tourPrev.addEventListener('click', () => this.stepTour(-1));
    if (tourNext) tourNext.addEventListener('click', () => this.stepTour(1));
  }

  toggleGrandTour() {
    this.isTourPlaying = !this.isTourPlaying;
    const icon = document.getElementById('tour-icon');
    const label = document.getElementById('tour-label');
    const status = document.getElementById('tour-status');

    if (this.isTourPlaying) {
      icon.textContent = '⏸';
      label.textContent = 'PAUSE TOUR';
      status.textContent = `Auto-Flying India: (${this.tourIndex + 1}/${MAJOR_CITIES.length})`;
      this.runTourStep();
    } else {
      icon.textContent = '▶';
      label.textContent = 'RESUME TOUR';
      status.textContent = 'Tour paused. Click to resume.';
      if (this.tourTimer) clearTimeout(this.tourTimer);
    }
  }

  stepTour(delta) {
    this.tourIndex = (this.tourIndex + delta + MAJOR_CITIES.length) % MAJOR_CITIES.length;
    this.runTourStep();
  }

  runTourStep() {
    const city = MAJOR_CITIES[this.tourIndex];
    this.activeLocation = city;
    this.updateRightDrawer(city);
    this.highlightSelectedCard(city.name);

    const status = document.getElementById('tour-status');
    if (status) status.textContent = `Flying: ${city.name} (${city.type || 'India'}) [${this.tourIndex + 1}/${MAJOR_CITIES.length}]`;

    if (this.onSelectCity) this.onSelectCity(city);

    if (this.isTourPlaying) {
      if (this.tourTimer) clearTimeout(this.tourTimer);
      this.tourTimer = setTimeout(() => {
        if (this.isTourPlaying) {
          this.tourIndex = (this.tourIndex + 1) % MAJOR_CITIES.length;
          this.runTourStep();
        }
      }, 7000);
    }
  }

  startClock() {
    // Clock helper
  }
}
