const axios = require('axios');
const fs = require('fs');
const csvParser = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const detectWaf = async (url) => {
    try {
        const response = await axios.head(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36'
            },
            timeout: 3000, // Set the timeout to 3 seconds
        });
        const headers = response.headers;

        if (headers['server'] && headers['server'].toLowerCase().includes('cloudflare')) {
            return 'Cloudflare';
        } else if (headers['server'] && headers['server'].includes('ECAcc')) {
            return 'Edgio WAF';
        } else if (headers['x-powered-by'] && headers['x-powered-by'].toLowerCase().includes('awselb')) {
            return 'Amazon Web Services (AWS) WAF';
        } else if (headers['x-content-type-options'] && headers['x-content-type-options'].toLowerCase().includes('nosniff') &&
            headers['x-xss-protection'] && headers['x-xss-protection'].toLowerCase().includes('1; mode=block')) {
            return 'ModSecurity';
        } else if (headers['x-cdn'] && headers['x-cdn'].toLowerCase().includes('incapsula')) {
            return 'Imperva Incapsula WAF';
        } else if (headers['server'] && headers['server'].toLowerCase().includes('akamai')) {
            return 'Akamai Kona Site Defender';
            // Akamai Ghost? TODO: Look into examples to get this to work correctly.
        } else if (headers['server'] && headers['server'].toLowerCase().includes('akamaighost')) {
            return 'Akamai Global Host (GHost)';
        } else if (headers['x-wa-info'] || headers['x-bigip']) {
            return 'F5 BIG-IP ASM';
        } else if (headers['x-sucuri-id']) {
            return 'Sucuri WAF';
        } else if (headers['barracuda.waf']) {
            return 'Barracuda WAF';
        }
        else if (headers['server'] && headers['server'].toLowerCase().includes('gws')) {
            return 'Google Web Server (GWS)';
        }

        else {
            return 'Unknown or no WAF detected';
        }
    } catch (error) {
        console.error(`Error detecting WAF for ${url}:`, error.message);
        return null;
    }
};

const getDomainsFromCSV = (csvFilePath) => {
    return new Promise((resolve, reject) => {
        const domains = [];

        fs.createReadStream(csvFilePath)
            .pipe(csvParser())
            .on('data', (row) => {
                domains.push(row[Object.keys(row)[0]]);
            })
            .on('end', () => {
                resolve(domains.slice(1)); // Skip the first row (header)
            })
            .on('error', reject);
    });
};

const main = async () => {
    const csvFilePath = './domains.csv'; // Replace this with the path to your CSV file
    const domains = await getDomainsFromCSV(csvFilePath);

    const csvWriter = createCsvWriter({
        path: 'waf.csv',
        header: [
            { id: 'domain', title: 'DOMAIN' },
            { id: 'hasWaf', title: 'HAS WAF' },
            { id: 'wafName', title: 'WAF NAME' },
        ],
    });

    const results = [];

    for (const domain of domains) {
        console.log(`\nProcessing domain: ${domain}`);
        const waf = await detectWaf(`https://${domain}`);
        const hasWaf = waf !== 'Unknown or no WAF detected';
        const wafName = hasWaf ? waf : 'Unknown';
        console.log(`WAF detected for ${domain}:`, wafName);

        results.push({
            domain: domain,
            hasWaf: hasWaf ? 'Yes' : 'No',
            wafName: wafName,
        });
    }

    csvWriter.writeRecords(results).then(() => {
        console.log('\nWAF detection results saved to waf.csv');
    });
};

main();
