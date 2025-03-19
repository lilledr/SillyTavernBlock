// Global variable to store blocked sites (temporary)
let blockedSites = [];

// Function to update blocked/unblocked sites
function updateBlocklist(response) {
    let modified = false;
    let message = "";

    // Block websites
    const blockMatches = response.match(/\[BLOCK:\s*([\w.-]+)\]/g);
    if (blockMatches) {
        blockMatches.forEach(match => {
            const site = match.replace(/\[BLOCK:\s*|\]/g, "").trim();
            if (!blockedSites.includes(site)) {
                blockedSites.push(site);
                console.log(`🔴 Blocked: ${site}`);
                message += `🔴 Blocked: ${site}\n`;
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
                message += `🟢 Unblocked: ${site}\n`;
                modified = true;
            }
        });
    }

    if (modified) {
        // Save updated blockedSites list
        saveBlockedSites();

        // Print message in SillyTavern chat
        ST.chat.sendMessage(message.trim());
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
