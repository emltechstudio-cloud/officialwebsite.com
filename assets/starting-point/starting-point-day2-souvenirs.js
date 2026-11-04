(() => {
  const API_ROOT = "https://emltechstudio-eml-tech-studio-api.hf.space";
  const CLOSES_AT = new Date("2026-11-08T23:59:59+01:00");
  const COMMUNITY_GROUP_URL = "https://chat.whatsapp.com/Cid7rkaG4O2BwxG413ByfC?s=cl&p=a&iam=2";

  const closeCountdown = document.getElementById("countdown");
  const countdownTitle = document.getElementById("countdown-title");
  const downloadButton = document.getElementById("open-download");
  const gate = document.getElementById("download-gate");
  const closedNotice = document.getElementById("closed-notice");
  const lookupForm = document.getElementById("lookup-form");
  const lookupEmail = document.getElementById("lookup-email");
  const lookupStatus = document.getElementById("lookup-status");
  const registrationForm = document.getElementById("late-registration-form");
  const registrationEmail = document.getElementById("reg-email");
  const registrationStatus = document.getElementById("registration-status");
  const joinNext = document.getElementById("join-next");
  const recheckButton = document.getElementById("recheck-download");
  const recheckStatus = document.getElementById("recheck-status");
  const communityLink = document.getElementById("community-link");
  const communityLinkPending = document.getElementById("community-link-pending");
  const roleSelect = document.getElementById("reg-role");
  const roleOther = document.getElementById("reg-role-other");
  const referralSelect = document.getElementById("reg-referral");
  const referralOther = document.getElementById("reg-referral-other");
  let pendingEmail = "";
  let isClosed = false;

  function setStatus(node, message, state = "") {
    node.textContent = message;
    node.dataset.state = state;
  }

  function updateCountdown() {
    const remaining = CLOSES_AT.getTime() - Date.now();
    if (remaining <= 0) {
      isClosed = true;
      downloadButton.disabled = true;
      downloadButton.querySelector("span:first-child").textContent = "Download window closed";
      downloadButton.setAttribute("aria-expanded", "false");
      closedNotice.hidden = false;
      closeCountdown.hidden = true;
      return;
    }
    const totalSeconds = Math.floor(remaining / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    document.getElementById("count-days").textContent = String(days).padStart(2, "0");
    document.getElementById("count-hours").textContent = String(hours).padStart(2, "0");
    document.getElementById("count-minutes").textContent = String(minutes).padStart(2, "0");
    document.getElementById("count-seconds").textContent = String(seconds).padStart(2, "0");
    countdownTitle.textContent = "The souvenir window closes Sunday, 8 November at 11:59 PM WAT";
  }

  async function postJson(path, body) {
    const response = await fetch(`${API_ROOT}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    let payload = {};
    try { payload = await response.json(); } catch (_) { /* use a friendly fallback below */ }
    if (!response.ok) {
      if (response.status === 403) throw new Error("Day 2 downloads open at 7:00 PM WAT on Tuesday, 3 November.");
      if (response.status === 410) {
        isClosed = true;
        updateCountdown();
        throw new Error("The Day 2 download window has closed.");
      }
      throw new Error(typeof payload.detail === "string" ? payload.detail : "We couldn’t complete that just now. Please try again.");
    }
    return payload;
  }

  function openGate() {
    if (isClosed) return;
    gate.hidden = false;
    downloadButton.setAttribute("aria-expanded", "true");
    gate.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => lookupEmail.focus({ preventScroll: true }), 250);
  }

  async function issueDownload(email, statusNode, button) {
    if (isClosed) return;
    const priorText = button.textContent;
    button.disabled = true;
    setStatus(statusNode, "Preparing your Day 2 bundle…");
    try {
      const result = await postJson("/starting-point/souvenirs/claim", { email, day: 2 });
      if (result.status !== "ready" || typeof result.download_url !== "string") {
        throw new Error("We couldn’t prepare the download. Please try again.");
      }
      setStatus(statusNode, result.already_collected ? "Your Day 2 collection is recorded. Starting the download…" : "Your Day 2 collection is recorded. Starting the download…", "success");
      const downloadUrl = new URL(result.download_url, API_ROOT).href;
      window.location.assign(downloadUrl);
    } catch (error) {
      setStatus(statusNode, error.message || "We couldn’t start the download. Please try again.", "error");
    } finally {
      button.disabled = false;
      button.textContent = priorText;
    }
  }

  async function checkEmail(email, statusNode, button) {
    if (isClosed) return;
    button.disabled = true;
    setStatus(statusNode, "Checking the registration list…");
    try {
      const result = await postJson("/starting-point/registration/lookup", { email });
      if (result.status === "registered") {
        pendingEmail = email;
        sessionStorage.setItem("starting_point_day2_email", email);
        await issueDownload(email, statusNode, button);
        return;
      }
      if (result.status === "not_found") {
        registrationEmail.value = email;
        registrationForm.hidden = false;
        joinNext.hidden = true;
        setStatus(statusNode, "We couldn’t find this email. Complete the community registration below to continue.");
        registrationForm.scrollIntoView({ behavior: "smooth", block: "start" });
        document.getElementById("reg-name").focus({ preventScroll: true });
        return;
      }
      throw new Error("We couldn’t confirm this email. Please check it and try again.");
    } catch (error) {
      setStatus(statusNode, error.message || "We couldn’t check that email. Please try again.", "error");
    } finally {
      button.disabled = false;
    }
  }

  downloadButton.addEventListener("click", openGate);
  lookupForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!lookupForm.reportValidity()) return;
    const email = lookupEmail.value.trim();
    await checkEmail(email, lookupStatus, lookupForm.querySelector("button[type=submit]"));
  });

  roleSelect.addEventListener("change", () => {
    roleOther.hidden = roleSelect.value !== "Other";
    roleOther.required = roleSelect.value === "Other";
    if (!roleOther.hidden) roleOther.focus();
  });

  referralSelect.addEventListener("change", () => {
    referralOther.hidden = referralSelect.value !== "Other";
    referralOther.required = referralSelect.value === "Other";
    if (!referralOther.hidden) referralOther.focus();
  });

  registrationForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (isClosed || !registrationForm.reportValidity()) return;
    const button = registrationForm.querySelector("button[type=submit]");
    const form = new FormData(registrationForm);
    const payload = {
      email: String(form.get("email") || "").trim(),
      name: String(form.get("name") || "").trim(),
      whatsapp_phone: String(form.get("whatsapp_phone") || "").trim(),
      role: String(form.get("role") || "").trim(),
      role_other: String(form.get("role_other") || "").trim(),
      referral_source: String(form.get("referral_source") || "").trim(),
      referral_other: String(form.get("referral_other") || "").trim(),
    };
    button.disabled = true;
    setStatus(registrationStatus, "Saving your registration…");
    try {
      const result = await postJson("/starting-point/registration", payload);
      if (result.status !== "registered") throw new Error("Registration couldn’t be confirmed. Please try again.");
      pendingEmail = payload.email;
      sessionStorage.setItem("starting_point_day2_email", payload.email);
      registrationForm.hidden = true;
      joinNext.hidden = false;
      const inviteUrl = result.community_url || COMMUNITY_GROUP_URL;
      if (inviteUrl) {
        communityLink.href = inviteUrl;
        communityLink.hidden = false;
        communityLinkPending.hidden = true;
      } else {
        communityLink.hidden = true;
        communityLinkPending.hidden = false;
      }
      setStatus(registrationStatus, "Your community registration has been saved.", "success");
      joinNext.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (error) {
      setStatus(registrationStatus, error.message || "We couldn’t save the registration. Please try again.", "error");
    } finally {
      button.disabled = false;
    }
  });

  recheckButton.addEventListener("click", async () => {
    const email = pendingEmail || sessionStorage.getItem("starting_point_day2_email") || registrationEmail.value.trim();
    if (!email) {
      setStatus(recheckStatus, "Please enter your registration email above first.", "error");
      lookupEmail.focus();
      return;
    }
    await checkEmail(email, recheckStatus, recheckButton);
  });

  updateCountdown();
  window.setInterval(updateCountdown, 1000);
})();
