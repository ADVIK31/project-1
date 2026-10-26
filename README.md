# CIVICMIND AI 3.0 | Cognitive Urban Governance & 3D Digital Twin

An integrated smart city operating system that fuses an **immersive Three.js 3D WebGL Digital Twin** with a **Cognitive AI incident triage and exact geospatial dispatch platform**.

---

## 📁 Project Structure

```
civicmind-ai/
├── server.js               # Node.js / Express REST API & Cognitive AI backend
├── package.json            # Project dependencies & npm run scripts
├── .env.example            # Environment configuration (PORT=8080)
├── data/
│   └── incidents.json      # Persistent JSON database (auto-seeded)
├── public/
│   └── index.html          # Web application root (served by Express)
├── index.html              # Standalone web app (direct file execution)
├── t.html                  # Synced mirror file
└── README.md               # Documentation & API specifications
```

---

## ⚡ Quick Start

### Option 1: Run Full-Stack with Node.js Backend (Recommended)

1. Open your terminal in the project directory:
   ```bash
   cd "C:\Users\ACER\.gemini\antigravity-ide\scratch\civicmind-ai"
   # or on your E: drive:
   cd "E:\civicmind-ai"
   ```

2. Start the backend server:
   ```bash
   node server.js
   # or with npm:
   npm start
   ```

3. Open your browser and navigate to:
   **[http://localhost:8080](http://localhost:8080)**

---

### Option 2: Standalone Direct File Mode (Zero Install / Offline)

You can also run the application directly without running the backend! The frontend has built-in offline intelligence and seamlessly persists data to `localStorage`:
* Double-click `index.html` or `t.html` in Windows Explorer, or
* Open `e:\To achieve this, I have integrated the t.html` directly in your browser.

---

## 🌌 System Features

### 1. 3D Digital Twin Experience (`t.html`)
* **Dynamic Camera Flight Path**: Kinetic flight along a 3D Catmull-Rom spline curve with atmospheric fog and particle clouds.
* **3D Incident Beacons**: Active city hazards appear directly inside the WebGL scene as pulsating rings. Hovering displays a diagnostic card; clicking inspects the dossier in the Command Center.
* **Holographic Cognitive Core**: Multi-axis rotating gimbal ring with inner morphing icosahedron representing the city's central AI hub.
* **HUD Telemetry**: Live altitude, flight velocity, and sector tracking.

### 2. Cognitive Urban Operations Center (`index.html`)
* **Dual-Mode Viewport Switcher**: Instantly toggle between `[🌌 3D DIGITAL TWIN]` and `[⚡ COMMAND MATRIX]`.
* **CognitiveAI 3.0 Engine**: Multi-vector NLP risk assessment calculating threat score, panic velocity, and **spatial cluster anomalies** (+risk boost if multiple reports happen within 1.5km).
* **AI Computer Vision Evidence Scanner**: Drag & drop or upload damage photos with real-time green laser scanline and bounding box classification (`98.4% Confidence`). One-click sample test photos auto-fill the form!
* **Voice-to-Report Dictation**: Natural language voice input using Web Speech API with real-time waveform visualizer.
* **Exact GPS Geolocation & Leaflet Maps**:
  * "Locate My Exact Position (GPS)" with high-accuracy mode.
  * Draggable custom neon pin with real-time coordinate readout (`Lat`, `Lng`, `Sector`).
  * Reverse geocoding via OpenStreetMap with fallback to metropolitan grid designation.
  * Tactical Metropolitan Radar Map with severity-based filtering.
* **Admin Command Center**: Search filter with live keyup filtering, category dropdowns, inspector modal, and field crew dispatch.
* **AI Copilot Drawer**: Cyberpunk assistant chatbot providing natural language hazard summaries and emergency response protocols.
* **Web Audio Synthesizer**: Native Web Audio API sound engine (pings, alarms, scans, clicks) with HUD Mute/Unmute toggle.

---

## 📡 REST API Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/incidents` | List all incidents (supports `?category=`, `?status=`, `?level=`, `?search=`) |
| `POST` | `/api/incidents` | Submit new incident; runs server-side CognitiveAI 3.0 triage |
| `GET` | `/api/incidents/:id` | Fetch detailed incident dossier by ID |
| `PATCH` | `/api/incidents/:id` | Update status (`Submitted`, `AI Triaged`, `Unit Dispatched`, `In Progress`, `Resolved`) and assign crew |
| `DELETE` | `/api/incidents/:id` | Remove an incident |
| `GET` | `/api/analytics` | Summary KPI metrics and breakdown for charts |
| `GET` | `/api/sensors` | Live simulated IoT smart city sensor feeds (AQI, Grid load, Water pressure, Transit flow) |
| `POST` | `/api/ai/vision-scan` | Computer vision hazard classification endpoint |
| `POST` | `/api/ai/copilot` | Natural language AI assistant endpoint |
| `POST` | `/api/reset-demo` | Reset database to default sample incidents |
