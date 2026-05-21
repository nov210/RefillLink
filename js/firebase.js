/**
 * Firebase Firestore — form submissions
 */
(function () {
  var db = null;
  var initialized = false;

  function getConfig() {
    return (window.RefillinkConfig || {});
  }

  function isConfigured() {
    var cfg = getConfig();
    var fb = cfg.firebaseConfig || {};
    return cfg.USE_FIREBASE && fb.apiKey && fb.apiKey !== "YOUR_API_KEY";
  }

  window.initFirebase = async function initFirebase() {
    if (!isConfigured() || initialized) {
      return { ok: false, reason: "not_configured" };
    }

    try {
      var firebaseConfig = getConfig().firebaseConfig;
      var appMod = await import(
        "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js"
      );
      var firestoreMod = await import(
        "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js"
      );

      var app = appMod.initializeApp(firebaseConfig);
      db = firestoreMod.getFirestore(app);
      initialized = true;

      if (firebaseConfig.measurementId) {
        var analyticsMod = await import(
          "https://www.gstatic.com/firebasejs/10.14.1/firebase-analytics.js"
        );
        var analytics = analyticsMod.getAnalytics(app);
        window.firebaseAnalyticsLog = function (name, params) {
          analyticsMod.logEvent(analytics, name, params);
        };
      }

      return { ok: true };
    } catch (err) {
      console.error("[firebase] init failed", err);
      return { ok: false, reason: "init_error" };
    }
  };

  async function addDocument(collectionName, data) {
    if (isConfigured() && db) {
      var firestoreMod = await import(
        "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js"
      );
      await firestoreMod.addDoc(firestoreMod.collection(db, collectionName), {
        ...data,
        createdAt: firestoreMod.serverTimestamp(),
      });
      return;
    }

    console.info("[mock] " + collectionName, data);
    await new Promise(function (r) {
      setTimeout(r, 400);
    });
  }

  window.saveOwnerApplication = async function saveOwnerApplication(data) {
    await addDocument("ownerApplications", {
      storeName: data.storeName,
      businessType: data.businessType,
      location: data.location,
      managerName: data.managerName,
      phone: data.phone,
      source: data.source || "landing",
      status: "new",
    });
  };

  window.saveConsumerWaitlist = async function saveConsumerWaitlist(data) {
    await addDocument("consumerWaitlist", {
      name: data.name,
      contact: data.contact,
      preferredArea: data.preferredArea,
      categories: data.categories || [],
      source: data.source || "landing",
      status: "new",
    });
  };
})();
