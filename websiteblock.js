// Global variable to store blocked sites (temporary)
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
        ST.chat.print("🔧 Blocklist updated!");
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

// Wait until SillyTavern hooks are ready before initializing
function waitForHooks() {
    if (typeof hooks !== "undefined" && hooks.onResponse) {
        console.log("✅ Hooks detected, initializing script...");
        initBlockingScript();
    } else {
        console.log("⏳ Waiting for hooks...");
        setTimeout(waitForHooks, 500);
    }
}

// Function to initialize blocking script
function initBlockingScript() {
    loadBlockedSites();
    hooks.onResponse.push((response) => {
        updateBlocklist(response);
    });
    console.log("🚀 Blocking script initialized!");
}

// Start waiting for hooks to be ready
waitForHooks();
