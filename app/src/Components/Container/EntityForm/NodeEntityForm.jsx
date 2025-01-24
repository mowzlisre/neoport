import { Box, Button, Checkbox, Divider, Flex, Input, InputGroup, InputLeftAddon, Radio, RadioGroup, Select, Text, useToast } from "@chakra-ui/react";
import { PiBracketsRoundDuotone } from "react-icons/pi";
import { MdArrowRightAlt } from "react-icons/md";
import { useEffect, useState } from "react";
import { checkNodeInRelationships } from "../../lib/analyse";
import { IoTrashOutline } from "react-icons/io5";

const NodeEntityForm = ({ current, setCurrent, columns, saveEntity, cancelSandBoxEvent, openSetModal, closeModal, removeCurrentNode, storeData}) => {

    const [key, setKey] = useState(null)
    const toast = useToast()
    const [indexedAttribute, setIndexedAttribute] = useState(current.index || [])
    
    useEffect(() => {
        setKey(current.name)
    }, [])

    const handleEntityNameChange = (e) => {
        const value = e.target.value.trim();
        const validNamePattern = /^[a-zA-Z0-9_]+$/;
        if (value.trim() === '' || validNamePattern.test(value)) {
            setCurrent((prevCurrent) => ({
                ...prevCurrent,
                name: value,
            }));
        }
    };

    const handleMergeToggle = (e) => {
        setCurrent((prevCurrent) => ({
            ...prevCurrent,
            merge : e.target.checked
        }))
    }

    const handleSetNodeIndex = (value) => {
        setIndexedAttribute(value);
        setCurrent((prevCurrent) => ({
            ...prevCurrent,
            index: [value]
        }));
    };

    const addAttribute = () => {
        setCurrent((prevCurrent) => {
            let index = indexedAttribute[0]
            if(Object.keys(current.attributes).length === 0){
                index = "0"
            } 
            const newAttributes = {
                ...prevCurrent.attributes,
                [Object.keys(prevCurrent.attributes).length]: { key: "", value: "" },
            };
            return {
                ...prevCurrent,
                attributes: newAttributes,
                index: [index]
            };
        });
    };

    const handleAttributeKeyChange = (key, newValue) => {
        const validKeyPattern = /^[a-zA-Z0-9_]+$/;
        if (newValue === '' || validKeyPattern.test(newValue)) {
            setCurrent((prevCurrent) => {
                const updatedAttributes = {
                    ...prevCurrent.attributes,
                    [key]: { ...prevCurrent.attributes[key], key: newValue },
                };
                return {
                    ...prevCurrent,
                    attributes: updatedAttributes,
                };
            });
        }
    };

    const handleAttributeValueChange = (key, newValue) => {
        setCurrent((prevCurrent) => {
            const updatedAttributes = {
                ...prevCurrent.attributes,
                [key]: { ...prevCurrent.attributes[key], value: newValue },
            };
            return {
                ...prevCurrent,
                attributes: updatedAttributes,
            };
        });
    };

    const handleNodeAttributeDelete = (key) => {
        const updatedAttributes = { ...current.attributes };
        delete updatedAttributes[key];
        const updatedIndex = current.index.includes(key) ? [] : current.index;
    
        const updatedCurrent = { 
            ...current, 
            attributes: updatedAttributes, 
            index: updatedIndex
        };
        
        setCurrent(updatedCurrent);
    };
    

    const NodeDeleteWarningModal = () => {
        return (
            <>
                <Text fontSize={'sm'}>Do you want to delete the Node. This action will delete the node along with its properties. </Text>
                <Flex width={"100%"} justifyContent={'end'} mt={5} gap={2}>
                    <Button size={'sm'} colorScheme="red" onClick={() => removeCurrentNode("nodes")}>Delete</Button>
                    <Button size={'sm'} onClick={closeModal}>Close</Button>
                </Flex>
            </>
        )
    }

    const NodeDelete = () => {
        if(checkNodeInRelationships(storeData.relationships, current.name) === true){
            toast({
                title: <Text fontSize={'sm'}>Cannot delete nodes with relationships</Text>,
                status: "warning", duration: 3000, variant: "subtle"
            });
        } else{
            openSetModal(NodeDeleteWarningModal, "sm")
        }
    }

    return (
        <Box height="100%">
            <Flex direction="column" height="100%">
                <Flex p={3}>
                    <InputGroup>
                        <InputLeftAddon bg="white" border={0} width="40px">
                            <Text fontSize='xs'><PiBracketsRoundDuotone fontSize={23} /></Text>
                        </InputLeftAddon>
                        <Input
                            variant="none"
                            fontSize="sm"
                            placeholder="Entity Name"
                            value={current.name || ""}
                            fontWeight="bold"
                            onChange={handleEntityNameChange}
                        />
                    </InputGroup>
                </Flex>
                <Divider />
                <Flex px={5} py={3}>
                    <Checkbox isChecked={current.merge} onChange={handleMergeToggle}>
                        <Text fontSize="small">Merge Nodes (Use if node is category or collection)</Text>
                    </Checkbox>
                </Flex>
                <Divider />
                <Box p={5} flex="1" overflowY="auto"> 
                    <Text fontSize="sm" fontWeight="bold" mb={3}>
                        Attributes
                    </Text>
                    {Object.entries(current.attributes).length !== 0 ? (
                        <RadioGroup value={indexedAttribute[0]} onChange={handleSetNodeIndex}>
                            {Object.entries(current.attributes).map(([key, param]) => (
                                <Flex key={key} gap={2} mb={2}>
                                    <Radio value={key} isChecked={indexedAttribute[0] === parseInt(key)} />
                                    <Input
                                        size="sm"
                                        value={param.key}
                                        placeholder="params"
                                        onChange={(e) => handleAttributeKeyChange(key, e.target.value.trim())}
                                    />
                                    <Flex>
                                        <Text m="auto">
                                            <MdArrowRightAlt />
                                        </Text>
                                    </Flex>
                                    <Select
                                        size="sm"
                                        value={param.value}
                                        onChange={(e) => handleAttributeValueChange(key, e.target.value)}
                                    >
                                        <option disabled value="">
                                            --- Select a field ---
                                        </option>
                                        {columns.map((column, index) => (
                                            <option key={index} value={column}>
                                                {column}
                                            </option>
                                        ))}
                                    </Select>
                                    <Flex px={2} cursor="pointer" onClick={() => handleNodeAttributeDelete(key)}>
                                        <Text m="auto">
                                            <IoTrashOutline fontSize={20} />
                                        </Text>
                                    </Flex>
                                </Flex>
                            ))}
                        </RadioGroup>
                    ) : (
                        <Flex p={2} justifyContent="center">
                            <Text fontSize="2xs">Click <b>Add Attribute</b> to add new attributes</Text>
                        </Flex>
                    )}
                </Box>
                <Divider />
                <Flex justifyContent="space-between" p={2} height="50px" flexShrink={0} bg="white"> {/* Fixed footer */}
                    <Button size="sm" variant="ghost" onClick={cancelSandBoxEvent}>
                        <Text fontSize="xs">Cancel</Text>
                    </Button>
                    <Flex gap={2}>
                        {current.name !== null && (
                            <Button size="sm" variant="ghost" onClick={NodeDelete} colorScheme="red">
                                <Text fontSize="xs">Delete Node</Text>
                            </Button>
                        )}
                        <Button size="sm" variant="ghost" onClick={addAttribute}>
                            <Text fontSize="xs">Add Attribute</Text>
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => saveEntity(key)}>
                            <Text fontSize="xs">Save</Text>
                        </Button>
                    </Flex>
                </Flex>
            </Flex>
        </Box>
    );
};

export default NodeEntityForm;
