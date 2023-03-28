const axios = require('axios');
const fs = require('fs');

require('dotenv').config();

const virustotalApiKey = process.env.VIRUSTOTAL_API_KEY;


// const ipInfoToken = process.env.IPINFO_TOKEN;

const getSubdomains = async (domain) => {
    try {
        const response = await axios.get(`https://www.virustotal.com/api/v3/domains/${domain}/subdomains`, {
            headers: {
                'x-apikey': virustotalApiKey
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching subdomains for ${domain}:`, error.message);
        return null;
    }
};

const main = async () => {
    // Add it like domain.com, without the https or www
    const domain = 'google.com';
    const data = await getSubdomains(domain);

    if (data && data.data) {
        const subdomains = data.data.map((entry) => entry.id);
        console.log(`Subdomains for ${domain}:`);
        console.log(subdomains.join(', '));

        // Save the subdomains to a CSV file
        const csvData = "Subdomain\n" + subdomains.join('\n');
        fs.writeFile('input.csv', csvData, (err) => {
            if (err) {
                console.error("Error writing CSV file:", err.message);
            } else {
                console.log("\nCSV file successfully saved.");
            }
        });
    } else {
        console.log(`No subdomains found for ${domain}.`);
    }
};

main();
