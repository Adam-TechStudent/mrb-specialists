// Google Translate API through Backend Proxy
const API_BASE_URL = "http://localhost:3000/api";

let currentLanguage = "en";
let translationCache = JSON.parse(localStorage.getItem('translationCache') || '{}');
let originalContent = {};
let currentTranslatedContent = {};

// Get all text elements
function getTextElements() {
    const elements = [];
    const contentDiv = document.querySelector('.content');
    
    const walker = document.createTreeWalker(
        contentDiv,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );

    let node;
    while (node = walker.nextNode()) {
        const text = node.textContent.trim();
        if (text.length > 0 && !isOnlyWhitespace(text)) {
            elements.push({
                node: node,
                text: text,
                parent: node.parentElement
            });
        }
    }
    return elements;
}

function isOnlyWhitespace(text) {
    return /^\s*$/.test(text);
}

// Translate text using backend proxy
async function translateText(text, sourceLang, targetLang) {
    if (sourceLang === targetLang) {
        return text;
    }

    const cacheKey = `${text}|${sourceLang}|${targetLang}`;
    
    if (translationCache[cacheKey]) {
        return translationCache[cacheKey];
    }

    try {
        const response = await fetch(`${API_BASE_URL}/translate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: text,
                sourceLang: sourceLang,
                targetLang: targetLang
            })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        const translatedText = data.translatedText || text;
        
        translationCache[cacheKey] = translatedText;
        localStorage.setItem('translationCache', JSON.stringify(translationCache));
        
        return translatedText;

    } catch (error) {
        console.error("Translation error:", error);
        return text;
    }
}

// Show loading indicator
function showLoading() {
    document.getElementById('loading').classList.remove('hidden');
}

// Hide loading indicator
function hideLoading() {
    document.getElementById('loading').classList.add('hidden');
}

// Store original content
function storeOriginalContent() {
    const elements = getTextElements();
    elements.forEach((el, index) => {
        originalContent[index] = {
            text: el.text,
            node: el.node
        };
        currentTranslatedContent[index] = el.text;
    });
}

// Switch language
async function switchLanguage(lang) {
    if (lang === currentLanguage) return;

    showLoading();

    // Update active button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-lang="${lang}"]`).classList.add('active');

    const previousLanguage = currentLanguage;
    currentLanguage = lang;

    if (lang === "en") {
        // Reset to English (original content)
        const elements = getTextElements();
        elements.forEach((el, index) => {
            if (originalContent[index]) {
                el.node.textContent = originalContent[index].text;
                currentTranslatedContent[index] = originalContent[index].text;
            }
        });
        resetFormElements();
    } else {
        // Translate all content from current language to target language
        const elements = getTextElements();

        for (let index = 0; index < elements.length; index++) {
            const element = elements[index];
            const sourceText = currentTranslatedContent[index] || element.text;
            
            const translatedText = await translateText(sourceText, previousLanguage, lang);
            element.node.textContent = translatedText;
            currentTranslatedContent[index] = translatedText;
        }

        // Translate form elements
        await translateFormElements(previousLanguage, lang);
    }

    hideLoading();
}

// Translate form elements
async function translateFormElements(sourceLang, targetLang) {
    // Translate input placeholders
    const inputs = document.querySelectorAll('input[placeholder], textarea[placeholder]');
    for (const el of inputs) {
        const placeholder = el.getAttribute('placeholder');
        if (placeholder) {
            const translatedText = await translateText(placeholder, sourceLang, targetLang);
            el.setAttribute('placeholder', translatedText);
        }
    }

    // Translate labels
    const labels = document.querySelectorAll('label');
    for (const label of labels) {
        const text = label.textContent.trim();
        if (text) {
            const translatedText = await translateText(text, sourceLang, targetLang);
            label.textContent = translatedText;
        }
    }
}

// Reset form elements to original
function resetFormElements() {
    document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(el => {
        if (el.id === 'name') el.setAttribute('placeholder', 'Enter your full name');
        if (el.id === 'email') el.setAttribute('placeholder', 'Enter your email address');
        if (el.id === 'message') el.setAttribute('placeholder', 'Type your message here');
    });

    document.querySelectorAll('label').forEach(label => {
        const forAttr = label.getAttribute('for');
        if (forAttr === 'name') label.textContent = 'Your Name';
        if (forAttr === 'email') label.textContent = 'Email Address';
        if (forAttr === 'message') label.textContent = 'Message';
    });
}

// Event listeners
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');
        switchLanguage(lang);
    });
});

// Form submission
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    document.getElementById('contactForm').reset();
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    storeOriginalContent();
    console.log('Website loaded. Backend server must be running on port 3000!');
    console.log('Run: node server.js');
});