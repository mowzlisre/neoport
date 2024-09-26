import { Box } from '@chakra-ui/react';
import React, { useRef } from 'react';
import Cytoscape from 'react-cytoscapejs';
import { MdZoomInMap } from "react-icons/md";
const CytoscapeCanvas = ({projectData}) => {
    const cyRef = useRef(null);

    const nodes = Object.keys(projectData.nodes).map((nodeKey) => ({
        data: { id: nodeKey, label: projectData.nodes[nodeKey].name },
    }));

    const edges = Object.keys(projectData.relationships).map((relKey) => ({
        data: {
            source: projectData.relationships[relKey].node1,
            target: projectData.relationships[relKey].node2,
            label: projectData.relationships[relKey].name,
        },
    }));


    const elements = [...nodes, ...edges]

    const resetViewport = () => {
        if (cyRef.current) {
            cyRef.current.fit(cyRef.current.elements(), 100, {
                animate: true,  
                duration: 1000,   
            });
        }
      };
    return (
        projectData.nodes.length !== 0 &&
        <div style={{ width: '100%', height: "100%", position: 'relative', backgroundColor: "white", backgroundImage: "radial-gradient(circle, #e3e3e3 1px, transparent 1px)", backgroundSize: "20px 20px" }} >
            <Box position={'absolute'} top={5} right={5} zIndex={999} cursor={'pointer'} onClick={() => resetViewport()}><MdZoomInMap color='gray'/></Box>    
            <Cytoscape
                elements={elements}
                style={{ width: '100%', height: '100%' }}
                layout={{
                    name: 'grid',
                    animate: true,  
                  }}
                cy={(cy) => {
                    cyRef.current = cy;
                  }}
                stylesheet={[
                    {
                        selector: 'node',
                        style: {
                            'background-color': '#6FB1FC',
                            label: 'data(label)',
                            'text-valign': 'center',
                            'text-halign': 'center',
                            'font-size': '8px',
                            color: '#fff',
                            'overlay-opacity': 0,
                        }
                    },
                    {
                        selector: 'edge',
                        style: {
                            'width': 1,
                            'line-color': '#ccc',
                            "curve-style": "bezier",
                            'target-arrow-shape': 'triangle', // Define the shape of the arrow
                            'target-arrow-color': '#ccc', // Set the arrow color
                            label: 'data(label)', 
                            'font-size': '10px', 
                            'text-rotation': 'autorotate',
                            'color': '#555', 
                            'text-background-opacity': 1, 
                            'text-background-color': '#ffffff',
                            'text-background-shape': 'roundrectangle', 
                            'text-background-padding': '3px', 
                            'overlay-opacity': 0
                        }
                    },
                ]}
            />
        </div>
    );
};

export default CytoscapeCanvas;
