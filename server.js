/**
 * CIVICMIND AI 3.0 - BACKEND SERVER
 * Cognitive Urban Governance & Neural Smart City Platform
 * Express REST API + Autonomous Cognitive AI Engine + Persistent JSON Store
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;
const DATA_DIR = path.join(__dirname, 'data');
const DB_PATH = path.join(DATA_DIR, 'incidents.json');

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static frontend assets
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname)); // Also serves root index.html / t.html

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Default Seed Data
const DEFAULT_INCIDENTS = [
    {
        id: 'CIV-101',
        title: 'High-Pressure Water Main Fracture',
        desc: 'Sub-surface distribution pipe ruptured creating significant street flooding and road subsidence risk.',
        category: 'Water & Sewage',
        urgency: 'Critical',
        location: 'Grand Cyber Plaza, Sector 4',
        lat: 40.7138,
        lng: -74.0045,
        status: 'Unit Dispatched',
        crew: 'Crew Gamma-2 (Sanitation & Water)',
        date: new Date(Date.now() - 3600000).toLocaleString()
    },
    {
        id: 'CIV-102',
        title: 'Structural Fissure on Overpass Flyover',
        desc: 'Thermal expansion crack propagating across load-bearing abutment B4. Vibration meters registering anomalies.',
        category: 'Structural & Roads',
        urgency: 'High',
        location: 'Metropolitan Flyover, Abutment B4',
        lat: 40.7165,
        lng: -74.0080,
        status: 'In Progress',
        crew: 'Crew Beta-4 (Heavy Civil Repairs)',
        date: new Date(Date.now() - 7200000).toLocaleString()
    },
    {
        id: 'CIV-103',
        title: 'High-Voltage Cable Severed near School',
        desc: 'Downed power distribution cable sparking intermittently near pedestrian boulevard. Immediate safety perimeter required.',
        category: 'Power & Electrical Grid',
        urgency: 'Critical',
        location: 'Lexington Tech District, Block 12',
        lat: 40.7110,
        lng: -74.0020,
        status: 'Submitted',
        crew: 'Crew Delta-9 (High Voltage Power)',
        date: new Date(Date.now() - 1800000).toLocaleString()
    },
    {
        id: 'CIV-104',
        title: 'Hazardous Chemical Runoff in Drain',
        desc: 'Iridescent chemical sludge observed discharging into storm drainage canal. Foul vapors reported by residents.',
        category: 'Sanitation & Hazardous Waste',
        urgency: 'High',
        location: 'Industrial Canal, Dock 08',
        lat: 40.7180,
        lng: -74.0110,
        status: 'AI Triaged',
        crew: 'Crew Alpha-1 (Emergency Hazmat)',
        date: new Date(Date.now() - 9000000).toLocaleString()
    },
    {
        id: 'CIV-105',
        title: 'Pedestrian Signal Grid Malfunction',
        desc: 'Crosswalk smart sensors displaying conflicting green intervals causing near-miss pedestrian collisions.',
        category: 'Public Safety & Hazards',
        urgency: 'Medium',
        location: '7th Avenue & Broadway Cross',
        lat: 40.7150,
        lng: -74.0050,
        status: 'Resolved',
        crew: 'Crew Beta-4 (Heavy Civil Repairs)',
        date: new Date(Date.now() - 25000000).toLocaleString()
    }
];

// Server-side Cognitive AI 3.0 Engine
class CognitiveAIEngine {
    static analyze(incident, existingIncidents = []) {
        const text = ((incident.title || '') + ' ' + (incident.desc || '')).toLowerCase();
        const userUrgency = incident.urgency || 'Medium';
        const category = incident.category || 'Structural & Roads';

        const riskKeywords = {
            critical: ['collapse', 'death', 'casualty', 'sparks', 'fire', 'electric', 'explosion', 'immediate', 'sinkhole', 'gas leak', 'toxic', 'rupture'],
            high: ['accident', 'severed', 'injury', 'flood', 'burst', 'crack', 'hazardous', 'exposed', 'overflow', 'failing', 'danger'],
            medium: ['blockage', 'smell', 'delay', 'pothole', 'broken', 'disruption', 'malfunction', 'leak', 'fault'],
            low: ['cosmetic', 'paint', 'cleaning', 'litter', 'routine', 'faded', 'minor']
        };

        let riskScore = 0;
        let reasons = [];

        const critMatches = riskKeywords.critical.filter(w => text.includes(w));
        if (critMatches.length > 0) {
            riskScore += 45;
            reasons.push(`Critical hazard vectors detected: "${critMatches.slice(0, 3).join(', ')}"`);
        }

        const highMatches = riskKeywords.high.filter(w => text.includes(w));
        if (highMatches.length > 0) {
            riskScore += 25;
            reasons.push(`High risk infrastructure markers: "${highMatches.slice(0, 3).join(', ')}"`);
        }

        const medMatches = riskKeywords.medium.filter(w => text.includes(w));
        if (medMatches.length > 0 && critMatches.length === 0) {
            riskScore += 12;
            reasons.push('Operational disruption indicators identified');
        }

        const urgencyWeights = { 'Low': 10, 'Medium': 25, 'High': 45, 'Critical': 60 };
        riskScore += urgencyWeights[userUrgency] || 25;

        // Spatial Proximity Cluster Detection
        if (incident.lat && incident.lng && existingIncidents.length > 0) {
            const nearby = existingIncidents.filter(other => {
                if (other.id === incident.id || !other.lat || !other.lng) return false;
                const dist = Math.hypot(other.lat - incident.lat, other.lng - incident.lng);
                return dist < 0.015;
            });
            if (nearby.length > 0) {
                const clusterBoost = Math.min(25, nearby.length * 8);
                riskScore += clusterBoost;
                reasons.push(`Spatial cluster alert: ${nearby.length} proximal incidents registered within 1.5km`);
            }
        }

        const finalScore = Math.min(100, Math.max(8, riskScore));

        let tier = 'Low';
        if (finalScore >= 80) tier = 'Critical';
        else if (finalScore >= 55) tier = 'High';
        else if (finalScore >= 30) tier = 'Medium';

        const deptMap = {
            'Structural & Roads': 'Civil Engineering & Bridge Authority',
            'Water & Sewage': 'Hydro-Grid & Wastewater Division',
            'Power & Electrical Grid': 'High-Voltage Smart Grid Authority',
            'Sanitation & Hazardous Waste': 'Rapid Hazmat & Ecological Ops',
            'Public Safety & Hazards': 'Integrated Emergency Dispatch'
        };

        const slaMap = {
            'Critical': 'Immediate (< 35 mins)',
            'High': 'Priority (< 2 hours)',
            'Medium': 'Scheduled (< 6 hours)',
            'Low': 'Routine (< 24 hours)'
        };

        return {
            score: finalScore,
            level: tier,
            department: deptMap[category] || 'Metropolitan General Operations',
            sla: slaMap[tier] || 'Standard SLA',
            reasoning: reasons.length ? reasons.join('. ') + '.' : 'Standard algorithmic triage applied based on baseline parameters.',
            confidence: (89 + (finalScore % 10)).toFixed(1) + '%'
        };
    }
}

// Database Helper
function readDatabase() {
    try {
        if (!fs.existsSync(DB_PATH)) {
            const seeded = DEFAULT_INCIDENTS.map(s => {
                s.ai = CognitiveAIEngine.analyze(s, DEFAULT_INCIDENTS);
                return s;
            });
            fs.writeFileSync(DB_PATH, JSON.stringify(seeded, null, 2), 'utf8');
            return seeded;
        }
        const raw = fs.readFileSync(DB_PATH, 'utf8');
        return JSON.parse(raw);
    } catch (err) {
        console.error('Error reading DB, re-seeding:', err);
        return DEFAULT_INCIDENTS;
    }
}

function writeDatabase(data) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

// Initialize DB on start
readDatabase();

// ==========================================
// REST API ROUTES
// ==========================================

// 1. GET /api/incidents - List all incidents with optional filters
app.get('/api/incidents', (req, res) => {
    const { category, status, level, search } = req.query;
    let data = readDatabase();

    if (category && category !== 'ALL') {
        data = data.filter(d => d.category === category);
    }
    if (status && status !== 'ALL') {
        data = data.filter(d => d.status === status);
    }
    if (level && level !== 'ALL') {
        data = data.filter(d => d.ai?.level === level);
    }
    if (search) {
        const q = search.toLowerCase();
        data = data.filter(d => 
            d.title.toLowerCase().includes(q) ||
            d.id.toLowerCase().includes(q) ||
            (d.location && d.location.toLowerCase().includes(q))
        );
    }

    res.json({
        success: true,
        count: data.length,
        incidents: data
    });
});

// 2. GET /api/incidents/:id - Get single incident
app.get('/api/incidents/:id', (req, res) => {
    const data = readDatabase();
    const incident = data.find(d => d.id.toUpperCase() === req.params.id.toUpperCase());
    if (!incident) {
        return res.status(404).json({ success: false, error: 'Incident not found' });
    }
    res.json({ success: true, incident });
});

// 3. POST /api/incidents - Create & Neural Triage new incident
app.post('/api/incidents', (req, res) => {
    const { title, desc, category, urgency, location, lat, lng } = req.body;

    if (!title || !desc) {
        return res.status(400).json({ success: false, error: 'Title and description are required.' });
    }

    const data = readDatabase();
    const newIncident = {
        id: 'CIV-' + Math.floor(1000 + Math.random() * 9000),
        title,
        desc,
        category: category || 'Structural & Roads',
        urgency: urgency || 'Medium',
        location: location || 'Metropolitan Sector',
        lat: parseFloat(lat) || 40.7128,
        lng: parseFloat(lng) || -74.0060,
        status: 'Submitted',
        crew: 'Unassigned (Awaiting AI Dispatch)',
        date: new Date().toLocaleString()
    };

    newIncident.ai = CognitiveAIEngine.analyze(newIncident, data);

    data.unshift(newIncident);
    writeDatabase(data);

    res.status(201).json({
        success: true,
        message: 'Incident logged and prioritized by CognitiveAI',
        incident: newIncident
    });
});

// 4. PATCH /api/incidents/:id - Update status / assign crew
app.patch('/api/incidents/:id', (req, res) => {
    const data = readDatabase();
    const idx = data.findIndex(d => d.id.toUpperCase() === req.params.id.toUpperCase());

    if (idx === -1) {
        return res.status(404).json({ success: false, error: 'Incident not found' });
    }

    const { status, crew, notes } = req.body;
    if (status) data[idx].status = status;
    if (crew) data[idx].crew = crew;
    if (notes) data[idx].adminNotes = notes;
    data[idx].lastUpdated = new Date().toLocaleString();

    writeDatabase(data);

    res.json({
        success: true,
        message: 'Incident updated successfully',
        incident: data[idx]
    });
});

// 5. DELETE /api/incidents/:id - Remove incident
app.delete('/api/incidents/:id', (req, res) => {
    let data = readDatabase();
    const initialLen = data.length;
    data = data.filter(d => d.id.toUpperCase() !== req.params.id.toUpperCase());

    if (data.length === initialLen) {
        return res.status(404).json({ success: false, error: 'Incident not found' });
    }

    writeDatabase(data);
    res.json({ success: true, message: `Incident ${req.params.id} deleted` });
});

// 6. GET /api/analytics - KPI metrics and breakdown
app.get('/api/analytics', (req, res) => {
    const data = readDatabase();
    const total = data.length;
    const critical = data.filter(d => d.ai?.level === 'Critical').length;
    const resolved = data.filter(d => d.status === 'Resolved').length;
    const inProgress = data.filter(d => d.status === 'In Progress').length;
    const avgScore = total ? Math.round(data.reduce((acc, cur) => acc + (cur.ai?.score || 50), 0) / total) : 0;

    const categories = {};
    data.forEach(d => categories[d.category] = (categories[d.category] || 0) + 1);

    const statuses = {};
    ['Submitted', 'AI Triaged', 'Unit Dispatched', 'In Progress', 'Resolved'].forEach(s => statuses[s] = 0);
    data.forEach(d => {
        if (statuses[d.status] !== undefined) statuses[d.status]++;
        else statuses[d.status] = 1;
    });

    res.json({
        success: true,
        kpi: {
            total,
            critical,
            resolved,
            inProgress,
            clearanceRate: total ? Math.round((resolved / total) * 100) : 0,
            cityHazardIndex: avgScore
        },
        breakdowns: {
            categories,
            statuses
        }
    });
});

// 7. GET /api/sensors - Real-time simulated IoT sensor telemetry
app.get('/api/sensors', (req, res) => {
    const aqi = 34 + Math.floor(Math.random() * 9);
    const powerLoad = (99.5 + Math.random() * 0.4).toFixed(1);
    const waterPressure = (4.1 + Math.random() * 0.3).toFixed(1);
    const latency = 10 + Math.floor(Math.random() * 5);

    res.json({
        success: true,
        telemetry: {
            airQuality: { value: aqi, unit: 'AQI', status: 'Optimal', sensorId: 'AQI-04' },
            powerGrid: { loadPercent: powerLoad, status: 'Stable', substation: 'Metro Main' },
            waterNetwork: { pressureBar: waterPressure, status: 'Nominal', sector: 'Sector 4' },
            transitGrid: { latencyMs: latency, status: 'Low Congestion', flowRate: '98.2%' },
            timestamp: new Date().toISOString()
        }
    });
});

// 8. POST /api/ai/vision-scan - Simulated AI Computer Vision Hazard Classification
app.post('/api/ai/vision-scan', (req, res) => {
    const { type } = req.body;

    const detectionMap = {
        crack: {
            detectedHazard: 'Sub-Structural Concrete Shear Fissure',
            category: 'Structural & Roads',
            urgency: 'Critical',
            confidence: '98.4%',
            recommendedAction: 'Immediate lane closure & acoustic resonance survey',
            boundingBox: { x: 180, y: 120, width: 240, height: 160 }
        },
        pipe: {
            detectedHazard: 'Pressurized Distribution Pipeline Rupture',
            category: 'Water & Sewage',
            urgency: 'Critical',
            confidence: '97.2%',
            recommendedAction: 'Remotely isolate valve station 12B and dispatch drainage team',
            boundingBox: { x: 220, y: 90, width: 280, height: 190 }
        },
        wire: {
            detectedHazard: 'Downed 13.8kV Conductor with Flash Arc',
            category: 'Power & Electrical Grid',
            urgency: 'Critical',
            confidence: '99.1%',
            recommendedAction: 'Trip substation breaker 4 and deploy hazmat dielectric crew',
            boundingBox: { x: 140, y: 110, width: 310, height: 210 }
        }
    };

    const result = detectionMap[type] || {
        detectedHazard: 'Unspecified Surface Anomaly Detected',
        category: 'Structural & Roads',
        urgency: 'Medium',
        confidence: '91.5%',
        recommendedAction: 'Field inspection recommended',
        boundingBox: { x: 100, y: 100, width: 200, height: 150 }
    };

    res.json({
        success: true,
        scanResult: result
    });
});

// 9. POST /api/ai/copilot - Intelligent Natural Language Assistant
app.post('/api/ai/copilot', (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
        return res.status(400).json({ success: false, error: 'Prompt is required' });
    }

    const data = readDatabase();
    const criticals = data.filter(d => d.ai?.level === 'Critical');
    const lower = prompt.toLowerCase();
    let reply = '';

    if (lower.includes('critical') || lower.includes('hazard') || lower.includes('threat')) {
        reply = `⚠️ **Critical Threat Report:** Currently **${criticals.length} Critical incidents** active on the grid.\n\n` +
            criticals.map(c => `• **${c.id}**: ${c.title} (${c.location}) - Status: ${c.status}`).join('\n') +
            `\n\n*All emergency response units have been assigned priority dispatch vectors.*`;
    } else if (lower.includes('summary') || lower.includes('status') || lower.includes('overview')) {
        const resolved = data.filter(d => d.status === 'Resolved').length;
        reply = `📊 **Metropolitan Grid Status:**\n• Total Tracked Incidents: ${data.length}\n• Resolved Incidents: ${resolved} (${Math.round(resolved / data.length * 100)}%)\n• Air Quality: 38 AQI (Optimal)\n• Power Grid: 99.8% Capacity (Nominal)\n• Hydro Network: 4.2 Bar Pressure`;
    } else if (lower.includes('water') || lower.includes('pipe') || lower.includes('flood')) {
        const waters = data.filter(d => d.category === 'Water & Sewage');
        reply = `💧 **Hydro-Grid Intelligence:** Found ${waters.length} active water & sewage reports. Sub-surface pressure sensors in Sector 4 are undergoing automated stabilization.`;
    } else {
        reply = `🤖 **CIVICMIND AI Copilot:** Telemetry analyzed your prompt: "${prompt}". City neural subsystems are operating within standard parameters. You can query threat levels, submit incident reports with exact GPS coordinates, or manage response crews in the Command Matrix.`;
    }

    res.json({
        success: true,
        response: reply
    });
});

// 10. POST /api/reset-demo - Re-seed default incidents
app.post('/api/reset-demo', (req, res) => {
    const seeded = DEFAULT_INCIDENTS.map(s => {
        s.ai = CognitiveAIEngine.analyze(s, DEFAULT_INCIDENTS);
        return s;
    });
    writeDatabase(seeded);
    res.json({ success: true, message: 'Database reset to default demo state', incidents: seeded });
});

// Start Server
app.listen(PORT, () => {
    console.log(`\n=======================================================`);
    console.log(`⚡ CIVICMIND AI 3.0 SERVER ACTIVE`);
    console.log(`🚀 URL: http://localhost:${PORT}`);
    console.log(`🌌 3D Digital Twin & Command Matrix: http://localhost:${PORT}/index.html`);
    console.log(`📡 REST API Base: http://localhost:${PORT}/api/incidents`);
    console.log(`=======================================================\n`);
});
