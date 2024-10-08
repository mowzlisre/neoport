import sys, json, os, csv
from neo4j import GraphDatabase, basic_auth
from neo4j.exceptions import ServiceUnavailable, AuthError, Neo4jError
from pprint import pprint

def pingDb(uri, username, password):
    driver = GraphDatabase.driver(uri, auth=basic_auth(username, password))

    try:
        with driver.session() as session:
            result = session.run("RETURN 1 AS status")
            status = result.single()["status"]
            if status == 1:
                print("Neo4j database is up and running.")
                return True
    except AuthError as e:
        print(f"Authentication failed: {e}")
        return False
    except ServiceUnavailable as e:
        print(f"Database service is unavailable: {e}")
        return False
    except Neo4jError as e:
        print(f"Neo4j error: {e}")
        return False
    except Exception as e:
        print(f"An error occurred: {e}")
        return False
    finally:
        driver.close()

    print("Neo4j database is down or the query failed.")
    return False

def pullDataSource(path):
    if not os.path.isfile(path):
        print(f"Error: {path} is not a valid file.")
        return None
    
    if not path.lower().endswith('.csv'):
        print(f"Error: {path} is not a CSV file.")
        return None
    
    data = []
    
    # Parse the CSV file and store its content in a dictionary
    try:
        with open(path, mode='r', newline='', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                data.append(dict(row))
        return data
    except Exception as e:
        print(f"An error occurred while reading the CSV file: {e}")
        return None

def main1():
    config = json.loads(sys.stdin.read())
    print("hello")
    if config["db"]["URI"] == '' or config["db"]["username"] == '' or config["db"]["password"] == '':
        return "Improper credentials configuration for Neo4j"

    connection = pingDb(config["db"]["URI"], config["db"]["username"], config["db"]["password"])
    if connection != None:
        print(config["filePath"])
        # data = pullDataSource(config["filePath"])
        # print(len(data))

    else:
        print(connection)

def main():
    try:
        # Read the arguments (sys.argv[0] is the script name, so start from index 1)
        args = sys.argv[1:]
        print(args[0])

    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")

if __name__ == '__main__':
    main()