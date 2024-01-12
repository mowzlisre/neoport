import { Flex, VStack, Box, Text, Image, Button } from "@chakra-ui/react"
import { useDispatch, useSelector } from 'react-redux';
import logo from "../../logo.png";
import {
    Table,
    Tbody,
    Thead,
    Tr,
    Th,
    Td, Select, Tooltip, useToast, 
    TableContainer, HStack, Tag, TagLabel, TagCloseButton
} from '@chakra-ui/react'
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { setCSVData } from "../../redux/actions/csvActions";
import { filterArraysByDataType } from "../lib/conf";
import { MdInfo } from "react-icons/md";
function Analyse() {
    const csvData = useSelector((state) => state.csvData)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const toast = useToast();
    const [columns, setColumns] = useState([])
    const [columnType, setColumnType] = useState([]);

    
      
    function handleCSVData(data){
        let filteredData = {}
        filteredData["csvData"] = filterArraysByDataType(data, setColumnType)
        filteredData["fileName"] = csvData.fileName
        filteredData["fileSize"] = csvData.fileSize
        console.log(csvData)
        setColumns(data[0])
        dispatch(setCSVData(filteredData));
    }

    useEffect(() => {
        async function fetchData() {
            try {
                // Check if csvData.csvData is null before calling handleCSVData
                if (csvData.csvData !== null) {
                    handleCSVData(csvData.csvData);
                }
                else{
                    toast({
                        description: "An error occured!",
                        status: 'error',
                        duration: 3000,
                    })
                    navigate('/upload')
                }
            } catch (error) {
            }
        }
    
        fetchData();
    }, [csvData, navigate]);
    

    const handleColumnTypeChange = (e, columnIndex) => {
        const newColumnType = [...columnType];
        newColumnType[columnIndex] = e.target.value;
        setColumnType(newColumnType);
    };

    const NTooltip = (data) => (
        <Box>
            <div>
                <div>This field has a mixed data type</div>
                <Box my={1}>
                {
                    data.dataTypeCounts.integer !== 0 && <Flex gap={1}>
                    <b>Integer*</b> <a>{data.dataTypeCounts.integer}</a>
                    </Flex>
                }
                {
                    data.dataTypeCounts.float !== 0 && <Flex gap={1}>
                    <b>Float*</b> <a>{data.dataTypeCounts.float}</a>
                    </Flex>
                }
                {
                    data.dataTypeCounts.string !== 0 && <Flex gap={1}>
                    <b>String*</b> <a>{data.dataTypeCounts.string}</a>
                    </Flex>
                }
                {
                    data.dataTypeCounts.boolean !== 0 && <Flex gap={1}>
                    <b>Boolean*</b> <a>{data.dataTypeCounts.boolean}</a>
                    </Flex>
                }
                </Box>
                <div>Please select a different data type, to standardize the data</div>
            </div>
        </Box>
      );
    
    return (
        <>
            <Flex mt={15} mb={50}>
                <VStack m={'auto'} justifyContent={'center'} gap={5} >
                    <Image src={logo} boxSize='100px' alt='logo' borderRadius={"20px"} />
                    <Box p={10} boxShadow={"md"} borderRadius={10} minW={"800px"}>
                        <Text fontSize={'sm'} fontWeight={'bold'}>Fields ({columns.length})</Text>
                        <HStack mt={2}>
                            {
                                columns.map((item, index) => (
                                    <Tag px={4} key={index} >       
                                        <TagLabel fontSize={11}>{item}</TagLabel>
                                    </Tag>
                                ))
                            }
                        </HStack>
                    </Box>
                    <Box p={10} boxShadow={"md"} borderRadius={10} minW={"800px"}>
                        <Text fontSize={'sm'} fontWeight={'bold'}>Fields and Types</Text>
                        <HStack mt={2}>
                        <TableContainer width={"700px"} height={"400px"} overflow={'auto'}>
                            <Table variant='striped' size={'sm'}>
                                <Thead>
                                <Tr>
                                    <Th></Th>
                                    {
                                        columns.map((item, columnIndex) => (
                                            <Tooltip
                                            hasArrow
                                            key={columnIndex}
                                            label={<NTooltip {...columnType[columnIndex]}/>}
                                            placement={"top"}
                                            p={3}
                                            fontSize={'xs'}
                                            borderRadius={5}
                                            isDisabled={columnType[columnIndex].abs}
                                            >
                                                <Th py={3} role="button" minWidth={170} key={columnIndex} bg={columnType[columnIndex].abs !== true ? "aliceblue" : "white"}>
                                                    <Text fontSize={13}>{item}</Text>
                                                    <Flex gap={2}>
                                                    <Select
                                                        bg={"white"}
                                                        size={'xs'}
                                                        my={1}
                                                        rounded={5}
                                                        value={(columnType[columnIndex].maxDataType)}
                                                        onChange={(e) => handleColumnTypeChange(e, columnIndex)}
                                                    >
                                                        <option value='string'>string</option>
                                                        <option value='integer'>integer</option>
                                                        <option value='float'>float</option>
                                                        <option value='boolean'>boolean</option>
                                                    </Select>
                                                    {columnType[columnIndex].abs !== true && <Box my={'auto'}><MdInfo fontSize={16} /></Box>}
                                                    </Flex>
                                                </Th>
                                            </Tooltip>
                                        ))
                                    }
                                </Tr>
                                </Thead>
                                <Tbody>
                                {
                                    csvData && csvData.csvData && csvData.csvData.length > 1 ? (
                                        csvData.csvData.slice(1, 11).map((item, index) => (
                                            <Tr key={index}>
                                                <Td color={"gray"} fontSize={'xs'}>{index + 1}</Td>
                                                {item.map((item_, index_) => (
                                                    <Td
                                                        key={index_}
                                                        fontSize={'xs'}
                                                        bg={columnType[index_] && columnType[index_].abs !== true ? "aliceblue" : "white"}
                                                    >
                                                        {item_ === true ? (
                                                            <b style={{ color: "gray" }}>true</b>
                                                        ) : item_ === false ? (
                                                            <b style={{ color: "gray" }}>false</b>
                                                        ) : (
                                                            item_
                                                        )}
                                                    </Td>
                                                ))}
                                            </Tr>
                                        ))
                                    ) : (
                                        // Render something else or handle the case when csvData is null
                                        <tr>
                                            <td >No data available</td>
                                        </tr>
                                    )
                                }

                                </Tbody>
                            </Table>
                        </TableContainer>
                        </HStack>
                        <Flex justifyContent={'end'} p={5} gap={3}>
                            <Button size={'sm'} onClick={() => navigate('/upload')}>Cancel</Button>
                            <Button size={'sm'} colorScheme="blue">Import</Button>
                        </Flex>
                    </Box>
                </VStack>
            </Flex>
        </>
    )
}

export default Analyse;
