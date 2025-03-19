const fs = require('fs');
const path = require('path');

const BLOCKLIST_PATH = path.join(__dirname, 'blocked_websites.json');

// Ensure the blocklist file exists
function ensureBlocklistExists() {
    if (!fs.existsSync(BLOCKLIST_PATH)) {
        fs.writeFileSync(BLOCKLIST_PATH, '[]', 'utf8');
    }
}

// Function to block websites
function addBlockedWebsites(sites) {
    ensureBlocklistExists();
    let blocklist = JSON.parse(fs.readFileSync(BLOCKLIST_PATH, 'utf8'));

    let newEntries = sites.filter(site => !blocklist.includes(site));
    if (newEntries.length > 0) {
        blocklist.push(...newEntries);
        fs.writeFileSync(BLOCKLIST_PATH, JSON.stringify(blocklist, null, 2), 'utf8');
        console.log(`Blocked: ${newEntries.join(', ')}`);
    }
}

// Function to unblock websites
function removeBlockedWebsites(sites) {
    ensureBlocklistExists();
    let blocklist = JSON.parse(fs.readFileSync(BLOCKLIST_PATH, 'utf8'));

    let updatedBlocklist = blocklist.filter(site => !sites.includes(site));
    if (updatedBlocklist.length !== blocklist.length) {
        fs.writeFileSync(BLOCKLIST_PATH, JSON.stringify(updatedBlocklist, null, 2), 'utf8');
        console.log(`Unblocked: ${sites.join(', ')}`);
    }
}

// Hook into SillyTavern's message system
hook.onMessage((message) => {
    // Match all [BLOCK: example.com] entries
    const blockMatches = message.match(/\[BLOCK:\s*([^\]]+)\]/g);
    if (blockMatches) {
        const sitesToBlock = blockMatches.map(match => match.replace(/\[BLOCK:\s*|\]/g, '').trim());
        addBlockedWebsites(sitesToBlock);
    }

    // Match all [UNBLOCK: example.com] entries
    const unblockMatches = message.match(/\[UNBLOCK:\s*([^\]]+)\]/g);
    if (unblockMatches) {
        const sitesToUnblock = unblockMatches.map(match => match.replace(/\[UNBLOCK:\s*|\]/g, '').trim());
        removeBlockedWebsites(sitesToUnblock);
    }
});
