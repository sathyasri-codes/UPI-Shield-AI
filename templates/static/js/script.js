document.addEventListener("DOMContentLoaded", function () {

    // 1. MESSAGE SCANNER
    const scanForm = document.getElementById("scanForm");
    const messageInput = document.getElementById("messageInput");
    const scanResult = document.getElementById("scanResult");
    const shareWhatsappBtn = document.getElementById("shareWhatsappBtn");

    let latestReport = "";

    if (shareWhatsappBtn) {
        shareWhatsappBtn.disabled = true;
    }

    if (scanForm) {
        scanForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const message = messageInput.value.trim();

            if (!message) {
                scanResult.textContent = "Please enter a message first.";
                return;
            }

            const suspiciousWords = [
                "urgent",
                "winner",
                "prize",
                "claim now",
                "otp",
                "password",
                "click here",
                "account blocked"
            ];

            const foundWords = suspiciousWords.filter(word =>
                message.toLowerCase().includes(word)
            );

            const risk = foundWords.length > 0
                ? "Warning: Suspicious words detected."
                : "No common suspicious words detected.";

            latestReport =
                "UPI Shield AI Scan Report\n\n" +
                "Result: " + risk +
                "\nDetected words: " +
                (foundWords.length ? foundWords.join(", ") : "None") +
                "\n\nThis is a basic keyword check, not a confirmed fraud detection.";

            scanResult.textContent = latestReport;

            if (shareWhatsappBtn) {
                shareWhatsappBtn.disabled = false;
            }

            updateStats(foundWords.length > 0);
            addActivity("Message scanned", risk);
        });
    }

    // 2. WHATSAPP REPORT SHARING
    if (shareWhatsappBtn) {
        shareWhatsappBtn.addEventListener("click", function () {
            if (!latestReport) {
                alert("Please scan a message first.");
                return;
            }

            const whatsappURL =
                "https://wa.me/?text=" +
                encodeURIComponent(latestReport);

            window.open(whatsappURL, "_blank");
        });
    }

    // 3. PAYMENT LINK CHECKER
    const linkCheckForm = document.getElementById("linkCheckForm");
    const paymentLinkInput = document.getElementById("paymentLinkInput");
    const linkCheckResult = document.getElementById("linkCheckResult");

    if (linkCheckForm) {
        linkCheckForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const link = paymentLinkInput.value.trim();

// Clear previous result
            linkCheckResult.textContent = "";

            if (!link) {
            linkCheckResult.textContent =
            "Please enter a payment link first.";
            return;
            }

            try {
                const url = new URL(link);
                const host = url.hostname.toLowerCase();
                const warnings = [];

                if (url.protocol !== "https:") {
                    warnings.push("The link does not use HTTPS.");
                }

                if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) {
                    warnings.push("The link uses an IP address.");
                }

                if (host.includes("xn--")) {
                    warnings.push("The domain uses encoded characters.");
                }

                if (host.split(".").length > 4) {
                    warnings.push("The link has many subdomains.");
                }

                if (warnings.length > 0) {
                    linkCheckResult.textContent =
                        "Warning signs found:\n" + warnings.join("\n");
                } else {
                    linkCheckResult.textContent =
                        "No basic warning signs detected. This does not guarantee the link is safe.";
                }

                addActivity("Payment link checked", warnings.length
                    ? "Warning signs found"
                    : "No basic warning signs");

            } catch (error) {
                linkCheckResult.textContent =
                    "Invalid link. Please enter a valid URL.";
            }
        });
    }

    // 4. QR IMAGE FILE SELECTION
    const qrUploadForm = document.getElementById("qrUploadForm");
    const qrImageInput = document.getElementById("qrImageInput");
    const qrFileName = document.getElementById("qrFileName");
    const qrResult = document.getElementById("qrResult");

    if (qrImageInput) {
        qrImageInput.addEventListener("change", function () {
            const file = qrImageInput.files[0];

            if (!file) return;

            if (!file.type.startsWith("image/")) {
                qrFileName.textContent = "Please select an image file.";
                return;
            }

            qrFileName.textContent = "Selected: " + file.name;

            if (qrResult) {
                qrResult.textContent =
                    "Image selected. QR decoding will be connected in the next step.";
            }
        });
    }

    if (qrUploadForm) {
        qrUploadForm.addEventListener("submit", function (event) {
            event.preventDefault();

            if (!qrImageInput || !qrImageInput.files.length) {
                if (qrResult) {
                    qrResult.textContent = "Please select a QR image first.";
                }
                return;
            }

            if (qrResult) {
                qrResult.textContent =
                    "Image received. Actual QR decoding is not connected yet.";
            }
        });
    }

    // 5. DASHBOARD STATISTICS
    let totalScans = 0;
    let fraudAlerts = 0;

    function updateStats(isSuspicious) {
        totalScans++;

        if (isSuspicious) {
            fraudAlerts++;
        }

        const totalElement = document.getElementById("totalScans");
        const alertsElement = document.getElementById("fraudAlerts");

        if (totalElement) {
            totalElement.textContent = totalScans;
        }

        if (alertsElement) {
            alertsElement.textContent = fraudAlerts;
        }
    }

    // 6. RECENT ACTIVITY
    function addActivity(title, description) {
        const activityList = document.getElementById("activityList");

        if (!activityList) return;

        const item = document.createElement("div");
        item.className = "activity-item";

        const titleElement = document.createElement("strong");
        titleElement.textContent = title;

        const descriptionElement = document.createElement("span");
        descriptionElement.textContent = description;

        item.appendChild(titleElement);
        item.appendChild(descriptionElement);

        activityList.prepend(item);
    }

    // 7. DASHBOARD SEARCH
    const dashboardSearch = document.getElementById("dashboardSearch");

    if (dashboardSearch) {
        dashboardSearch.addEventListener("input", function () {
            const searchText = dashboardSearch.value.toLowerCase();

            document.querySelectorAll(
                ".activity-item, .feature-card"
            ).forEach(function (item) {
                item.style.display =
                    item.textContent.toLowerCase().includes(searchText)
                        ? ""
                        : "none";
            });
        });
    }

});