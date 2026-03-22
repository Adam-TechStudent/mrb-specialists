// English translations (base language)
const translations = {
    en: {
        title: "Welcome to Our Multilingual Website",
        subtitle: "Switch between languages to see the translation in action",
        feature1_title: "Feature 1",
        feature1_desc: "This is a test description for the first feature",
        feature2_title: "Feature 2",
        feature2_desc: "This is a test description for the second feature",
        feature3_title: "Feature 3",
        feature3_desc: "This is a test description for the third feature",
        about_title: "About Us",
        about_desc: "We are a company dedicated to providing multilingual solutions for global audiences. Our platform supports multiple languages to ensure everyone can understand our content.",
        contact_title: "Contact Us",
        email_placeholder: "Enter your email",
        message_placeholder: "Your message",
        submit_button: "Send Message",
        footer: "© 2026 Multilingual Website. All rights reserved."
    },
    de: {},
    ja: {}
};

// Translation cache to avoid repeated API calls
let translationCache = {};