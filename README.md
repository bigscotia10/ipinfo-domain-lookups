# ipinfo-domain-lookups

The script looks up the IP's for the list of domains in your input.csv file (first column) and outputs them with the hosting provider.

## Hosting Lookup
1. Clone this repositry to run locally: ```git clone https://github.com/bigscotia10/ipinfo-domain-lookups```
2. Install the following dependencies: ```npm install fs dns axios csv-parser dotenv```
3. Add your list of domains to ```domains.csv``` or replace this file with your WSRA output and ensure it is named ```domains.csv``` 
4. Create a local .env file ```touch .env``` and add the following to it: ```IPINFO_TOKEN=YOUR_TOKEN``` (Get a free API Token here: https://ipinfo.io/)
5. Run: ```node hosting.js```
6. Your results are output to ```hosting.csv```

## Subdomains Lookup
If you want to use the domains script to lookup subdomains, you can use it like this:

7. Install and run https://github.com/projectdiscovery/subfinder
8. Run: ```node domains.js```
9. That outputs subdomain lookup results into the file ```domains.csv```
10. You may then repeat steps 5-6 to perform hosting lookup over the subdomains you lookedup. (This takes the domains.csv file and outputs the hosting lookup results into hosting.csv)

## TODO:
The waf.js script is a work in progress. My goal is to quickly itterate over all the subdomains to get WAF yes/no and what WAF is if found. I need to do more research on best approaches, right now it's just using lots of if statements.
