The script looks up the IP's for the list of domains in your input.csv file (first row) and outputs them with the hosting provider.

Clone locally: git clone https://github.com/bigscotia10/ipinfo-domain-lookups
Install the following: npm install fs dns axios csv-parser
Replace input.csv file with your file and name it input.csv 
Add a local .env file and add the following to it: IPINFO_TOKEN=YOUR_TOKEN (Get a free API Token here: https://ipinfo.io/)
Run: node two-hdl.js
Your results are output to output.csv

EXTRA:
If you want to use the other script to grab the subdomains, you can use it like this:
Run: node one-sdl.js
That outputs the results into the input.csv file
Then run: two-hdl.js
This takes the input.csv file and outputs the results into output.csv

TODO:
1. Look at other API's we can use to validate and grab additional sub-doamins
2. Look at best API's to grab the WAF info