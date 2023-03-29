// install subfinder
// unzip subfinder_2.5.7_macOS_amd64.zip
// sudo mv subfinder /usr/local/bin/
// sudo chmod +x /usr/local/bin/subfinder
// sudo spctl --add /usr/local/bin/subfinder
// then double click on the app to have it run

const { exec } = require('child_process');
const fs = require('fs');

const findSubdomains = (domain, callback) => {
    const subfinderProcess = exec(`subfinder -d ${domain} -silent`);

    subfinderProcess.stdout.on('data', (data) => {
        const subdomain = data.trim();
        console.log(`Found subdomain: ${subdomain}`);
        fs.appendFileSync('domains.csv', `${subdomain}\n`);
        callback(null, subdomain);
    });

    subfinderProcess.stderr.on('data', (data) => {
        console.error(`Error: ${data}`);
    });

    subfinderProcess.on('close', (code) => {
        if (code !== 0) {
            console.error(`Subfinder process exited with code ${code}`);
            callback(new Error(`Subfinder process exited with code ${code}`), null);
        } else {
            console.log(`Subfinder finished for ${domain}`);
            callback(null, null);
        }
    });
};

const domain = 'venetianlasvegas.com'; // Replace with your target domain

// Initialize the CSV file with a header (optional)
fs.writeFileSync('domains.csv', 'Subdomain\n');

findSubdomains(domain, (error, subdomain) => {
    if (error) {
        console.error(`Error finding subdomains for ${domain}`);
    } else if (subdomain) {
        console.log(`Found subdomain: ${subdomain}`);
    } else {
        console.log(`Finished finding subdomains for ${domain}`);
    }
});
