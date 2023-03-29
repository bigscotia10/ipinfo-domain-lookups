The script looks up the IP's for the list of domains in your input.csv file (first row) and outputs them with the hosting provider.

Clone locally: git clone https://github.com/bigscotia10/ipinfo-domain-lookups
Install the following: npm install fs dns axios csv-parser
Replace input.csv file with your file and name it input.csv 
Add a local .env file and add the following to it: IPINFO_TOKEN=YOUR_TOKEN (Get a free API Token here: https://ipinfo.io/)
Run: node hosting.js
Your results are output to output.csv

EXTRA:
If you want to use the other script to grab the subdomains, you can use it like this:
Install and run https://github.com/projectdiscovery/subfinder
Run: node domains.js
That outputs the results into the domains.csv file
Then run: hosting.js
This takes the domains.csv file and outputs the results into hosting.csv

TODO:
1. The waf.js script is a work in progress. My goal is to quickly itterate over all the subdomains to get WAF yes, no and what the WAF is if found. I need to do more research on best approaches, right now it's just ising lots of if statements.