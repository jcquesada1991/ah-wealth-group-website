// Cookie Consent & Tracking Configuration

const COOKIE_CONSENT_KEY = 'ah_wealth_cookie_consent';

export function initCookieConsent() {
    const banner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('btn-accept-cookies');
    const declineBtn = document.getElementById('btn-decline-cookies');

    if (!banner || !acceptBtn || !declineBtn) return;

    const consentStatus = localStorage.getItem(COOKIE_CONSENT_KEY);

    if (!consentStatus) {
        // Show banner if no consent choice has been made
        banner.style.display = 'flex';
    } else if (consentStatus === 'accepted') {
        loadTrackingScripts();
    }

    acceptBtn.addEventListener('click', () => {
        localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
        banner.style.display = 'none';
        loadTrackingScripts();
    });

    declineBtn.addEventListener('click', () => {
        localStorage.setItem(COOKIE_CONSENT_KEY, 'declined');
        banner.style.display = 'none';
    });
}

function loadTrackingScripts() {
    // 1. Google Analytics 4 (GA4) Placeholder
    // TODO: Replace 'G-XXXXXXXXXX' with actual GA4 Measurement ID
    const gaId = 'G-XXXXXXXXXX'; 
    if (gaId !== 'G-XXXXXXXXXX') {
        const gaScript = document.createElement('script');
        gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        gaScript.async = true;
        document.head.appendChild(gaScript);

        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', gaId);
    }

    // 2. Meta Pixel Placeholder
    // TODO: Replace 'XXXXXXXXXXXXXXX' with actual Meta Pixel ID
    const pixelId = 'XXXXXXXXXXXXXXX';
    if (pixelId !== 'XXXXXXXXXXXXXXX') {
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', pixelId);
        fbq('track', 'PageView');
    }
}
