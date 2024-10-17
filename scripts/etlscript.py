import sys, json, os, time
from neo4j import GraphDatabase, basic_auth
import pandas as pd

# New: Variables to store counts and time
start_time = time.time()
total_nodes_created = 0
total_relationships_created = 0

def log_final_results(status):
    """Logs the total time, nodes created, and relationships created."""
    end_time = time.time()
    total_time_taken = end_time - start_time
    result = {
        "stepName": "log",
        "totalTimeTaken": total_time_taken,
        "totalNodesCreated": total_nodes_created,
        "totalRelationshipsCreated": total_relationships_created,
        "status": status
    }
    print(json.dumps(result))


def printStatus(step_name, sub_process_name, sub_process_status, sub_process_completed, percentage=None):
    """Utility function to print structured status updates and exit if the status is False."""
    data = {
        "stepName": step_name,
        "subProcessName": sub_process_name,
        "subProcessStatus": sub_process_status,
        "subProcessCompleted": sub_process_completed
    }
    if percentage is not None:
        data["percentage"] = percentage // 1
    print(json.dumps(data))
    if sub_process_status == 'error':
        log_final_results(False)
        sys.exit()


def ValidateProject(path):
    printStatus("Starting ETL pipeline", "Validate Project", "in-progress", False, 0)
    with open(path, 'r') as file:
        printStatus("Starting ETL pipeline", "Validate Project", "completed", True, 100)
        return json.load(file)


def VerifyDataSource(path):
    printStatus("Starting ETL pipeline", "Verifying Data Source", "in-progress", False, 0)
    try:
        df = pd.read_csv(path)
        printStatus("Starting ETL pipeline", "Verifying Data Source", "completed", True, 100)
        return df
    except Exception as e:
        printStatus("Starting ETL pipeline", "Verifying Data Source", "error", False, 0)
        return None


def EstablishNeo4jConnection(db):
    printStatus("Starting ETL pipeline", "Establishing connection with Neo4j Server", "in-progress", False, 0)
    try:
        driver = GraphDatabase.driver(db["URI"], auth=basic_auth(db["username"], db["password"]))
        with driver.session() as session:
            session.run("RETURN 1")
        printStatus("Starting ETL pipeline", "Establishing connection with Neo4j Server", "completed", True, 100)
        return driver
    except Exception as e:
        printStatus("Starting ETL pipeline", "Establishing connection with Neo4j Server", "error", False, 0)
        return None


def ETLPipeline(path):
    config = ValidateProject(path)
    data_df = VerifyDataSource(config["filePath"])
    driver = EstablishNeo4jConnection(config["db"])
    return config, data_df, driver


def CheckNodesAndRelationship(config):
    printStatus("Extracting nodes and relationships", "", "in-progress", False, 0)
    nodes = config["nodes"]
    relationships = config["relationships"]
    if len(nodes) != 0 and len(relationships) != 0:
        printStatus("Extracting nodes and relationships", "", "completed", True, 100)
        return nodes, relationships
    else:
        printStatus("Extracting nodes and relationships", "", "error", False, 0)


def BundleNodes(nodes, data_df):
    printStatus("Transforming Entities", "Bundling Nodes", "in-progress", False, 0)
    nodes_sum = 0
    nodes_df = {}
    total_nodes = len(nodes)
    try:
        for idx, node in enumerate(nodes):
            indexing_column_key = nodes[node]["attributes"][nodes[node]["index"][0]]["key"]
            indexing_column = nodes[node]["attributes"][nodes[node]["index"][0]]["value"]
            attributes = [nodes[node]["attributes"][i]["value"] for i in nodes[node]["attributes"]]
            new_column_names = {nodes[node]["attributes"][i]["value"]: nodes[node]["attributes"][i]["key"] 
                                for i in nodes[node]["attributes"]}
            unique_values = data_df[attributes].drop_duplicates(subset=[indexing_column])
            unique_values.rename(columns=new_column_names, inplace=True)
            unique_values.instrument_name = indexing_column_key
            nodes_sum += len(unique_values)
            nodes_df[nodes[node]["name"]] = unique_values
            
            # Calculate percentage progress
            percentage = ((idx + 1) / total_nodes) * 100
            printStatus("Transforming Entities", "Bundling Nodes", "in-progress", False, percentage)
        
        printStatus("Transforming Entities", "Bundling Nodes", "completed", True, 100)
        return nodes_df
    except Exception as e:
        printStatus("Transforming Entities", "Bundling Nodes", "error", False, 0)
        print(f"Error: {e}")
        return None


