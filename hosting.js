require('dotenv').config();

const fs = require('fs');
const dns = require('dns');
const axios = require('axios');
const csvParser = require('csv-parser');

const inputFile = 'domains.csv';

function removeHttpProtocol(url) {
  const cleanedUrl = url.replace(/^(https?:\/\/)/, '');
  return `${cleanedUrl}`;
}

function getDomainsFromCSV() {
  return new Promise((resolve) => {
    let rowIndex = 0;
    let cleanedDomains = [];

    fs.createReadStream(inputFile)
      .pipe(csvParser({ headers: false }))
      .on('data', (row) => {
        rowIndex++;

        // Skip the header row
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

// const ipInfoToken = 'ADD TOKEN'; // Replace with your IPinfo API token
const ipInfoToken = process.env.IPINFO_TOKEN;

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
    return response.data.org.replace(/AS\d+\s*/, '').replace(/"/g, '');
  } catch (error) {
    console.error(`Error fetching IPinfo for ${ip}:`, error.message);
    return 'None Found';
  }
};


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

  let csvData = "Domain,Org\n";
  for (const [domain, org] of Object.entries(domainOrgMap)) {
    const orgWithoutAS = org.replace(/AS\d+\s*/, '').replace(/,/g, '');
    //csvData += `${domain},${orgWithoutAS}\n`;
    csvData += `${orgWithoutAS}\n`;
  }

  fs.writeFile("hosting.csv", csvData, (err) => {
    if (err) {
      console.error("Error writing CSV file:", err.message);
    } else {
      console.log("\nCSV file successfully saved.");
    }
  });
};

main();