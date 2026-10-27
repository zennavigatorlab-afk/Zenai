import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    name: 'ZEN AI Control Center Backend',
    version: '1.0.0',
    mode: process.env.NODE_ENV || 'development',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Secure AI Assistant Endpoint (Online Mode)
app.post('/api/ai-assistant', async (req, res) => {
  try {
    const { prompt, deviceContext, mode = 'privacy_summary' } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY is not configured in environment secrets.',
        mode: 'fallback_to_local',
        message: 'Online AI requires a configured Gemini key. Use Local Offline Mode or configure your key in Secrets.',
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    // Sanitized context verification
    const safeContext = {
      batteryLevel: deviceContext?.batteryLevel ?? 'Unknown',
      chargingState: deviceContext?.chargingState ?? 'Unknown',
      availableStorageGB: deviceContext?.availableStorageGB ?? 'Unknown',
      topAppsByUsage: Array.isArray(deviceContext?.topAppsByUsage)
        ? deviceContext.topAppsByUsage.slice(0, 5)
        : [],
      notificationSummary: {
        totalLast24h: deviceContext?.notificationSummary?.totalLast24h ?? 0,
        mutedAppsCount: deviceContext?.notificationSummary?.mutedAppsCount ?? 0,
        topSenderApps: deviceContext?.notificationSummary?.topSenderApps ?? [],
      },
      callSummary: {
        missedCallsCount: deviceContext?.callSummary?.missedCallsCount ?? 0,
        totalIncomingDurationMinutes: deviceContext?.callSummary?.totalIncomingDurationMinutes ?? 0,
      },
      activePermissions: deviceContext?.activePermissions ?? [],
    };

    const systemInstruction = `You are ZEN AI, an authoritative, privacy-first personal Android Mobile Control Center intelligence engine.
Operating Principles:
1. Local-first & Zero Private Data Leakage: You strictly review aggregated device metadata, screen time statistics, and permitted notification trends. You never ask for or infer raw chat transcripts, contacts, or passwords.
2. Directness & Precision: Provide crisp, high-signal, bulleted insights and direct actionable recommendations.
3. Android Native Grounding: Ground all recommendations in standard Android system capabilities (e.g., Notification Channels, Usage Access, Adaptive Battery, Focus Mode, Do Not Disturb priority exceptions).
4. Honesty on Limits: When data is unpermitted or unavailable, state it plainly rather than hallucinating stats.
Response Format:
- Direct Answer / Assessment
- 2-3 Bulleted Action Items or Observations
- Relevant Android Settings Shortcut reference (e.g. Settings > Battery > Battery Saver, or Settings > Apps > Special App Access > Usage Access).`;

    const contents = `Device Context:
${JSON.stringify(safeContext, null, 2)}

User Question:
"${prompt}"

Please respond concisely and accurately according to your privacy rules.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.3,
      },
    });

    const reply = response.text || 'Unable to generate response from ZEN AI online engine.';
    return res.json({
      reply,
      source: 'gemini-3.8-flash',
      privacySanitized: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error generating AI response:', error?.message || error);
    return res.status(200).json({
      fallback: true,
      error: 'Online AI service unavailable',
      details: error?.message || 'Service unreachable',
      reply: null,
      message: 'Online AI returned an authentication or permission restriction. Falling back to local offline rule engine.',
    });
  }
});

// Setup Vite middleware in dev or static server in prod
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(port), '0.0.0.0', () => {
    console.log(`ZEN AI server active on http://0.0.0.0:${port}`);
  });
}

startServer();
