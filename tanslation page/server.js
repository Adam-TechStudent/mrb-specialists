// Backend Server for Google Translate Proxy
const express = require('express');
const cors = require('cors');
const translate = require('@google-cloud/translate').v2;

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Google Translate (no API key needed - uses default credentials)
// For development, we'll use a free workaround
const googleTranslate = require('google-translate-api-x');

// Translation endpoint
app.post('/api/translate', async (req, res) => {
    try {
        const { text, sourceLang, targetLang } = req.body;

        if (!text || !targetLang) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Use google-translate-api-x (free, no API key needed)
        const result = await googleTranslate.translate(text, {
            from: sourceLang || 'en',
            to: targetLang
        });

        res.json({
            translatedText: result[0],
            success: true
        });

    } catch (error) {
        console.error('Translation error:', error);
        res.status(500).json({
            error: 'Translation failed',
            message: error.message
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running', port: PORT });
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Translation server running on http://localhost:${PORT}`);
    console.log('Powered by Google Translate API');
});