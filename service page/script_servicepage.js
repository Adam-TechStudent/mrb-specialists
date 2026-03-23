<script type="text/javascript"
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>

// ========================
// HIDE GOOGLE TRANSLATE POPUP BAR
// ========================
function hideGoogleTranslateBar() {
    const translateFrame = document.querySelector('.goog-te-banner-frame.skiptranslate');
    const translateBar = document.querySelector('.goog-te-banner-frame');
    const menuFrame = document.querySelector('.goog-te-menu-frame');
    const balloonFrame = document.querySelector('.goog-te-balloon-frame');

    if (translateFrame) translateFrame.style.display = 'none';
    if (translateBar) translateBar.style.display = 'none';
    if (menuFrame) menuFrame.style.display = 'none';
    if (balloonFrame) balloonFrame.style.display = 'none';

    document.body.style.top = '0';

    console.log('✅ Google Translate popup hidden');
}
// ========================
// GOOGLE TRANSLATE INITIALIZATION
// ========================
function googleTranslateElementInit() {
    try {
        new google.translate.TranslateElement({
            pageLanguage: 'en',
            includedLanguages: 'en,de,ja,es,fr',
            layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false
        }, 'google_translate_element');

        // Hide any Google Translate top banner after initialization
        setTimeout(() => {
            hideGoogleTranslateBar();
        }, 500);

        console.log('✅ Google Translate initialized - popup banner hidden');
    } catch (error) {
        console.error('❌ Google Translate error:', error);
    }
}

// ========================
// ADVANCED LANGUAGE MANAGER
// ========================
class LanguageManager {
    constructor() {
        this.currentLang = this.getStoredLanguage() || 'en';
        this.googleTranslateActive = false;
        this.isLoading = false;
        this.supportedLanguages = {
            en: { name: 'English', flag: '🇺🇸', nativeName: 'English' },
            de: { name: 'Deutsch', flag: '🇩🇪', nativeName: 'Deutsch' },
            ja: { name: '日本語', flag: '🇯🇵', nativeName: '日本語' },
            es: { name: 'Español', flag: '🇪🇸', nativeName: 'Español' },
            fr: { name: 'Français', flag: '🇫🇷', nativeName: 'Français' }
        };

        this.init();
    }

    init() {
        this.attachLanguageListeners();
        this.updateLanguageUI();
        console.log('✅ Language Manager initialized');
    }

    attachLanguageListeners() {
        document.querySelectorAll('[data-lang]').forEach(button => {
            button.addEventListener('click', (e) => this.handleLanguageChange(e));
        });

        const langButton = document.querySelector('.selected-lang');
        if (langButton) {
            langButton.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const expanded = langButton.getAttribute('aria-expanded') === 'true';
                    langButton.setAttribute('aria-expanded', !expanded);
                }
                if (e.key === 'Escape') {
                    langButton.setAttribute('aria-expanded', 'false');
                }
            });
        }

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.lang-menu')) {
                const langButton = document.querySelector('.selected-lang');
                if (langButton) {
                    langButton.setAttribute('aria-expanded', 'false');
                }
            }
        });
    }

    handleLanguageChange(event) {
        event.preventDefault();
        const langCode = event.target.closest('[data-lang]')?.getAttribute('data-lang');

        if (langCode && langCode !== this.currentLang) {
            this.changeLanguage(langCode);
        }

        const langButton = document.querySelector('.selected-lang');
        if (langButton) {
            langButton.setAttribute('aria-expanded', 'false');
        }
    }

    async changeLanguage(langCode) {
        if (langCode === this.currentLang || this.isLoading) return;

        this.isLoading = true;
        this.showLoadingIndicator(true);

        try {
            if (langCode === 'en') {
                this.resetToEnglish();
            } else if (translations[langCode]) {
                this.applyStaticTranslation(langCode);
            } else {
                await this.triggerGoogleTranslate(langCode);
            }

            this.currentLang = langCode;
            this.storeLanguage(langCode);
            this.updateLanguageUI();
            this.updateHTMLLang(langCode);

            this.showToast(`Language changed to ${this.supportedLanguages[langCode].name}`, 'success');
            console.log(`✅ Language switched to: ${langCode}`);
        } catch (error) {
            console.error('❌ Language change error:', error);
            this.showToast('Failed to change language.', 'error');
        } finally {
            this.isLoading = false;
            this.showLoadingIndicator(false);
            moveGoogleTranslateBarToBottom();
        }
    }

    applyStaticTranslation(langCode) {
        const langData = translations[langCode];
        if (!langData) return;

        document.querySelectorAll('[data-key]').forEach(element => {
            const key = element.getAttribute('data-key');
            if (langData[key]) {
                element.textContent = langData[key];
            }
        });

        if (langData.pageTitle) {
            document.title = langData.pageTitle;
        }
    }

    resetToEnglish() {
        location.reload();
    }

    updateLanguageUI() {
        const langConfig = this.supportedLanguages[this.currentLang];
        if (!langConfig) return;

        const flagElement = document.getElementById('currentFlag');
        const langElement = document.getElementById('currentLang');

        if (flagElement) flagElement.textContent = langConfig.flag;
        if (langElement) langElement.textContent = langConfig.nativeName;
    }

    updateHTMLLang(langCode) {
        document.documentElement.lang = langCode;
    }

    showLoadingIndicator(show) {
        const loader = document.getElementById('langLoading');
        if (loader) {
            loader.style.display = show ? 'inline-block' : 'none';
        }
    }

    getStoredLanguage() {
        return localStorage.getItem('selectedLanguage');
    }

    storeLanguage(lang) {
        localStorage.setItem('selectedLanguage', lang);
    }

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.setAttribute('role', 'alert');
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideInRight 0.4s ease reverse';
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    }
}

// ========================
// MOBILE MENU
// ========================
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuBtn.setAttribute('aria-expanded', navMenu.classList.contains('active'));
        });

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }
}

// ========================
// SMOOTH SCROLL
// ========================
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// ========================
// INITIALIZATION
// ========================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing...');
    window.languageManager = new LanguageManager();
    setupMobileMenu();
    setupSmoothScroll();
    console.log('✅ Website initialized');
});

window.addEventListener('load', () => {
    moveGoogleTranslateBarToBottom();
    setTimeout(() => {
        moveGoogleTranslateBarToBottom();
    }, 1000);
});
