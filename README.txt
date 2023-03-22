You can add as many domains to the script as you'd like. It will use the ipinfo API to grab the hosting provider information and show it in your terminal along with the domain name.

Here is what you need to get this to work:

1. Create a file called dnsLookup.js
2. Clone or add the code here to that file
3. install node
4. npm install axios, dns
5. Sign up for a free API from ipinfo here: https://ipinfo.io/ (This take about 15 seconds)
6. Replace where is says TOKEN in the code with the token you get from ipinfo
7. Add as many domains as you'd like to the script, replacing the www.example-domain.com with your domain. Making sure to remove the http:// or https://
8. Once you updated the file, you can now run the script
9. To run the script, do the following via your terminal: node dnsLookup.js
10. The script will return the results in the terminal
