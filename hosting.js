// Remember to add your .env file and add your token to it.
require('dotenv').config();

const fs = require('fs');
const dns = require('dns');
const axios = require('axios');
const csvParser = require('csv-parser');

// Rename your file to domains.csv OR update the following:
const inputFile = 'domains.csv';

// Format it and remove http and https
function removeHttpProtocol(url) {
  const cleanedUrl = url.replace(/^(https?:\/\/)/, '');
  return `${cleanedUrl}`;
}

// Grab content from CSV and return a cleaned up array of domains
function getDomainsFromCSV() {
  return new Promise((resolve) => {
    let rowIndex = 0;
    let cleanedDomains = [];

    fs.createReadStream(inputFile)
      .pipe(csvParser({ headers: false }))
      .on('data', (row) => {
        rowIndex++;

        // Skip the header
        if (rowIndex === 1) {
          return;
        }

        const domain = row[0];
        const cleanedDomain = removeHttpProtocol(domain);
        cleanedDomains.push(cleanedDomain);
      })
      .on('end', () => {
        resolve(cleanedDomains);
      });
  });
}

// I'm using the .env, but if you'd prefer to just add your token directly here, just comment out the line under the commented out area and add this one instead:
// const ipInfoToken = 'ADD TOKEN'; // Replace with your IPinfo API token
const ipInfoToken = process.env.IPINFO_TOKEN;

// use the lookupA function
const lookupA = (domain) => {
  return new Promise((resolve, reject) => {
    dns.resolve4(domain, (error, records) => {
      if (error) reject(error);
      else resolve(records);
    });
  });
};

// use the ipinfo API end point
const getIPinfo = async (ip) => {
  try {
    const response = await axios.get(`https://ipinfo.io/${ip}/json?token=${ipInfoToken}`);
    return response.data.org.replace(/AS\d+\s*/, '').replace(/"/g, '');
  } catch (error) {
    console.error(`Error fetching IPinfo for ${ip}:`, error.message);
    return 'None Found';
  }
};

// get the domains and log the results
const main = async () => {
  const domains = await getDomainsFromCSV();

  let domainOrgMap = {};

  for (const domain of domains) {
    console.log(`\nProcessing domain: ${domain}`);
    try {
      const aRecords = await lookupA(domain);
      console.log(`A records for ${domain}:`);
      console.log(aRecords.join(', '));

      for (const ip of aRecords) {
        const orgWithoutAS = await getIPinfo(ip);
        if (orgWithoutAS && !domainOrgMap[domain]) {
          console.log(`IPinfo "org" for ${ip}: ${orgWithoutAS}`);
          domainOrgMap[domain] = orgWithoutAS;
        }
      }

    } catch (error) {
      console.error(`Error fetching A records for ${domain}:`, error.message);
      domainOrgMap[domain] = 'None Found';
    }
  }

  // format the CSV so it just shows the org
  let csvData = "Domain,Org\n";
  for (const [domain, org] of Object.entries(domainOrgMap)) {
    const orgWithoutAS = org.replace(/AS\d+\s*/, '').replace(/,/g, '');
    //csvData += `${domain},${orgWithoutAS}\n`;
    csvData += `${orgWithoutAS}\n`;
  }

  // output it to the hosting.csv file
  fs.writeFile("hosting.csv", csvData, (err) => {
    if (err) {
      console.error("Error writing hosting.csv file:", err.message);
    } else {
      console.log("\nhosting.csv file successfully saved.");
    }
  });
};

main();