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

export const generateCypherQuery = (config) => {
    const { nodes, relationships } = config;
    let cypherScript = '';
    
    cypherScript += createIndexes(nodes);
    
    return cypherScript;
}
