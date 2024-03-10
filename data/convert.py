import csv
import json

# Path to the CSV file
csv_file_path = 'data/books_data_full.csv'
# Path to the output JSON file
json_file_path = 'data/books_data.json'

# Read the CSV and add the data to a dictionary
data = []
try:
    with open(csv_file_path, encoding='utf-8') as csvf:
        csv_reader = csv.DictReader(csvf)
        for rows in csv_reader:
            data.append(rows)
except Exception as e:
    print(f"Error reading CSV file: {e}")

# Write the data to a JSON file
try:
    with open(json_file_path, 'w', encoding='utf-8') as jsonf:
        jsonf.write(json.dumps(data, indent=4))
except Exception as e:
    print(f"Error writing JSON file: {e}")
