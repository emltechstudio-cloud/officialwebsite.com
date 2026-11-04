(() => {
  const API_ROOT = "https://emltechstudio-eml-tech-studio-api.hf.space";
  const PHOTO_MAX_BYTES = 20 * 1024 * 1024;
  const membershipPanel = document.getElementById("membership-panel");
  const lookupForm = document.getElementById("member-lookup-form");
  const lookupEmail = document.getElementById("member-email");
  const memberStatus = document.getElementById("member-status");
  const cardMaker = document.getElementById("founding-card");
  const cardForm = document.getElementById("card-form");
  const cardName = document.getElementById("card-name");
  const cardPhoto = document.getElementById("card-photo");
  const canvas = document.getElementById("founding-card-canvas");
  const placeholder = document.getElementById("preview-placeholder");
  const cardStatus = document.getElementById("card-status");
  const downloadButton = document.getElementById("download-card");
  const shareButton = document.getElementById("share-card");
  const previewNote = document.getElementById("card-preview-note");
  const previewValue = new URLSearchParams(window.location.search).get("preview");
  const previewMode = previewValue === "1" || previewValue === "card";

  function setStatus(node, message, state = "") {
    node.textContent = message;
    node.dataset.state = state;
  }

  async function postLookup(email) {
    const response = await fetch(`${API_ROOT}/starting-point/registration/lookup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
      cache: "no-store",
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.detail || "We couldn’t confirm your membership. Please try again.");
    return result;
  }

  if (previewMode) {
    membershipPanel.hidden = true;
    cardMaker.hidden = false;
    previewNote.hidden = false;
    previewNote.textContent = "Design preview mode: email verification is bypassed here. Your photo stays on this device.";
    setStatus(cardStatus, "Preview mode: membership verification is temporarily bypassed.");
  }

  lookupForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!lookupForm.reportValidity()) return;
    const submit = lookupForm.querySelector("button[type=submit]");
    submit.disabled = true;
    setStatus(memberStatus, "Checking the private ETS Community roster…");
    try {
      const result = await postLookup(lookupEmail.value.trim());
      if (result.status !== "registered") {
        throw new Error("That email is not on the ETS Community roster yet. Please register for Starting Point first.");
      }
      setStatus(memberStatus, "Community membership confirmed. You can now create your card.", "success");
      membershipPanel.hidden = true;
      cardMaker.hidden = false;
      cardMaker.scrollIntoView({ behavior: "smooth", block: "start" });
      cardName.focus({ preventScroll: true });
    } catch (error) {
      setStatus(memberStatus, error.message || "We couldn’t confirm your membership. Please try again.", "error");
    } finally {
      submit.disabled = false;
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
    background.addColorStop(0, "#05052b");
    background.addColorStop(.48, "#000040");
    background.addColorStop(1, "#34104f");
    context.fillStyle = background;
    context.fillRect(0, 0, width, height);

    const glow = context.createRadialGradient(190, 760, 20, 190, 760, 520);
    glow.addColorStop(0, "rgba(0,255,255,.24)");
    glow.addColorStop(1, "rgba(0,255,255,0)");
    context.fillStyle = glow;
    context.fillRect(0, 0, width, height);
    const purpleGlow = context.createRadialGradient(920, 180, 20, 920, 180, 520);
    purpleGlow.addColorStop(0, "rgba(130,16,159,.7)");
    purpleGlow.addColorStop(1, "rgba(130,16,159,0)");
    context.fillStyle = purpleGlow;
    context.fillRect(0, 0, width, height);

    context.save();
    roundRect(context, 36, 36, 1008, 1008, 42);
    context.clip();
    context.strokeStyle = "rgba(0,255,255,.58)";
    context.lineWidth = 4;
    roundRect(context, 42, 42, 996, 996, 36);
    context.stroke();
    context.strokeStyle = "rgba(255,215,0,.46)";
    context.lineWidth = 2;
    roundRect(context, 58, 58, 964, 964, 29);
    context.stroke();
    context.restore();

    const logo = new Image();
    logo.src = "/ETSlogo.png";
    await logo.decode();
    const logoWidth = 290;
    const logoHeight = logoWidth * logo.naturalHeight / logo.naturalWidth;
    context.save();
    roundRect(context, (width - 340) / 2, 70, 340, 126, 20);
    context.fillStyle = "rgba(5,5,31,.78)";
    context.fill();
    context.drawImage(logo, (width - logoWidth) / 2, 88, logoWidth, logoHeight);
    context.restore();

    context.textAlign = "left";
    context.fillStyle = "rgba(255,255,255,.62)";
    context.font = "700 18px 'Segoe UI', Tahoma, sans-serif";
    context.letterSpacing = "4px";
    context.fillText("ETS COMMUNITY", 92, 116);
    context.textAlign = "right";
    context.fillStyle = "#ffd700";
    context.font = "800 23px 'Segoe UI', Tahoma, sans-serif";
    context.letterSpacing = "3px";
    context.fillText("STARTING POINT", 988, 112);
    context.fillStyle = "#ffffff";
    context.font = "800 29px 'Segoe UI', Tahoma, sans-serif";
    context.fillText("2026", 988, 145);
    context.letterSpacing = "0px";

    context.textAlign = "center";
    context.fillStyle = "#00ffff";
    context.font = "800 22px 'Segoe UI', Tahoma, sans-serif";
    context.letterSpacing = "5px";
    context.fillText("FOUNDING MEMBER", width / 2, 258);
    context.letterSpacing = "0px";
    context.fillStyle = "rgba(255,255,255,.72)";
    context.font = "500 22px 'Segoe UI', Tahoma, sans-serif";
    context.fillText("A mark of belonging, contribution and possibility", width / 2, 296);

    const portraitX = 540;
    const portraitY = 530;
    const radius = 166;
    context.beginPath(); context.arc(portraitX, portraitY, radius + 18, 0, Math.PI * 2); context.fillStyle = "#ffd700"; context.fill();
    context.beginPath(); context.arc(portraitX, portraitY, radius + 10, 0, Math.PI * 2); context.fillStyle = "#00ffff"; context.fill();
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
    context.fillText(safeName, width / 2, 773, 920);

    context.fillStyle = "rgba(255,255,255,.86)";
    context.font = "600 29px 'Segoe UI', Tahoma, sans-serif";
    drawWrappedText(context, "I’m officially an ETS Community Founding Member", width / 2, 836, 900, 39, 2);

    context.fillStyle = "#ffd700";
    context.fillRect(410, 936, 260, 3);
    context.fillStyle = "rgba(255,255,255,.65)";
    context.font = "700 19px 'Segoe UI', Tahoma, sans-serif";
    context.letterSpacing = "3px";
    context.fillText("IDEAS · PEOPLE · POSSIBILITY", width / 2, 981);
    context.letterSpacing = "0px";
  }


  let currentPhotoUrl = "";
  let cardReady = false;

  cardForm.addEventListener("submit", async (event) => {
    event.preventDefault();
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
})();
