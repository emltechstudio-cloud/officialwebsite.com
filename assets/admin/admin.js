(() => {
  "use strict";

  const API = "https://emltechstudio-eml-tech-studio-api.hf.space";
  const PAGE_SIZE = 100;
  const $ = (selector) => document.querySelector(selector);
  const state = {
    token: sessionStorage.getItem("ets_admin_token") || "",
    offset: 0,
    total: 0,
    source: "all",
    query: "",
  };

  async function api(path, options = {}) {
    const headers = {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(state.token ? { Authorization: `Bearer ${state.token}` } : {}),
      ...(options.headers || {}),
    };
    const response = await fetch(`${API}${path}`, {
      ...options,
      headers,
      cache: "no-store",
    });
    if (response.status === 401) {
      clearSession();
      throw new Error("Your admin session has expired. Please sign in again.");
    }
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(typeof payload.detail === "string" ? payload.detail : "The request could not be completed.");
    }
    return response;
  }

  async function apiJson(path, options = {}) {
    const response = await api(path, options);
    return response.json();
  }

  function clearSession() {
    sessionStorage.removeItem("ets_admin_token");
    state.token = "";
    $("#dashboard").hidden = true;
    $("#login-panel").hidden = false;
    $("#logout").hidden = true;
  }

  function showDashboard() {
    $("#login-panel").hidden = true;
    $("#dashboard").hidden = false;
    $("#logout").hidden = false;
  }

  function safeText(value) {
    return String(value ?? "");
  }

  function addRows(target, items) {
    const node = $(target);
    node.replaceChildren();
    if (!items.length) {
      const empty = document.createElement("p");
      empty.className = "muted";
      empty.textContent = "No data yet.";
      node.append(empty);
      return;
    }
    for (const [label, value] of items) {
      const row = document.createElement("div");
      row.className = "row";
      const key = document.createElement("span");
      key.textContent = safeText(label);
      const val = document.createElement("strong");
      val.textContent = safeText(value);
      row.append(key, val);
      node.append(row);
    }
  }

  function registrationUrl(path, includeQuery = true) {
    const params = new URLSearchParams({ source: state.source, limit: String(PAGE_SIZE), offset: String(state.offset) });
    if (includeQuery && state.query) params.set("q", state.query);
    return `${path}?${params.toString()}`;
  }

  async function loadRegistrationSummary() {
    const summary = await apiJson("/admin/starting-point/registrations/summary");
    $("#registration-total").textContent = String(summary.total ?? 0);
    $("#registration-original").textContent = String(summary.google_form ?? 0);
    $("#registration-late").textContent = String(summary.late_registrations ?? 0);
    $("#souvenir-claims").textContent = String(summary.souvenir_claims ?? 0);
    const claimsByDay = summary.souvenir_claims_by_day || {};
    $("#day1-claims").textContent = String(claimsByDay["1"] ?? 0);
    $("#day2-claims").textContent = String(claimsByDay["2"] ?? 0);
  }

  function renderRegistrations(records) {
    const tbody = $("#registration-rows");
    tbody.replaceChildren();
    if (!records.length) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");
      cell.colSpan = 7;
      cell.className = "empty-cell";
      cell.textContent = "No registrations match this view.";
      row.append(cell);
      tbody.append(row);
      return;
    }
    const keys = ["email", "name", "whatsapp_phone", "role", "referral_source", "source", "registered_at"];
    for (const record of records) {
      const row = document.createElement("tr");
      for (const key of keys) {
        const cell = document.createElement("td");
        cell.textContent = safeText(record[key]);
        row.append(cell);
      }
      tbody.append(row);
    }
  }

  async function loadRegistrations() {
    const status = $("#registration-status");
    status.textContent = "Loading private registration records…";
    try {
      const payload = await apiJson(registrationUrl("/admin/starting-point/registrations"));
      state.total = Number(payload.total || 0);
      renderRegistrations(Array.isArray(payload.records) ? payload.records : []);
      const first = state.total ? state.offset + 1 : 0;
      const last = Math.min(state.offset + PAGE_SIZE, state.total);
      $("#registration-page-label").textContent = `${first}–${last} of ${state.total}`;
      $("#previous-page").disabled = state.offset <= 0;
      $("#next-page").disabled = state.offset + PAGE_SIZE >= state.total;
      status.textContent = "Private attendee details loaded for this admin session.";
    } catch (error) {
      status.textContent = error.message;
    }
  }

  async function loadAudiencePreview() {
    const source = $("#email-audience").value;
    const preview = $("#audience-preview");
    const sendButton = $("#send-event-email");
    sendButton.disabled = true;
    preview.textContent = "Checking the selected private recipient list…";
    try {
      const payload = await apiJson(`/admin/starting-point/email/audience?source=${encodeURIComponent(source)}`);
      const provider = payload.provider || {};
      const count = Number(payload.recipient_count || 0);
      preview.textContent = provider.configured
        ? `${count} recipient${count === 1 ? "" : "s"} selected · ${provider.provider} is configured. Sending requires a fresh confirmation.`
        : `${count} recipient${count === 1 ? "" : "s"} selected · email provider is not configured.`;
      sendButton.disabled = !provider.configured || count === 0;
    } catch (error) {
      preview.textContent = error.message;
    }
  }

  async function load() {
    const refresh = $("#refresh");
    refresh.disabled = true;
    $("#refreshed").textContent = "Refreshing dashboard…";
    try {
      const [analytics, system] = await Promise.all([
        apiJson("/admin/analytics"),
        apiJson("/admin/system"),
      ]);
      $("#enrolments").textContent = String(analytics.active_enrollments ?? 0);
      $("#learners").textContent = String(analytics.distinct_learners ?? 0);
      $("#progress").textContent = `${analytics.average_course_progress ?? 0}%`;
      addRows("#events", Object.entries(analytics.events || {}));
      addRows("#courses", (analytics.course_metrics || []).map((course) => [
        course.course_id,
        `${course.enrollments} enrolments · ${course.average_progress}% average progress`,
      ]));
      addRows("#system", [
        ["Knowledge version", system.knowledge?.version || "—"],
        ["Newsletter store configured", system.integrations?.newsletter_store ? "Yes" : "No"],
        ["Event email provider", system.integrations?.brevo?.configured ? `${system.integrations.brevo.provider} configured` : "Not configured"],
      ]);
      await Promise.all([loadRegistrationSummary(), loadRegistrations(), loadAudiencePreview()]);
      $("#refreshed").textContent = `Updated ${new Date().toLocaleString()}`;
    } catch (error) {
      $("#refreshed").textContent = error.message;
      if (!state.token) clearSession();
    } finally {
      refresh.disabled = false;
    }
  }

  $("#login-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const status = $("#login-status");
    status.textContent = "Signing in…";
    try {
      const payload = await apiJson("/admin/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: $("#admin-email").value.trim(),
          password: $("#admin-password").value,
        }),
      });
      state.token = payload.access_token;
      sessionStorage.setItem("ets_admin_token", state.token);
      $("#admin-password").value = "";
      status.textContent = "";
      showDashboard();
      await load();
    } catch (error) {
      status.textContent = error.message;
    }
  });

  $("#refresh").addEventListener("click", load);
  $("#logout").addEventListener("click", clearSession);
  $("#search-registrations").addEventListener("click", () => {
    state.source = $("#registration-source").value;
    state.query = $("#registration-search").value.trim();
    state.offset = 0;
    loadRegistrations();
  });
  $("#registration-search").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      $("#search-registrations").click();
    }
  });
  $("#registration-source").addEventListener("change", () => $("#search-registrations").click());
  $("#previous-page").addEventListener("click", () => {
    state.offset = Math.max(0, state.offset - PAGE_SIZE);
    loadRegistrations();
  });
  $("#next-page").addEventListener("click", () => {
    state.offset += PAGE_SIZE;
    loadRegistrations();
  });
  $("#export-csv").addEventListener("click", async () => {
    const button = $("#export-csv");
    const status = $("#registration-status");
    button.disabled = true;
    try {
      const query = new URLSearchParams({ source: state.source });
      if (state.query) query.set("q", state.query);
      const response = await api(`/admin/starting-point/registrations/export.csv?${query.toString()}`);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = "starting-point-registrations.csv";
      document.body.append(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);
      status.textContent = "The private CSV export was downloaded to this device.";
    } catch (error) {
      status.textContent = error.message;
    } finally {
      button.disabled = false;
    }
  });
  $("#email-audience").addEventListener("change", loadAudiencePreview);
  $("#send-event-email").addEventListener("click", async () => {
    const button = $("#send-event-email");
    const status = $("#email-status");
    const source = $("#email-audience").value;
    const templateId = Number($("#email-template-id").value);
    if (!Number.isInteger(templateId) || templateId < 1) {
      status.textContent = "Enter a valid email template ID first.";
      return;
    }
    button.disabled = true;
    try {
      const audience = await apiJson(`/admin/starting-point/email/audience?source=${encodeURIComponent(source)}`);
      const count = Number(audience.recipient_count || 0);
      if (!count) throw new Error("There are no recipients in the selected list.");
      const listName = source === "all" ? "all registrants" : source === "google_form" ? "the original Google Form list" : "late registrants";
      const approved = window.confirm(`Send email template #${templateId} to ${count} people in ${listName}? Confirm that you have reviewed the template and that it contains only the intended Starting Point event update.`);
      if (!approved) return;
      status.textContent = "Submitting the confirmed batch…";
      const result = await apiJson("/admin/starting-point/email/batch", {
        method: "POST",
        body: JSON.stringify({ source, template_id: templateId, confirmed_count: count }),
      });
      status.textContent = `Provider accepted the batch for ${result.recipient_count} recipients. No addresses were returned by the send endpoint.`;
      await loadAudiencePreview();
    } catch (error) {
      status.textContent = error.message;
      await loadAudiencePreview();
    } finally {
      button.disabled = false;
    }
  });

  if (state.token) {
    showDashboard();
    load();
  }
})();
