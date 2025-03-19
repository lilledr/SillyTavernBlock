const fs = require('fs');
const path = require('path');

// Set the blocklist file path (adjust for your system)
const BLOCKLIST_PATH = "D:\\Random\\PythonStuff\\AIThings\\blocked_websites.json";

// Ensure the file exists
if (!fs.existsSync(BLOCKLIST_PATH)) {
    fs.writeFileSync(BLOCKLIST_PATH, JSON.stringify([]));
}

// Function to load blocked sites
function loadBlockedSites() {
    try {
        return JSON.parse(fs.readFileSync(BLOCKLIST_PATH, 'utf8'));
    } catch (err) {
        console.error("Error reading blocklist:", err);
        return [];
    }
}

// Function to save blocked sites
function saveBlockedSites(blockedSites) {
    try {
        fs.writeFileSync(BLOCKLIST_PATH, JSON.stringify(blockedSites, null, 2));
    } catch (err) {
        console.error("Error saving blocklist:", err);
    }
}

// Function to update blocklist based on AI response
function updateBlocklist(text) {
    let blockedSites = loadBlockedSites();
    let modified = false;

    // Block new sites
    const blockMatches = text.match(/\[BLOCK:\s*([\w.-]+)\]/g);
    if (blockMatches) {
        blockMatches.forEach(match => {
            const site = match.replace(/\[BLOCK:\s*|\]/g, "").trim();
            if (!blockedSites.includes(site)) {
                blockedSites.push(site);
                console.log(`Blocked: ${site}`);
                modified = true;
            }
        });
    }

    // Unblock sites
    const unblockMatches = text.match(/\[UNBLOCK:\s*([\w.-]+)\]/g);
    if (unblockMatches) {
        unblockMatches.forEach(match => {
            const site = match.replace(/\[UNBLOCK:\s*|\]/g, "").trim();
            const index = blockedSites.indexOf(site);
            if (index !== -1) {
                blockedSites.splice(index, 1);
                console.log(`Unblocked: ${site}`);
                modified = true;
            }
        });
    }

    if (modified) {
        saveBlockedSites(blockedSites);
    }
}

// Hook into SillyTavern's AI response
hooks.onResponse.push((response) => {
    updateBlocklist(response);
});
