(() => {
  const eventStart = new Date("2026-11-03T19:00:00+01:00").getTime();
  const eventEnd = new Date("2026-11-06T00:00:00+01:00").getTime();
  const daysNode = document.getElementById("count-days");
  const hoursNode = document.getElementById("count-hours");
  const minutesNode = document.getElementById("count-minutes");
  const statusNode = document.getElementById("countdown-status");
  const countdownNode = document.getElementById("countdown");

  if (!daysNode || !hoursNode || !minutesNode || !statusNode || !countdownNode) return;

  const twoDigits = (value) => String(value).padStart(2, "0");

  function updateCountdown() {
    const now = Date.now();
    if (now >= eventEnd) {
      countdownNode.hidden = true;
      statusNode.textContent = "Starting Point 2026 has ended. Follow EML Tech Studio for future updates.";
      return;
    }

    if (now >= eventStart) {
      countdownNode.hidden = true;
      statusNode.textContent = "Starting Point is underway. Sessions begin at 7:00 PM WAT each day.";
      return;
    }

    const remaining = eventStart - now;
    const days = Math.floor(remaining / 86_400_000);
    const hours = Math.floor((remaining % 86_400_000) / 3_600_000);
    const minutes = Math.floor((remaining % 3_600_000) / 60_000);
    daysNode.textContent = twoDigits(days);
    hoursNode.textContent = twoDigits(hours);
    minutesNode.textContent = twoDigits(minutes);
  }

  updateCountdown();
  window.setInterval(updateCountdown, 60_000);
})();
