// Use the dnsLookup.js file locally in your terminal to get the ipinfo for the domain you list in the domains varialbe
// make sure you have npm installed
// then install the following:
//// npm install axios
//// npm install dns
// Sign up for a free API from ipinfo here: https://ipinfo.io/
// Replace TOKEN in the code with your ipinfo token
// Run the script in your terminal doing the following: node dnsLookup.js
// The script will return all the ipinfo org information for the associated domains.

const dns = require('dns');
const axios = require('axios');

// Remove the HTTP and HTTPS. The domain should say something like www.domain.com or domain.com
const domains = [
  'www.example-domain.com',
];


const ipInfoToken = 'TOKEN'; // Replace with your IPinfo API token

const lookupA = (domain) => {
  return new Promise((resolve, reject) => {
    dns.resolve4(domain, (error, records) => {
      if (error) reject(error);
      else resolve(records);
    });
  });
};

const getIPinfo = async (ip) => {
  try {
    const response = await axios.get(`https://ipinfo.io/${ip}/json?token=${ipInfoToken}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching IPinfo for ${ip}:`, error.message);
    return null;
  }
};

const main = async () => {
  for (const domain of domains) {
    console.log(`\nProcessing domain: ${domain}`);
    try {
      const aRecords = await lookupA(domain);
      console.log(`A records for ${domain}:`);
      console.log(aRecords.join(', '));

      for (const ip of aRecords) {
        const ipInfo = await getIPinfo(ip);
        if (ipInfo) {
          console.log(`IPinfo "org" for ${ip}: ${ipInfo.org}`);
        }
      }
    } catch (error) {
      console.error(`Error fetching A records for ${domain}:`, error.message);
    }
  }
};

main();
