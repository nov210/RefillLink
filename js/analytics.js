/**
 * Analytics event tracking
 */
(function () {
  const DEBUG =
    !window.location.hostname ||
    window.location.hostname === "localhost" ||
    window.location.protocol === "file:";

  window.trackEvent = function trackEvent(eventName, params) {
    params = params || {};
    if (DEBUG) {
      console.info("[analytics]", eventName, params);
    }

    if (typeof window.gtag === "function" && window.GA_MEASUREMENT_ID) {
      window.gtag("event", eventName, params);
    }

    if (typeof window.firebaseAnalyticsLog === "function") {
      window.firebaseAnalyticsLog(eventName, params);
    }
  };

  window.initAnalytics = function initAnalytics() {
    const id = window.GA_MEASUREMENT_ID;
    if (!id || document.getElementById("ga-script")) return;

    const script = document.createElement("script");
    script.id = "ga-script";
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + id;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", id, { send_page_view: true });
  };
})();
