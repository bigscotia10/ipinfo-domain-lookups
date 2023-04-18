import os
import csv
import socket
import requests
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Input file name
input_file = 'domains.csv'

# Function to remove http and https
def remove_http_protocol(url):
    cleaned_url = url.replace("http://", "").replace("https://", "")
    return cleaned_url

# Function to read domains from CSV
def get_domains_from_csv():
    cleaned_domains = []
    with open(input_file, newline='') as csvfile:
        csvreader = csv.reader(csvfile)
        for i, row in enumerate(csvreader):
            if i == 0:  # Skip the header
                continue
            domain = row[0]
            cleaned_domain = remove_http_protocol(domain)
            cleaned_domains.append(cleaned_domain)
    return cleaned_domains

# IPinfo API token
ipinfo_token = os.getenv("IPINFO_TOKEN")

# Function to resolve A records
def lookup_a(domain):
    return socket.getaddrinfo(domain, None, socket.AF_INET)

# Function to get IPinfo
def get_ipinfo(ip):
    try:
        response = requests.get(f"https://ipinfo.io/{ip}/json?token={ipinfo_token}")
        response.raise_for_status()
        data = response.json()
        return data["org"].replace("AS\d+\s*", "").replace('"', "")
    except requests.exceptions.RequestException as e:
        print(f"Error fetching IPinfo for {ip}: {e}")
        return "None Found"

# Main function
def main():
    domains = get_domains_from_csv()

    domain_org_map = {}

    for domain in domains:
        print(f"\nProcessing domain: {domain}")
        try:
            a_records = [info[4][0] for info in lookup_a(domain)]
            print(f"A records for {domain}:")
            print(", ".join(a_records))

            for ip in a_records:
                org_without_as = get_ipinfo(ip)
                if org_without_as and domain not in domain_org_map:
                    print(f'IPinfo "org" for {ip}: {org_without_as}')
                    domain_org_map[domain] = org_without_as

        except socket.gaierror as e:
            print(f"Error fetching A records for {domain}: {e}")
            domain_org_map[domain] = "None Found"

    # Format the CSV to show only the org
    csv_data = "Domain,Org\n"
    for domain, org in domain_org_map.items():
        org_without_as = org.replace("AS\d+\s*", "").replace(",", "")
        csv_data += f"{org_without_as}\n"

    # Write the output to hosting.csv file
    with open("hosting.csv", "w") as csvfile:
        csvfile.write(csv_data)
        print("\nhosting.csv file successfully saved.")

# Run the main function
if __name__ == "__main__":
    main()
