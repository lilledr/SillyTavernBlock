// Wait for ST and hooks to be available
function waitForST() {
    if (typeof ST !== "undefined" && typeof hooks !== "undefined") {
        console.log("✅ ST and hooks are now available! Running script...");
        initBlocklist();
    } else {
        console.log("⏳ Waiting for ST and hooks...");
        setTimeout(waitForST, 500); // Check again in 500ms
    }
}

// Initialize blocklist logic
function initBlocklist() {
    // Global variable to store blocked sites
    let blockedSites = [];

    // Function to update blocked/unblocked sites
    function updateBlocklist(response) {
        let modified = false;

        // Block websites
        const blockMatches = response.match(/\[BLOCK:\s*([\w.-]+)\]/g);
        if (blockMatches) {
            blockMatches.forEach(match => {
                const site = match.replace(/\[BLOCK:\s*|\]/g, "").trim();
                if (!blockedSites.includes(site)) {
                    blockedSites.push(site);
                    console.log(`🔴 Blocked: ${site}`);
                    modified = true;
                }
            });
        }

        // Unblock websites
        const unblockMatches = response.match(/\[UNBLOCK:\s*([\w.-]+)\]/g);
        if (unblockMatches) {
            unblockMatches.forEach(match => {
                const site = match.replace(/\[UNBLOCK:\s*|\]/g, "").trim();
                const index = blockedSites.indexOf(site);
                if (index !== -1) {
                    blockedSites.splice(index, 1);
                    console.log(`🟢 Unblocked: ${site}`);
                    modified = true;
                }
            });
        }

        if (modified) {
            // Save updated blockedSites list
            saveBlockedSites();
            ST.chat.printSystemMessage(`🔄 Blocklist updated!`);
        }
    }

    // Function to save blocked sites to storage
    function saveBlockedSites() {
        ST.storage.set('blocked_websites', blockedSites);
    }

    // Function to load blocked sites from storage
    function loadBlockedSites() {
        const storedSites = ST.storage.get('blocked_websites');
        if (storedSites) {
            blockedSites = storedSites;
        }
    }

    // Load sites when script starts
    loadBlockedSites();

    // Hook into AI response processing
    hooks.onResponse.push((response) => {
        updateBlocklist(response);
    });

    console.log("🚀 Blocklist script initialized!");
}

// Start waiting for ST to load
waitForST();
