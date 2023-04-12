# ipinfo-domain-lookups

The script looks up the IP's for the list of domains in your input.csv file (first column) and outputs them with the hosting provider.

## IP Lookup
1. Clone locally: ```git clone https://github.com/bigscotia10/ipinfo-domain-lookups```
2. Install the following dependencies: ```npm install fs dns axios csv-parser```
3. Replace ```input.csv``` file with your WSRA output .csv file and ensure it is named ```input.csv``` 
4. Add a local .env file ```touch .env``` add the following to it: IPINFO_TOKEN=YOUR_TOKEN (Get a free API Token here: https://ipinfo.io/)
5. Run: ```node hosting.js```
6. Your results are output to output.csv

## Subdomains Lookup
If you want to use the other script to grab the subdomains, you can use it like this:

7. Install and run https://github.com/projectdiscovery/subfinder
8. Run: node domains.js
9. That outputs the results into the domains.csv file
10. Then run: hosting.js
11. This takes the domains.csv file and outputs the results into hosting.csv

## TODO:
1. The waf.js script is a work in progress. My goal is to quickly itterate over all the subdomains to get WAF yes/no and what WAF is if found. I need to do more research on best approaches, right now it's just using lots of if statements.
