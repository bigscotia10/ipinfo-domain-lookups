The script looks up the IP's for the list of domains in your input.csv file (first row) and outputs them with the hosting provider.

Clone locally: git clone https://github.com/bigscotia10/ipinfo-domain-lookups
Install the following: npm install fs dns axios csv-parser
Replace input.csv file with your file and name it input.csv 
Add a local .env file and add the following to it: IPINFO_TOKEN=YOUR_TOKEN (Get a free API Token here: https://ipinfo.io/)
Run: node dnsLookup.js
Your results are output to output.csv