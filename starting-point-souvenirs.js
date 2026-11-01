(() => {
  const API_ROOT = "https://emltechstudio-eml-tech-studio-api.hf.space";
  const PHOTO_MAX_BYTES = 20 * 1024 * 1024;
  const portalClose = new Date("2026-11-08T23:59:59+01:00");

  const accessPanel = document.getElementById("access-panel");
  const unlockedContent = document.getElementById("unlocked-content");
  const closedPanel = document.getElementById("closed-panel");
  const lookupForm = document.getElementById("lookup-form");
  const registrationForm = document.getElementById("registration-form");
  const lookupEmail = document.getElementById("lookup-email");
  const registrationEmail = document.getElementById("reg-email");
  const lookupStatus = document.getElementById("lookup-status");
  const registrationStatus = document.getElementById("registration-status");
  const roleSelect = document.getElementById("reg-role");
  const roleOther = document.getElementById("reg-role-other");
  const referralSelect = document.getElementById("reg-referral");
  const referralOther = document.getElementById("reg-referral-other");
  const cardForm = document.getElementById("card-form");
  const cardName = document.getElementById("card-name");
  const cardPhoto = document.getElementById("card-photo");
  const canvas = document.getElementById("founding-card-canvas");
  const placeholder = document.getElementById("preview-placeholder");
  const cardStatus = document.getElementById("card-status");
  const downloadButton = document.getElementById("download-card");
  const shareButton = document.getElementById("share-card");

  function setStatus(node, message, state = "") {
    node.textContent = message;
    node.dataset.state = state;
  }

  function showClosed() {
    accessPanel.hidden = true;
    unlockedContent.hidden = true;
    closedPanel.hidden = false;
  }

  function ensureOpen() {
    if (Date.now() >= portalClose.getTime()) {
      showClosed();
      return false;
    }
    return true;
  }

  function apiErrorMessage(payload, fallback) {
    if (payload && typeof payload.detail === "string") return payload.detail;
    return fallback;
  }

  async function postJson(path, body) {
    const response = await fetch(`${API_ROOT}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    let payload = {};
    try { payload = await response.json(); } catch (_) { /* show fallback below */ }
    if (!response.ok) {
      if (response.status === 410) showClosed();
      throw new Error(apiErrorMessage(payload, "We couldn’t complete that right now. Please try again."));
    }
    return payload;
  }

  function unlock(name = "") {
    if (!ensureOpen()) return;
    accessPanel.hidden = true;
    unlockedContent.hidden = false;
    if (name && !cardName.value) cardName.value = name;
    loadSouvenirManifest();
    unlockedContent.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  let manifestLoaded = false;
  async function loadSouvenirManifest() {
    if (manifestLoaded) return;
    manifestLoaded = true;
    try {
      const response = await fetch("/souvenirs/starting-point-2026/manifest.json", { cache: "no-store" });
      if (!response.ok) return;
      const manifest = await response.json();
      if (!manifest || !Array.isArray(manifest.days)) return;
      manifest.days.forEach((day) => {
        const dayNumber = Number(day.day);
        if (![1, 2, 3].includes(dayNumber) || !Array.isArray(day.items)) return;
        const container = document.querySelector(`[data-assets-day="${dayNumber}"]`);
        const description = document.querySelector(`[data-day="${dayNumber}"]`);
        if (!container) return;
        container.replaceChildren();
        day.items.forEach((item) => {
          if (!item || typeof item.title !== "string" || typeof item.url !== "string") return;
          if (!item.url.startsWith("/souvenirs/starting-point-2026/") || item.url.includes("..")) return;
          const link = document.createElement("a");
          link.className = "asset-link";
          link.href = item.url;
          link.textContent = item.title.slice(0, 90);
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          link.setAttribute("aria-label", `Open souvenir: ${item.title.slice(0, 90)}`);
          container.appendChild(link);
        });
        if (description && day.items.length) description.textContent = `${day.items.length} souvenir${day.items.length === 1 ? "" : "s"} available.`;
        if (description && day.items.length === 0) description.textContent = "Souvenir files will appear here after they are released.";
      });
    } catch (_) {
      // The card maker remains available even if no souvenir files have been added yet.
    }
  }

  lookupForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!ensureOpen()) return;
    const email = lookupEmail.value.trim();
    setStatus(lookupStatus, "Checking your email…");
    lookupForm.querySelector("button[type=submit]").disabled = true;
    try {
      const result = await postJson("/starting-point/registration/lookup", { email });
      if (result.status === "registered") {
        setStatus(lookupStatus, "Registration found. Your souvenirs are ready.", "success");
        unlock();
        return;
      }
      if (result.status === "not_found") {
        registrationEmail.value = email;
        registrationForm.hidden = false;
        setStatus(lookupStatus, "We couldn’t find your registration yet. You can join the community below.");
        registrationForm.scrollIntoView({ behavior: "smooth", block: "start" });
        document.getElementById("reg-name").focus({ preventScroll: true });
        return;
      }
      throw new Error("We couldn’t confirm your registration. Please try again.");
    } catch (error) {
      setStatus(lookupStatus, error.message || "We couldn’t check your email. Please try again.", "error");
    } finally {
      lookupForm.querySelector("button[type=submit]").disabled = false;
    }
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
    if (!ensureOpen()) return;
    if (!registrationForm.reportValidity()) return;
    const submitButton = registrationForm.querySelector("button[type=submit]");
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
    setStatus(registrationStatus, "Saving your registration…");
    submitButton.disabled = true;
    try {
      const result = await postJson("/starting-point/registration", payload);
      if (result.status !== "registered") throw new Error("Registration could not be confirmed. Please try again.");
      setStatus(registrationStatus, "You’re registered. Your souvenirs are ready.", "success");
      unlock(payload.name);
    } catch (error) {
      setStatus(registrationStatus, error.message || "We couldn’t save your registration. Please try again.", "error");
    } finally {
      submitButton.disabled = false;
    }
  });

  function fitCover(context, image, x, y, width, height) {
    const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
    const cropWidth = width / scale;
    const cropHeight = height / scale;
    const sourceX = (image.naturalWidth - cropWidth) / 2;
    const sourceY = (image.naturalHeight - cropHeight) / 2;
    context.drawImage(image, sourceX, sourceY, cropWidth, cropHeight, x, y, width, height);
  }

  function roundRect(context, x, y, width, height, radius) {
    context.beginPath();
    if (typeof context.roundRect === "function") {
      context.roundRect(x, y, width, height, radius);
      return;
    }
    const r = Math.min(radius, width / 2, height / 2);
    context.moveTo(x + r, y);
    context.lineTo(x + width - r, y);
    context.quadraticCurveTo(x + width, y, x + width, y + r);
    context.lineTo(x + width, y + height - r);
    context.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    context.lineTo(x + r, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - r);
    context.lineTo(x, y + r);
    context.quadraticCurveTo(x, y, x + r, y);
    context.closePath();
  }

  function drawWrappedText(context, text, centerX, y, maxWidth, lineHeight, maxLines = 2) {
    const words = text.split(/\s+/);
    const lines = [];
    let line = "";
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (line && context.measureText(test).width > maxWidth) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    const visibleLines = lines.slice(0, maxLines);
    visibleLines.forEach((value, index) => context.fillText(value, centerX, y + index * lineHeight, maxWidth));
    return visibleLines.length;
  }

  async function loadLocalPhoto(file) {
    if (!file || !file.type.startsWith("image/")) throw new Error("Choose an image file for your photo.");
    if (file.size > PHOTO_MAX_BYTES) throw new Error("Please choose a photo smaller than 20 MB.");
    const objectUrl = URL.createObjectURL(file);
    try {
      const image = new Image();
      image.src = objectUrl;
      await image.decode();
      return { image, objectUrl };
    } catch (error) {
      URL.revokeObjectURL(objectUrl);
      throw new Error("That photo could not be opened. Please choose another image.");
    }
  }

  async function drawFoundingCard(name, photo) {
    await document.fonts.ready;
    const context = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    context.clearRect(0, 0, width, height);

    const background = context.createLinearGradient(0, 0, width, height);
    background.addColorStop(0, "#000026");
    background.addColorStop(.54, "#000040");
    background.addColorStop(1, "#281047");
    context.fillStyle = background;
    context.fillRect(0, 0, width, height);

    const glow = context.createRadialGradient(850, 145, 20, 850, 145, 560);
    glow.addColorStop(0, "rgba(130,16,159,.55)");
    glow.addColorStop(1, "rgba(130,16,159,0)");
    context.fillStyle = glow;
    context.fillRect(0, 0, width, height);

    context.strokeStyle = "rgba(0,255,255,.2)";
    context.lineWidth = 2;
    context.beginPath(); context.arc(540, 474, 405, 0, Math.PI * 2); context.stroke();
    context.strokeStyle = "rgba(255,215,0,.22)";
    context.beginPath(); context.arc(540, 474, 375, 0, Math.PI * 2); context.stroke();

    context.save();
    roundRect(context, 42, 42, 996, 996, 38);
    context.clip();
    context.strokeStyle = "rgba(0,255,255,.5)";
    context.lineWidth = 4;
    roundRect(context, 45, 45, 990, 990, 36);
    context.stroke();
    context.restore();

    const logo = new Image();
    logo.src = "/ETSlogo.png";
    await logo.decode();
    const logoWidth = 334;
    const logoHeight = logoWidth * logo.naturalHeight / logo.naturalWidth;
    context.save();
    roundRect(context, (width - 390) / 2, 74, 390, 160, 24);
    context.fillStyle = "#05051f";
    context.fill();
    context.drawImage(logo, (width - logoWidth) / 2, 94, logoWidth, logoHeight);
    context.restore();

    context.textAlign = "center";
    context.fillStyle = "#00ffff";
    context.font = "800 25px 'Segoe UI', Tahoma, sans-serif";
    context.letterSpacing = "5px";
    context.fillText("STARTING POINT 2026", width / 2, 277);
    context.letterSpacing = "0px";

    const pillGradient = context.createLinearGradient(335, 0, 745, 0);
    pillGradient.addColorStop(0, "#82109f");
    pillGradient.addColorStop(1, "#4b1677");
    context.fillStyle = pillGradient;
    roundRect(context, 333, 309, 414, 66, 33);
    context.fill();
    context.fillStyle = "#ffffff";
    context.font = "800 28px 'Segoe UI', Tahoma, sans-serif";
    context.letterSpacing = "4px";
    context.fillText("FOUNDING MEMBER", width / 2, 352);
    context.letterSpacing = "0px";

    const portraitX = 540;
    const portraitY = 552;
    const radius = 166;
    context.beginPath(); context.arc(portraitX, portraitY, radius + 16, 0, Math.PI * 2); context.fillStyle = "#ffd700"; context.fill();
    context.beginPath(); context.arc(portraitX, portraitY, radius + 8, 0, Math.PI * 2); context.fillStyle = "#00ffff"; context.fill();
    context.save();
    context.beginPath(); context.arc(portraitX, portraitY, radius, 0, Math.PI * 2); context.clip();
    fitCover(context, photo, portraitX - radius, portraitY - radius, radius * 2, radius * 2);
    context.restore();

    const safeName = name.replace(/\s+/g, " ").trim();
    let fontSize = safeName.length > 26 ? 43 : safeName.length > 18 ? 51 : 60;
    context.fillStyle = "#ffffff";
    context.font = `750 ${fontSize}px 'Segoe UI', Tahoma, sans-serif`;
    while (context.measureText(safeName).width > 900 && fontSize > 34) {
      fontSize -= 2;
      context.font = `750 ${fontSize}px 'Segoe UI', Tahoma, sans-serif`;
    }
    context.fillText(safeName, width / 2, 801, 920);

    context.fillStyle = "rgba(255,255,255,.78)";
    context.font = "500 27px 'Segoe UI', Tahoma, sans-serif";
    drawWrappedText(context, "I’m officially a founding member of the", width / 2, 858, 900, 36, 1);
    context.fillStyle = "#00ffff";
    context.font = "800 31px 'Segoe UI', Tahoma, sans-serif";
    context.fillText("ETS Community", width / 2, 906);

    context.fillStyle = "#ffd700";
    context.fillRect(430, 950, 220, 3);
    context.fillStyle = "rgba(255,255,255,.65)";
    context.font = "700 19px 'Segoe UI', Tahoma, sans-serif";
    context.letterSpacing = "3px";
    context.fillText("IDEAS · PEOPLE · POSSIBILITY", width / 2, 986);
    context.letterSpacing = "0px";
  }

  let currentPhotoUrl = "";
  let cardReady = false;

  cardForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!ensureOpen()) return;
    const name = cardName.value.trim();
    const file = cardPhoto.files && cardPhoto.files[0];
    if (!name || !file) {
      setStatus(cardStatus, "Enter the name for your card and choose a photo.", "error");
      return;
    }
    if (currentPhotoUrl) URL.revokeObjectURL(currentPhotoUrl);
    cardReady = false;
    downloadButton.disabled = true;
    shareButton.disabled = true;
    setStatus(cardStatus, "Creating your card on this device…");
    document.getElementById("create-card").disabled = true;
    try {
      const { image, objectUrl } = await loadLocalPhoto(file);
      currentPhotoUrl = objectUrl;
      await drawFoundingCard(name, image);
      canvas.hidden = false;
      placeholder.hidden = true;
      cardReady = true;
      downloadButton.disabled = false;
      shareButton.disabled = false;
      setStatus(cardStatus, "Your card is ready. Your photo stayed on this device.", "success");
    } catch (error) {
      setStatus(cardStatus, error.message || "We couldn’t create the card. Please try another photo.", "error");
    } finally {
      document.getElementById("create-card").disabled = false;
    }
  });

  function canvasBlob() {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("The card image could not be prepared.")), "image/png");
    });
  }

  downloadButton.addEventListener("click", async () => {
    if (!cardReady) return;
    try {
      const blob = await canvasBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "eml-tech-studio-founding-member-card.png";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setStatus(cardStatus, "Card downloaded. Your photo was not uploaded.", "success");
    } catch (error) {
      setStatus(cardStatus, error.message, "error");
    }
  });

  shareButton.addEventListener("click", async () => {
    if (!cardReady) return;
    try {
      const blob = await canvasBlob();
      const file = new File([blob], "eml-tech-studio-founding-member-card.png", { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] }) && navigator.share) {
        await navigator.share({ files: [file], title: "My ETS Community Founding Member Card" });
        setStatus(cardStatus, "Card shared. Your photo was not uploaded.", "success");
      } else {
        downloadButton.click();
        setStatus(cardStatus, "Your browser can’t share image files here, so the PNG was downloaded instead.", "success");
      }
    } catch (error) {
      if (error.name !== "AbortError") setStatus(cardStatus, error.message || "Sharing isn’t available in this browser.", "error");
    }
  });

  if (!ensureOpen()) return;
})();
