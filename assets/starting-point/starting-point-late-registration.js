(() => {
  const API_ROOT = "https://emltechstudio-eml-tech-studio-api.hf.space";
  const communityUrl = "https://chat.whatsapp.com/Cid7rkaG4O2BwxG413ByfC?s=cl&p=a&iam=2";
  const form = document.getElementById("late-registration-form");
  const status = document.getElementById("registration-status");
  const successPanel = document.getElementById("success-panel");
  const role = document.getElementById("reg-role");
  const roleOther = document.getElementById("reg-role-other");
  const referral = document.getElementById("reg-referral");
  const referralOther = document.getElementById("reg-referral-other");

  function setStatus(message, state = "") {
    status.textContent = message;
    status.dataset.state = state;
  }

  function toggleField(select, field) {
    const visible = select.value === "Other";
    field.hidden = !visible;
    field.required = visible;
    if (!visible) field.value = "";
  }

  role.addEventListener("change", () => toggleField(role, roleOther));
  referral.addEventListener("change", () => toggleField(referral, referralOther));

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const submit = form.querySelector("button[type=submit]");
    const values = new FormData(form);
    const payload = {
      email: String(values.get("email") || "").trim(),
      name: String(values.get("name") || "").trim(),
      whatsapp_phone: String(values.get("whatsapp_phone") || "").trim(),
      role: String(values.get("role") || "").trim(),
      role_other: String(values.get("role_other") || "").trim(),
      referral_source: String(values.get("referral_source") || "").trim(),
      referral_other: String(values.get("referral_other") || "").trim(),
    };
    submit.disabled = true;
    setStatus("Saving your late registration…");
    try {
      const response = await fetch(`${API_ROOT}/starting-point/registration`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.detail || "We couldn’t save your registration. Please try again.");
      setStatus("Registration received.", "success");
      form.closest(".form-panel").hidden = true;
      successPanel.hidden = false;
      successPanel.scrollIntoView({ behavior: "smooth", block: "start" });
      successPanel.querySelectorAll("a").forEach((link) => {
        if (link.href.includes("chat.whatsapp.com")) link.href = communityUrl;
      });
    } catch (error) {
      setStatus(error.message || "We couldn’t save your registration. Please try again.", "error");
    } finally {
      submit.disabled = false;
    }
  });
})();
