registerPlugin({
    name: "Website Blocker",
    version: "1.0",
    description: "Detects and logs blocked websites from AI responses",
    author: "You",
    async onResponse(response, state) {
        const blockMatch = response.match(/You are blocked from using (\S+)/);
        if (blockMatch) {
            const blockedSite = blockMatch[1];
            addBlockedSite(blockedSite);
        }
    }
});

async function addBlockedSite(site) {
    const filePath = "D:\\Random\\PythonStuff\\AIThings\\blocked_websites.json";

    // Read existing file
    let blockedSites = [];
    try {
        const data = await readFile(filePath, "utf-8");
        blockedSites = JSON.parse(data);
    } catch (error) {
        console.warn("Blocked websites file not found, creating a new one.");
    }

    // Add the site if not already blocked
    if (!blockedSites.includes(site)) {
        blockedSites.push(site);
        await writeFile(filePath, JSON.stringify(blockedSites, null, 2), "utf-8");
        console.log(`Blocked: ${site}`);
    }
}
