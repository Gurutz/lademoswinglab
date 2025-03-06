/* Shows the Cookie banner */
function showCookieBanner() {
    const cookieBanner = document.getElementById("cb-cookie-banner");
    cookieBanner.style.display = "block";
}

/* Hides the Cookie banner and saves the user's preference to localStorage */
function hideCookieBanner() {
    localStorage.setItem("cb_isCookieAccepted", "yes");
    const cookieBanner = document.getElementById("cb-cookie-banner");
    cookieBanner.style.display = "none";
}

/* Checks the localStorage and shows the Cookie banner if cookies are not yet accepted */
function initializeCookieBanner() {
    const isCookieAccepted = localStorage.getItem("cb_isCookieAccepted");

    // If no value is found in localStorage, or if the user has not accepted cookies, show the banner
    if (isCookieAccepted === null || isCookieAccepted === "no") {
        showCookieBanner();
    }
}

// Initialize the cookie banner when the page loads
window.onload = function() {
    initializeCookieBanner();
};