import sys, json, os, csv, time, random
from neo4j import GraphDatabase, basic_auth
from neo4j.exceptions import ServiceUnavailable, AuthError, Neo4jError
import pandas as pd

# Step 1

def ValidateProject(path):
    with open(path, 'r') as file:
        return json.load(file)

def VerifyingDataSource(path):
    try:
        df = pd.read_csv(path)
        return df
    except Exception as e:
        return None
    
def EstablishNeo4jConnection(db):
    try:
        driver = GraphDatabase.driver(db["URI"], auth=basic_auth(db["username"], db["password"]))
        with driver.session() as session:
            session.run("RETURN 1")
    except Exception as e:
        print(e)
        return None


# Step 2

def CheckNodesAndRelationship(config):
    nodes = config["node"]
    relationships = config["relationships"]
    



# Processes

def ETLPipeline(path):
    config = ValidateProject(path)
    data_df = VerifyingDataSource(config["filePath"])
    EstablishNeo4jConnection(config["db"])
    return config, data_df

def AnlaysingNodesAndRelationships(config):
    CheckNodesAndRelationship(config)


if __name__ == "__main__":
    path = '/home/achaarya/.neoport/Mowli.neoproj'
    config, data_df = ETLPipeline(path)