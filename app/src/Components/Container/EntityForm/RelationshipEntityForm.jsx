import { Box, Button, Checkbox, Divider, Flex, Input, InputGroup, InputLeftAddon, Select, Text, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { IoTrashOutline } from "react-icons/io5";
import { MdArrowRightAlt } from "react-icons/md";
import { TbCirclesRelation } from "react-icons/tb";

const RelationshipEntityForm = ({ current, setCurrent, storeData, columns, saveEntity, cancelSandBoxEvent, openSetModal, closeModal, removeCurrentNode }) => {
    const toast = useToast();
    const [key, setKey] = useState(null)

    
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


    const handleRelationshipAttributeDelete = (key) => {
        const updatedAttributes = { ...current.attributes };
        delete updatedAttributes[key];
        const updatedCurrent = { ...current, attributes: updatedAttributes };
        setCurrent(updatedCurrent);
    }


    const RelationshipDelete = () => {
        return (
            <>
                <Text fontSize={'sm'}>Do you want to delete the Relationship. This action will delete the relationship along with its properties. </Text>
                <Flex width={"100%"} justifyContent={'end'} mt={5} gap={2}>
                    <Button size={'sm'} colorScheme="red" onClick={() => removeCurrentNode("relationships")}>Delete</Button>
                    <Button size={'sm'} onClick={closeModal}>Close</Button>
                </Flex>
            </>
        )
    }
    
    const handleSave = (key) => {
        if (!current.node1 || !current.node2) {
            toast({
                title: "Both Node 1 and Node 2 must be selected.",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            return;
        }
        saveEntity(key);
    };


    return (
        <Box height="100%">
    <Flex direction="column" height="100%">
        <Flex p={3}>
            <InputGroup>
                <InputLeftAddon bg="white" border={0} width="40px">
                    <Text fontSize='xs'><TbCirclesRelation fontSize={23} /></Text>
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
                <Text fontSize="small">Merge Nodes (Use to avoid duplicate relationships)</Text>
            </Checkbox>
        </Flex>
        <Divider />
        <Box flex="1" overflowY="auto">
            <Flex p={2} gap={2}>
                <Select
                    value={current.node1 || ""}
                    fontSize="sm"
                    size="sm"
                    onChange={(e) => setCurrent(prevCurrent => ({
                        ...prevCurrent,
                        node1: e.target.value,
                    }))}
                >
                    <option disabled value="">--- Select a field ---</option>
                    {Object.keys(storeData.nodes).map((item, index) => (
                        <option key={index} value={item}>
                            {item}
                        </option>
                    ))}
                </Select>
                <Flex>
                    <Text m="auto">
                        <MdArrowRightAlt />
                    </Text>
                </Flex>
                <Select
                    value={current.node2 || ""}
                    fontSize="sm"
                    size="sm"
                    onChange={(e) => setCurrent(prevCurrent => ({
                        ...prevCurrent,
                        node2: e.target.value,
                    }))}
                >
                    <option disabled value="">--- Select a field ---</option>
                    {Object.keys(storeData.nodes).map((item, index) => (
                        <option key={index} value={item}>
                            {item}
                        </option>
                    ))}
                </Select>
            </Flex>
            <Divider />
            <Box px={5} py={4}>
                <Text fontSize="sm" fontWeight="bold" mb={3}>
                    Attributes
                </Text>
                {Object.entries(current.attributes).map(([key, param]) => (
                    <Flex key={key} gap={2} mb={2}>
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
                            <option disabled value="">--- Select a field ---</option>
                            {columns.map((column, index) => (
                                <option key={index} value={column}>
                                    {column}
                                </option>
                            ))}
                        </Select>
                        <Flex px={2} cursor="pointer" onClick={() => handleRelationshipAttributeDelete(key)}>
                            <Text m="auto">
                                <IoTrashOutline fontSize={20} />
                            </Text>
                        </Flex>
                    </Flex>
                ))}
            </Box>
        </Box>
        <Divider />
        <Flex justifyContent="space-between" p={2} height="50px" flexShrink={0} bg="white"> {/* Fixed footer */}
            <Button size="sm" variant="ghost" onClick={cancelSandBoxEvent}>
                <Text fontSize="xs">Cancel</Text>
            </Button>
            <Flex gap={2}>
                {current.name !== null && (
                    <Button size="sm" variant="ghost" onClick={() => openSetModal(RelationshipDelete, "sm")} colorScheme="red">
                        <Text fontSize="xs">Delete Relationship</Text>
                    </Button>
                )}
                <Button size="sm" variant="ghost" onClick={addAttribute}>
                    <Text fontSize="xs">Add Attribute</Text>
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleSave(key)}>
                    <Text fontSize="xs">Save</Text>
                </Button>
            </Flex>
        </Flex>
    </Flex>
</Box>

    );
};

export default RelationshipEntityForm;
