import { Box, Button, Divider, Flex, Input, InputGroup, InputLeftAddon, Radio, RadioGroup, Select, Text } from "@chakra-ui/react";
import { setStoreData } from "../../redux/actions/storeActions";
import { useEffect } from "react";
import { validateProperties } from "../lib/conf";
const EntitySandBox = ({ storeData, current, setCurrent, columns }) => {
    const handleEntityNameChange = (e) => {
        const value = e.target.value;
        const validNamePattern = /^[a-zA-Z0-9_]+$/;
    
        if (value === '' || validNamePattern.test(value)) {
            setCurrent((prevCurrent) => ({
                ...prevCurrent,
                name: value,
            }));
        }
    };
    
    
    const handleSetNodeIndex = (val) => {
        setCurrent((prevCurrent) => ({
            ...prevCurrent,
            index: val
        }));
    }

    const isDuplicate = (value) => {
        if(value !== ''){
            const count = Object.values(current.attributes).filter((param) => param.key === value).length;
            return count > 1;
        } else{
            return true
        }
    };

    const handleNode1Change = (e) => {
        setCurrent((prevCurrent) => ({
            ...prevCurrent,
            node1: e.target.value,
        }));
    };

    const handleNode2Change = (e) => {
        setCurrent((prevCurrent) => ({
            ...prevCurrent,
            node2: e.target.value,
        }));
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
    
    
    const addAttribute = () => {
        setCurrent((prevCurrent) => {
            const newAttributes = {
                ...prevCurrent.attributes,
                [Object.keys(prevCurrent.attributes).length]: { key: "", value: "" },
            };
            return {
                ...prevCurrent,
                attributes: newAttributes,
            };
        });
    };

    useEffect(() => {
        validateProperties(current)
    }, [current])

    const cancelSandBoxEvent = () => {
        setCurrent({})
    }
    

    const saveEntity = () => {
        const isNameValid = current.name && current.name.trim() !== '';
    
        const allAttributesValid = Object.values(current.attributes).every(param => param.value.trim() !== '');

        const allKeysValid = Object.values(current.attributes).every(param => param.key.trim() !== '');
    
        if (!isNameValid || !allAttributesValid || !allKeysValid) {
            let errorMessage = '';
            if (!isNameValid) {
                errorMessage = 'Entity Name cannot be empty. ';
            }
            if (!allAttributesValid) {
                errorMessage = 'Some attributes are not mapped. Please verify';
            }
            if (!allKeysValid){                
                errorMessage = 'Attributes name cannot be empty';
            }
            alert(errorMessage);
            return; 
        }
    
        if (current && current.type === "node") {
            const newNodeData = {
                ...current,
            };
    
            const updatedNodes = { ...storeData.nodes };
            updatedNodes[current.name] = newNodeData;
            storeData.nodes = updatedNodes;
        } else if (current && current.type === "relationships") {
            const newRelationshipData = {
                ...current,
            };
    
            const updatedRelationships = { ...storeData.relationships };
            updatedRelationships[current.name] = newRelationshipData;
            storeData.relationships = updatedRelationships;
        }
        setStoreData(storeData);
    
        setCurrent({});
    };
    

    return (
        current && (
            <Flex bg={"gray.50"} p={2} height={"60vh"}>
                <Flex bg={"white"} width={"100%"} direction={"column"}>
                    {current && current["type"] === "node" ? (
                        <Box>
                            <Flex direction={"column"} height={"90%"}>
                                <Flex p={3}>
                                    <InputGroup>
                                        <InputLeftAddon bg={"white"} border={0} width={"55px"}>
                                            <Text fontSize={'xs'}>(node)</Text>
                                        </InputLeftAddon>
                                        <Input
                                            variant={"none"}
                                            fontSize={"sm"}
                                            _placeholder={{ fontSize: "sm" }}
                                            placeholder='Entity Name'
                                            value={current.name || ""}
                                            fontWeight={"bold"}
                                            onChange={handleEntityNameChange}
                                        />
                                    </InputGroup>
                                </Flex>
                                <Divider />
                                <Box p={7} height={"38vh"} overflow={"auto"}>
                                    <Text fontSize={"sm"} fontWeight={"bold"} mb={3}>
                                        Attributes
                                    </Text>
                                    {
                                        Object.entries(current.attributes).length !== 0 ?
                                        <RadioGroup onChange={handleSetNodeIndex} value={current.index}>
                                            {
                                                Object.entries(current.attributes).map(([key, param]) => (
                                                    <Flex key={key}>
                                                        <Radio width={"7%"} value={param.key} isDisabled={isDuplicate(param.key)} />
                                                        <Input
                                                            _focus={{ boxShadow: "none", outline: "none" }}
                                                            borderRadius={0}
                                                            px={3}
                                                            width={"30%"}
                                                            size={"sm"}
                                                            value={param.key}
                                                            placeholder='params'
                                                            onChange={(e) => handleAttributeKeyChange(key, e.target.value)}
                                                        />
                                                        <Select
                                                            _focus={{ boxShadow: "none", outline: "none" }}
                                                            borderRadius={0}
                                                            px={3}
                                                            width={"63%"}
                                                            size={"sm"}
                                                            value={param.value}
                                                            onChange={(e) => handleAttributeValueChange(key, e.target.value)}
                                                            color={"gray"}
                                                        >
                                                            <option disabled value="">--- Select a field ---</option>
                                                            {columns.map((column, index) => (
                                                                <option key={index} value={column}>
                                                                    {column}
                                                                </option>
                                                            ))}
                                                        </Select>
    
                                                    </Flex>
                                                ))
                                            }
                                        </RadioGroup>
                                        : <Flex p={2} justifyContent={'center'}>
                                            <Text fontSize={'2xs'}>Click <b>Add Attribute</b> to add new attributes </Text>
                                        </Flex>
                                    }

                                </Box>
                            </Flex>
                            <Divider />
                            <Flex justifyContent={"space-between"} p={2}>
                                <Flex p={2}>
                                    <Button size={"sm"} variant={"ghost"} onClick={cancelSandBoxEvent}>
                                        <Text fontSize={"xs"}>Cancel</Text>
                                    </Button>
                                    {
                                        validateProperties(current) === true &&
                                            <Button size={"sm"} colorScheme="yellow" variant={"ghost"}>
                                                <Text fontSize={"xs"}>Potential issues Found!</Text>
                                            </Button>
                                    }
                                </Flex>
                                <Flex justifyContent={"end"} p={2} gap={3}>
                                    <Button size={"sm"} variant={"ghost"} onClick={addAttribute}>
                                        <Text fontSize={"xs"}>Add Attribute</Text>
                                    </Button>
                                    <Button size={"sm"} variant={"ghost"} onClick={saveEntity}>
                                        Save
                                    </Button>
                                </Flex>
                            </Flex>
                        </Box>
                    ) : current && current["type"] === "relationships" ? (
                        <Box>
                            <Flex direction={"column"} height={"90%"}>
                                <Flex p={3} overflow={'auto'}>
                                    <InputGroup>
                                        <InputLeftAddon bg={"white"} border={0} width={"40px"}>
                                            <Text fontSize={'xs'}>(rel)</Text>
                                        </InputLeftAddon>
                                        <Input
                                            variant={"none"}
                                            fontSize={"sm"}
                                            _placeholder={{ fontSize: "sm" }}
                                            placeholder='Entity Name'
                                            value={current.name || ""}
                                            fontWeight={"bold"}
                                            onChange={handleEntityNameChange}
                                        />
                                    </InputGroup>
                                </Flex>
                                <Divider />
                                <Flex py={3} px={3}>
                                    <Select
                                        color={"gray.500"}
                                        variant={"none"}
                                        placeholder='Select Node 1'
                                        defaultValue={current.node1 || null}
                                        fontSize={"sm"}
                                        onChange={handleNode1Change}
                                        _placeholder={{ fontSize: "sm" }}
                                    >
                                        {Object.keys(storeData.nodes).map((item, index) => (
                                            <option key={index} value={item}>
                                                {item}
                                            </option>
                                        ))}
                                    </Select>
                                    <Select
                                        color={"gray.500"}
                                        variant={"none"}
                                        placeholder='Select Node 2'
                                        defaultValue={current.node2 || null}
                                        fontSize={"sm"}
                                        onChange={handleNode2Change}
                                        _placeholder={{ fontSize: "sm" }}
                                    >
                                        {Object.keys(storeData.nodes).map((item, index) => (
                                            <option key={index} value={item}>
                                                {item}
                                            </option>
                                        ))}
                                    </Select>
                                </Flex>
                                <Divider />
                                <Box p={7} height={"34vh"} overflow={"auto"}>
                                    <Text fontSize={"sm"} fontWeight={"bold"} mb={3}>
                                        Attributes
                                    </Text>
                                    <RadioGroup onChange={handleSetNodeIndex} value={current.index}>
                                    {
                                        Object.entries(current.attributes).map(([key, param]) => (
                                            <Flex key={key}>
                                                <Radio width={"7%"} value={param.key} isDisabled={isDuplicate(param.key)} />
                                                <Input
                                                    _focus={{ boxShadow: "none", outline: "none" }}
                                                    borderRadius={0}
                                                    px={3}
                                                    width={"30%"}
                                                    size={"sm"}
                                                    value={param.key}
                                                    placeholder='params'
                                                    onChange={(e) => handleAttributeKeyChange(key, e.target.value)}
                                                />
                                                <Select
                                                    _focus={{ boxShadow: "none", outline: "none" }}
                                                    borderRadius={0}
                                                    px={3}
                                                    width={"63%"}
                                                    size={"sm"}
                                                    value={param.value}
                                                    onChange={(e) => handleAttributeValueChange(key, e.target.value)}
                                                >
                                                    <option disabled value="">--- Select a field ---</option>
                                                    {columns.map((column, index) => (
                                                        <option key={index} value={column}>
                                                            {column}
                                                        </option>
                                                    ))}
                                                </Select>
                                            </Flex>
                                        ))
                                    }
                                    </RadioGroup>

                                </Box>
                            </Flex>
                            <Divider />
                            <Flex justifyContent={"end"} p={2} gap={3}>
                                <Button size={"sm"} variant={"ghost"} onClick={addAttribute}>
                                    <Text fontSize={"xs"}>Add Attribute</Text>
                                </Button>
                                <Button size={"sm"} variant={"ghost"} onClick={saveEntity}>
                                    Save
                                </Button>
                            </Flex>
                        </Box>
                    ) : current && (
                        <Text fontSize={"xs"} m="auto">
                            Please select or create a node or relationship to edit
                        </Text>
                    )}
                </Flex>
            </Flex>
        )
    );
};

export default EntitySandBox;
