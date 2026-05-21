/**
 * Supabase — 입점 상담 신청 저장 (owner_applications)
 */
(function () {
  var client = null;

  function getConfig() {
    return window.RefillinkConfig || {};
  }

  function isConfigured() {
    var cfg = getConfig();
    return (
      cfg.USE_SUPABASE &&
      cfg.supabaseUrl &&
      cfg.supabaseAnonKey &&
      cfg.supabaseAnonKey !== "YOUR_SUPABASE_ANON_KEY"
    );
  }

  async function getClient() {
    if (client) return client;
    var cfg = getConfig();
    var mod = await import("https://esm.sh/@supabase/supabase-js@2.49.8");
    client = mod.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);
    return client;
  }

  window.initSupabase = async function initSupabase() {
    if (!isConfigured()) return { ok: false, reason: "not_configured" };
    try {
      await getClient();
      return { ok: true };
    } catch (err) {
      console.error("[supabase] init failed", err);
      return { ok: false, reason: "init_error" };
    }
  };

  async function insertOwnerApplication(data) {
    var sb = await getClient();
    var row = {
      store_name: data.storeName,
      business_type: data.businessType,
      location: data.location,
      manager_name: data.managerName,
      phone: data.phone,
      source: data.source || "landing",
      status: "new",
    };
    var result = await sb.from("owner_applications").insert(row);
    if (result.error) throw result.error;
  }

  async function mockSave(data) {
    console.info("[mock] owner_applications", data);
    await new Promise(function (r) {
      setTimeout(r, 400);
    });
  }

  var firebaseSave = typeof window.saveOwnerApplication === "function"
    ? window.saveOwnerApplication
    : null;

  window.saveOwnerApplication = async function saveOwnerApplication(data) {
    if (isConfigured()) {
      await insertOwnerApplication(data);
      return;
    }
    if (firebaseSave) {
      await firebaseSave(data);
      return;
    }
    await mockSave(data);
  };
})();
