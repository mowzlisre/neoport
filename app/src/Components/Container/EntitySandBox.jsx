import { Box, Button, Divider, Flex, Input, InputGroup, InputLeftAddon, Select, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { setStoreData } from "../../redux/actions/storeActions";

const EntitySandBox = ({ storeData, current, setCurrent }) => {
    const handleEntityNameChange = (e) => {
        setCurrent((prevCurrent) => ({
            ...prevCurrent,
            name: e.target.value,
        }));
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

    const handleParameterKeyChange = (key, newValue) => {
        setCurrent((prevCurrent) => {
            const updatedParameters = {
                ...prevCurrent.parameters,
                [key]: { ...prevCurrent.parameters[key], key: newValue },
            };
            return {
                ...prevCurrent,
                parameters: updatedParameters,
            };
        });
    };
    
    const handleParameterValueChange = (key, newValue) => {
        setCurrent((prevCurrent) => {
            const updatedParameters = {
                ...prevCurrent.parameters,
                [key]: { ...prevCurrent.parameters[key], value: newValue },
            };
            return {
                ...prevCurrent,
                parameters: updatedParameters,
            };
        });
    };
    
    const addParameter = () => {
        setCurrent((prevCurrent) => {
            const newParameters = {
                ...prevCurrent.parameters,
                [Object.keys(prevCurrent.parameters).length]: { key: "", value: "" },
            };
            return {
                ...prevCurrent,
                parameters: newParameters,
            };
        });
    };

    
    const saveEntity = () => {
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
        setStoreData(storeData)
    
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
                                        Parameters
                                    </Text>
                                    {Object.keys(current.parameters).length > 0 ? (
                                        Object.entries(current.parameters).map(([key, param]) => (
                                            <Flex key={key}>
                                                <Input
                                                    _focus={{ boxShadow: "none", outline: "none" }}
                                                    borderRadius={0}
                                                    px={3}
                                                    width={"30%"}
                                                    size={"sm"}
                                                    value={param.key}
                                                    placeholder='params'
                                                    onChange={(e) => handleParameterKeyChange(key, e.target.value)}
                                                />
                                                <Input
                                                    _focus={{ boxShadow: "none", outline: "none" }}
                                                    borderRadius={0}
                                                    px={3}
                                                    width={"70%"}
                                                    size={"sm"}
                                                    value={param.value}
                                                    placeholder='value'
                                                    onChange={(e) => handleParameterValueChange(key, e.target.value)}
                                                />
                                            </Flex>
                                        ))
                                    ) : (
                                        <Flex>
                                            <Input
                                                _focus={{ boxShadow: "none", outline: "none" }}
                                                borderRadius={0}
                                                px={3}
                                                width={"30%"}
                                                size={"sm"}
                                                placeholder='params'
                                                onChange={(e) => handleParameterKeyChange(0, e.target.value)}
                                            />
                                            <Input
                                                _focus={{ boxShadow: "none", outline: "none" }}
                                                borderRadius={0}
                                                px={3}
                                                width={"70%"}
                                                size={"sm"}
                                                placeholder='value'
                                                onChange={(e) => handleParameterValueChange(0, e.target.value)}
                                            />
                                        </Flex>
                                    )}

                                </Box>
                            </Flex>
                            <Divider />
                            <Flex justifyContent={"end"} p={2}>
                                <Flex justifyContent={"end"} p={2} gap={3}>
                                    <Button size={"sm"} variant={"ghost"} onClick={addParameter}>
                                        <Text fontSize={"xs"}>Add Parameter</Text>
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
                                        Parameters
                                    </Text>
                                    {Object.keys(current.parameters).length > 0 ? (
                                        Object.entries(current.parameters).map(([key, param]) => (
                                            <Flex key={key}>
                                                <Input
                                                    _focus={{ boxShadow: "none", outline: "none" }}
                                                    borderRadius={0}
                                                    px={3}
                                                    width={"30%"}
                                                    size={"sm"}
                                                    value={param.key}
                                                    placeholder='params'
                                                    onChange={(e) => handleParameterKeyChange(key, e.target.value)}
                                                />
                                                <Input
                                                    _focus={{ boxShadow: "none", outline: "none" }}
                                                    borderRadius={0}
                                                    px={3}
                                                    width={"70%"}
                                                    size={"sm"}
                                                    value={param.value}
                                                    placeholder='value'
                                                    onChange={(e) => handleParameterValueChange(key, e.target.value)}
                                                />
                                            </Flex>
                                        ))
                                    ) : (
                                        <Flex>
                                            <Input
                                                _focus={{ boxShadow: "none", outline: "none" }}
                                                borderRadius={0}
                                                px={3}
                                                width={"30%"}
                                                size={"sm"}
                                                placeholder='params'
                                                onChange={(e) => handleParameterKeyChange(0, e.target.value)}
                                            />
                                            <Input
                                                _focus={{ boxShadow: "none", outline: "none" }}
                                                borderRadius={0}
                                                px={3}
                                                width={"70%"}
                                                size={"sm"}
                                                placeholder='value'
                                                onChange={(e) => handleParameterValueChange(0, e.target.value)}
                                            />
                                        </Flex>
                                    )}

                                </Box>
                            </Flex>
                            <Divider />
                            <Flex justifyContent={"end"} p={2} gap={3}>
                                <Button size={"sm"} variant={"ghost"} onClick={addParameter}>
                                    <Text fontSize={"xs"}>Add Parameter</Text>
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
