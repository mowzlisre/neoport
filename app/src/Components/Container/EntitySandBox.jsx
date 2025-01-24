import { Flex, Text } from "@chakra-ui/react";
import CytoscapeCanvas from "./CytoscapeCanvas";
import NodeEntityForm from "./EntityForm/NodeEntityForm";
import RelationshipEntityForm from "./EntityForm/RelationshipEntityForm";
import { useToast } from "@chakra-ui/react";
import { useState } from "react";
import { setStoreData } from "../../redux/actions/storeActions";

const EntitySandBox = ({ storeData, current, setCurrent, columns, openSetModal, closeModal }) => {
    const toast = useToast();
    const [indexedAttribute, setIndexedAttribute] = useState("");

    const cancelSandBoxEvent = () => {
        setCurrent({});
    };

    function removeObject(objOfObj, keyToRemove) {
        if (objOfObj.hasOwnProperty(keyToRemove)) {
            delete objOfObj[keyToRemove];
        }
        return objOfObj;
    }    

    function removeCurrentNode(type){
        const obj = removeObject(storeData[type], current.name)
        storeData[type] = obj
        setStoreData(storeData)
        closeModal()
        setCurrent({})
        window.electron.saveProject(storeData, localStorage.getItem("currentProject"))
    }

    function hasDuplicateAttributes(node) {
        const attributeKeys = Object.values(node.attributes).map(attr => attr.key);
        const uniqueKeys = new Set(attributeKeys);
        return attributeKeys.length === uniqueKeys.size;
    }
    

    const saveEntity = (key) => {
        const isNameValid = current.name && current.name.trim() !== '';
        const allAttributesValid = Object.values(current.attributes).every(param => param.value.trim() !== '');
        const allKeysValid = Object.values(current.attributes).every(param => param.key.trim() !== '');
    
        // Check if node has at least 1 attribute
        const hasAttributes = Object.keys(current.attributes).length > 0;
    
        if (!isNameValid || !allAttributesValid || !allKeysValid) {
            toast({
                title: <Text fontSize={'sm'}>Some fields are missing</Text>,
                status: "warning", duration: 3000, variant: "subtle"
            });
            return;
        }
    
        if (!hasAttributes) {
            toast({
                title: <Text fontSize={'sm'}>Node must have at least one attribute</Text>,
                status: "warning", duration: 3000, variant: "subtle"
            });
            return;
        }
    
        if (!hasDuplicateAttributes(current)) {
            toast({
                title: <Text fontSize={'sm'}>Duplicate params found</Text>,
                status: "warning", duration: 3000, variant: "subtle"
            });
            return;
        }
    
        if (current.type === "node") {
            const newNodeData = { ...current };
            const updatedNodes = { ...storeData.nodes };
            if (key !== null) {
                updatedNodes[current.name] = newNodeData;
                if (key !== current.name) {
                    delete updatedNodes[key];
                }
            } else {
                updatedNodes[current.name] = newNodeData;
            }
            storeData.nodes = updatedNodes;
        } else if (current.type === "relationships") {
            const newRelationshipData = { ...current };
            const updatedRelationships = { ...storeData.relationships };
            if (key !== null) {
                updatedRelationships[current.name] = newRelationshipData;
                if (key !== current.name) {
                    delete updatedRelationships[key];
                }
            } else {
                updatedRelationships[current.name] = newRelationshipData;
            }
            storeData.relationships = updatedRelationships;
        }
    
        setCurrent((prevCurrent) => ({ ...prevCurrent, index: [indexedAttribute] }));
    
        setStoreData(storeData);
        setCurrent({});
        window.electron.saveProject(storeData, localStorage.getItem("currentProject"));
    };
    


    return (
        current && (
            <Flex bg={"gray.50"} p={2} height={"55vh"}>
                <Flex bg={"white"} width={"100%"} direction={"column"}>
                    {current.type === "node" && (
                        <NodeEntityForm
                            current={current}
                            setCurrent={setCurrent}
                            indexedAttribute={indexedAttribute}
                            setIndexedAttribute={setIndexedAttribute}
                            columns={columns}
                            saveEntity={saveEntity}
                            cancelSandBoxEvent={cancelSandBoxEvent}
                            {...{openSetModal, closeModal, removeCurrentNode, storeData}}
                        />
                    )}
                    {current.type === "relationships" && (
                        <RelationshipEntityForm
                            current={current}
                            setCurrent={setCurrent}
                            storeData={storeData}
                            columns={columns}
                            saveEntity={saveEntity}
                            cancelSandBoxEvent={cancelSandBoxEvent}
                            {...{openSetModal, closeModal, removeCurrentNode}}
                        />
                    )}
                    {!current.type && <CytoscapeCanvas projectData={storeData} />}
                </Flex>
            </Flex>
        )
    );
};

export default EntitySandBox;
