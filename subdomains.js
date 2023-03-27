const axios = require("axios");
require('dotenv').config();

const apiKey = process.env.SHODAN_API_KEY;

async function findSubdomains(domain) {
  try {
    const query = `hostname:${domain}`;
    const url = `https://api.shodan.io/shodan/host/search?key=${apiKey}&query=${encodeURIComponent(query)}`;

    const response = await axios.get(url);
    const data = response.data;

    const subdomains = new Set();

    for (const match of data.matches) {
      const subdomain = match.hostnames[0];
      if (subdomain.endsWith(`.${domain}`)) {
        subdomains.add(subdomain);
      }
    }

    console.log(Array.from(subdomains));
  } catch (error) {
    console.error("Error:", error.message);
  }
}

const domain = "google.com"; // Replace with the domain you want to search for
findSubdomains(domain);
