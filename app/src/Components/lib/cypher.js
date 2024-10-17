const createIndexes = (nodes) => {
    let cypherScript = '';
    for(const nodeName in nodes){
        const node = nodes[nodeName];
        if (node.index && node.index.length > 0){
            node.index.forEach(element => {
                cypherScript += `CREATE INDEX ${node.name}_index IF NOT EXISTS FOR (n:${node.name}) ON (n.${node.attributes[element].key});\n`;
            });
        }
    }
    return cypherScript;
}

const createNodeQueries = (data) => {
    let cypherScript = '';
    let i = 0
    for (const nodeKey in data.nodes) {
        const node = data.nodes[nodeKey];
        data.csvData.forEach((entry) => {
            const nodeLabel = node.name;
            const nodeAttributes = node.attributes;
            const merge = node.merge;

            let query = merge ? `MERGE (` : `CREATE (`;
            query += `n${i}:${nodeLabel} {`;
            i += 1
            const properties = Object.keys(nodeAttributes).map((attrKey) => {
                const key = nodeAttributes[attrKey].key;
                const value = JSON.stringify(entry[key]);
                return `${key}: ${value}`;
            });

            query += properties.join(", ") + "})\n";
            cypherScript += query
        });
    }
    return cypherScript
    
}

const createRelationshipQueries = (data) => {
    for (const relKey in data.relationships) {
        let cypherScript = '';
        const rel = data.relationships[relKey];
        const node1 = data.nodes[rel.node1].name;
        const node2 = data.nodes[rel.node2].name;
        const relType = rel.name;
        const merge = rel.merge;

        data.csvData.forEach((entry) => {
            const node1Value = JSON.stringify(entry[data.nodes[rel.node1].attributes[0].key]);
            const node2Value = JSON.stringify(entry[data.nodes[rel.node2].attributes[0].key]);

            let cypherQuery = merge ? `MERGE (` : `CREATE (`;
            cypherQuery += `${node1}:${node1} {Rank: ${node1Value}})-[:${relType}]->(${node2}:${node2} {Rank: ${node2Value}})`;
            cypherScript += (cypherQuery + '\n')
        });

    }
}


export const generateCypherQuery = (config) => {
    const { nodes } = config;
    let cypherScript = '';
    
    cypherScript += createIndexes(nodes)
    cypherScript += createNodeQueries(config)
    // cypherScript += createRelationshipQueries(config)

    return cypherScript;
}