def BundleRelationships(relationships, nodes_df, data_df):    
    printStatus("Transforming Entities", "Bundling Relationships", "in-progress", False, 0)
    total_rels = len(relationships)
    try:
        rel_df = {}
        for idx, rel in enumerate(relationships):
            attributes = [relationships[rel]["attributes"][i] for i in relationships[rel]["attributes"]]
            source_, target_ = [relationships[rel]["node1"], relationships[rel]["node2"]]
            source = nodes[source_]["attributes"][nodes[source_]["index"][0]]["value"]
            target = nodes[target_]["attributes"][nodes[target_]["index"][0]]["value"]
            temp = data_df[[source, target]].drop_duplicates(subset=[source, target])
            temp = temp.rename(columns={source: 'SOURCE_NODE', target: 'TARGET_NODE'})
            for attr in attributes:
                attr_value_column = attr['value']
                attr_key_column = attr['key']   
                temp[attr_key_column] = data_df[attr_value_column]
            rel_df[relationships[rel]["name"]] = temp

            # Calculate percentage progress
            percentage = ((idx + 1) / total_rels) * 100
            printStatus("Transforming Entities", "Bundling Relationships", "in-progress", False, percentage)
        
        printStatus("Transforming Entities", "Bundling Relationships", "completed", True, 100)
        return rel_df
    except Exception as e:        
        printStatus("Transforming Entities", "Bundling Relationships", "error", False, 0)


def TransformEntities(nodes, relationships, data_df):
    nodes_df = BundleNodes(nodes, data_df)
    rels_df = BundleRelationships(relationships, nodes_df, data_df)
    return nodes_df, rels_df


def CreateNodeIndexes(driver, nodes_df):
    total_nodes = len(nodes_df)
    with driver.session() as session:
        for idx, (instrument_name, df) in enumerate(nodes_df.items()):
            query = f"CREATE INDEX IF NOT EXISTS FOR (n:{instrument_name}) ON (n.{df.columns[0]});"
            session.run(query)
            
            # Calculate percentage progress
            percentage = ((idx + 1) / total_nodes) * 100
            printStatus("Exporting data to Neo4j Database", "Creating Node Indexes", "in-progress", False, percentage)
        
        printStatus("Exporting data to Neo4j Database", "Creating Node Indexes", "completed", True, 100)


def ExportNodes(driver, nodes, nodes_df, batch_size=100):
    global total_nodes_created 
    total_rows = sum(len(df) for df in nodes_df.values())
    processed_rows = 0

    with driver.session() as session:
        for node, df in nodes_df.items():
            columns = df.columns
            total_node_rows = len(df)
            for i in range(0, total_node_rows, batch_size):
                batch = df.iloc[i:min(i + batch_size, total_node_rows)].to_dict(orient='records')
                set_clause = ', '.join([f"n.{col} = row.{col}" for col in columns])
                merge = "MERGE" if nodes[node]["merge"] else "CREATE"

                query = f"""
                UNWIND $batch AS row
                {merge} (n:{node} {{{columns[0]}: row.{columns[0]}}})
                SET {set_clause}
                """
                session.run(query, batch=batch)
                total_nodes_created += len(batch)
                processed_rows += len(batch)
                percentage = (processed_rows / total_rows) * 100
                printStatus("Exporting data to Neo4j Database", "Exporting Nodes", "in-progress", False, percentage)
        
        printStatus("Exporting data to Neo4j Database", "Exporting Nodes", "completed", True, 100)


def ExportRelationships(driver, relationships, rels_df, nodes_df, batch_size=100):
    global total_relationships_created
    total_rels_rows = sum(len(rel_df) for rel_df in rels_df.values())
    processed_rels_rows = 0

    with driver.session() as session:
        for rel in relationships:
            rel_data = rels_df[rel]
            node1 = relationships[rel]["node1"]
            node2 = relationships[rel]["node2"]
            source_attr = nodes_df[node1].instrument_name
            target_attr = nodes_df[node2].instrument_name
            rel_columns = [col for col in rel_data.columns if col not in ['SOURCE_NODE', 'TARGET_NODE']]
            for i in range(0, len(rel_data), batch_size):
                batch = rel_data.iloc[i:i + batch_size].to_dict(orient='records')
                merge = "MERGE" if relationships[rel]["merge"] else "CREATE"
                query = f"""
                UNWIND $batch AS row
                MATCH (n1:{node1} {{{source_attr}: row.SOURCE_NODE}})
                MATCH (n2:{node2} {{{target_attr}: row.TARGET_NODE}})
                {merge} (n1)-[r:{rel} {{"""
                query += ', '.join([f"{col}: row.{col}" for col in rel_columns])
                query += f"}}]->(n2)"
                session.run(query, batch=batch)
                total_relationships_created += len(batch)
                processed_rels_rows += len(batch)
                percentage = (processed_rels_rows / total_rels_rows) * 100
                printStatus("Exporting data to Neo4j Database", "Exporting Relationships", "in-progress", False, percentage)

        printStatus("Exporting data to Neo4j Database", "Exporting Relationships", "completed", True, 100)


def ExportEntities(driver, relationships, nodes_df, rels_df, batch_size):
    CreateNodeIndexes(driver, nodes_df)
    ExportNodes(driver, nodes, nodes_df, batch_size=100)
    ExportRelationships(driver, relationships, rels_df, nodes_df, batch_size=100)

if __name__ == "__main__":
    args = sys.argv[1:]
    path = args[1]

    config, data_df, driver = ETLPipeline(path)
    nodes, relationships = CheckNodesAndRelationship(config)
    nodes_df, rels_df = TransformEntities(nodes, relationships, data_df)
    ExportEntities(driver, relationships, nodes_df, rels_df, 100)
    log_final_results(True)