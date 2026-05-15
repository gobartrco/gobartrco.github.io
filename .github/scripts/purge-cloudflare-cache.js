#!/usr/bin/env node

/**
 * CloudFlare Cache Purge
 *
 * This script purges cache for the application subdomain after deployment.
 * This ensures users get the latest version of the application immediately.
 *
 * Required Environment Variables:
 * - CLOUDFLARE_API_TOKEN: CloudFlare API token with Cache Purge permissions
 * - DOMAIN: The base domain (e.g., bartr.co)
 * - SUBDOMAIN: The subdomain to purge (default: app)
 */

const https = require("https");

// Configuration from environment variables
const config = {
  apiToken: process.env.CLOUDFLARE_API_TOKEN,
  domain: process.env.DOMAIN,
  subdomain: process.env.SUBDOMAIN,
};

// Validate configuration
function validateConfig() {
  const missing = [];
  if (!config.apiToken) missing.push("CLOUDFLARE_API_TOKEN");
  if (!config.domain) missing.push("DOMAIN");
  if (!config.subdomain) missing.push("SUBDOMAIN");

  if (missing.length > 0) {
    console.error(
      "❌ Missing required environment variables:",
      missing.join(", "),
    );
    process.exit(1);
  }
}

// Make HTTPS request helper
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          const response = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(response);
          } else {
            reject(
              new Error(`HTTP ${res.statusCode}: ${JSON.stringify(response)}`),
            );
          }
        } catch (e) {
          reject(new Error(`Failed to parse response: ${body}`));
        }
      });
    });

    req.on("error", reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Get CloudFlare Zone ID for the domain
async function getZoneId() {
  console.log(`🔍 Looking up CloudFlare Zone ID for ${config.domain}...`);

  const options = {
    hostname: "api.cloudflare.com",
    port: 443,
    path: `/client/v4/zones?name=${config.domain}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${config.apiToken}`,
      "Content-Type": "application/json",
    },
  };

  const response = await makeRequest(options);

  if (!response.success || !response.result || response.result.length === 0) {
    throw new Error(`Zone not found for domain: ${config.domain}`);
  }

  const zoneId = response.result[0].id;
  console.log(`✅ Found Zone ID: ${zoneId}`);
  return zoneId;
}

// Purge cache for specific subdomain
async function purgeCache(zoneId) {
  const fullDomain = `${config.subdomain && config.subdomain + "."}${config.domain}`;
  console.log(`🗑️  Purging cache for ${fullDomain}...`);

  const options = {
    hostname: "api.cloudflare.com",
    port: 443,
    path: `/client/v4/zones/${zoneId}/purge_cache`,
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiToken}`,
      "Content-Type": "application/json",
    },
  };

  const data = {
    hosts: [fullDomain],
  };

  const response = await makeRequest(options, data);

  if (response.success) {
    console.log("✅ Cache purged successfully!");
    console.log(
      "ℹ️  Note: It may take a few moments for the purge to propagate globally.",
    );
    return response.result;
  } else {
    throw new Error(
      `Failed to purge cache: ${JSON.stringify(response.errors)}`,
    );
  }
}

// Main execution
async function main() {
  console.log("🚀 CloudFlare Cache Purge");
  console.log("=========================\n");

  validateConfig();

  try {
    // Get CloudFlare Zone ID
    const zoneId = await getZoneId();

    // Purge the cache
    await purgeCache(zoneId);

    console.log("\n✅ CloudFlare cache purge completed!");
    console.log(
      `🌐 Cached content for ${config.subdomain}.${config.domain} has been cleared.\n`,
    );

    process.exit(0);
  } catch (error) {
    console.error("\n❌ CloudFlare cache purge failed:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { main };
