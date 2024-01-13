import { Flex, VStack, Box, Text, Image, Button, Spinner } from "@chakra-ui/react"
import { useDispatch, useSelector } from 'react-redux';
import logo from "../../logo.png";
import {
    Table,
    Tbody,
    Thead,
    Tr,
    Th,
    Td, Select, Tooltip, useToast,
    TableContainer, HStack, Tag, TagLabel
} from '@chakra-ui/react'
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { setStoreData } from "../../redux/actions/storeActions";
import { filterObjectsByDataType } from "../lib/conf";
import { MdInfo } from "react-icons/md";
function Analyse() {
    const storeData = useSelector((state) => state.csvData)
    const [isLoading, setIsLoading] = useState(false)
    const [isParsed, setIsParsed] = useState(false)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const toast = useToast();
    const [columns, setColumns] = useState([])
    const [status, setStatus] = useState('')

    const handleColumnTypeChange = (e, columnIndex) => {
        if (storeData.dataTypes) {
          const newColumnType = [...storeData.dataTypes];
          newColumnType[columnIndex] = e.target.value;
          storeData["columnType"] = newColumnType;
          dispatch(setStoreData(storeData));
        }
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


    const handleBack = () => {
        // dispatch(setCSVData({csvData: {}, fileName: null, fileSize: null}));
        navigate('/upload')
    }

    const handleFileParse = () => {
        window.electron
          .readFile(storeData.filePath, storeData.headers)
          .then((data) => {
            setColumns(data.headers);
            storeData["csvData"] = data.data;
            storeData["dataTypes"] = data.columnType;
            dispatch(setStoreData(storeData));
          })
          .catch((err) => {
            console.error('Error reading file:', err);
          });
    };

    async function setStatusWithDelay(status, delay) {
        setStatus(status);
        await new Promise(resolve => setTimeout(resolve, delay));
    }

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
    
            try {
                await setStatusWithDelay("Reading file ...", 1000);
    
                if (storeData.filePath !== null) {
                    handleFileParse();
                } else {
                    toast({
                        title: <Text fontSize={'sm'}>File not found</Text>,
                        status: "error",
                        duration: 3000,
                        variant: "subtle"
                    });
                    navigate('/upload');
                    return; 
                }
                await setStatusWithDelay("Skipping empty lines ...", 1000);
                await setStatusWithDelay("Identifying data types ...", 1000);
                await setStatusWithDelay("Transforming data types ...", 1000);
    
                setIsParsed(true);
                setIsLoading(false);
            
    
            } catch (error) {
                console.error("Error:", error);
            } 
        };
    
        fetchData();
    }, []); // No need for dependencies
    


    const StatusComponent = ({ status }) => {
        return (
            <Text my={'auto'} fontSize={'sm'} className={`fade-in ${status !== '' ? 'show' : ''}`}>{status}</Text>
        )
    }  
    return (
        isParsed ?
            <>
            <Flex mt={15} mb={50} className="fade-in">
                <VStack m={'auto'} justifyContent={'center'} gap={5}>
                    <Image src={logo} boxSize='100px' alt='logo' borderRadius={"20px"} />
                    <Box p={10} boxShadow={"md"} borderRadius={10}>
                        <Box width={"600px"}>
                            <Text fontSize={'sm'} fontWeight={'bold'}>Fields ({columns.length})</Text>
                            <Box mt={2} >
                                {
                                    columns.map((item, index) => (
                                        <Tag px={4} key={index} m={1}>
                                            <TagLabel fontSize={11}>{item}</TagLabel>
                                        </Tag>
                                    ))
                                }
                            </Box>
                        </Box>
                    </Box>
                    <Box p={10} boxShadow={"md"} borderRadius={10}>
                        <Text fontSize={'sm'} fontWeight={'bold'}>Fields and Types ({storeData && storeData.length > 1 ? storeData.length : 0})</Text>
                        <HStack mt={2}>
                            <TableContainer width={"600px"} height={"400px"} overflow={'auto'}>
                                <Table variant='striped' size={'sm'}>
                                    <Thead>
                                        <Tr>
                                            <Th></Th>
                                            {
                                                columns.length !== 0 &&
                                                columns.map((item, columnIndex) => (
                                                    <Tooltip
                                                        hasArrow
                                                        key={columnIndex}
                                                        label={<NTooltip {...storeData.dataTypes[columnIndex]} />}
                                                        placement={"top"}
                                                        p={3}
                                                        fontSize={'xs'}
                                                        borderRadius={5}
                                                        isDisabled={!storeData.dataTypes[columnIndex].abs}
                                                    >
                                                        <Th py={3} role="button" minWidth={170} key={columnIndex} bg={storeData.dataTypes[columnIndex].abs === true ? "aliceblue" : "white"}>
                                                            <Text fontSize={13}>{item}</Text>
                                                            <Flex gap={2}>
                                                                <Select
                                                                    bg={"white"}
                                                                    size={'xs'}
                                                                    my={1}
                                                                    rounded={5}
                                                                    value={storeData.dataTypes[columnIndex].maxDataType}
                                                                    onChange={handleColumnTypeChange}
                                                                >
                                                                    <option value='string'>string</option>
                                                                    <option value='integer'>integer</option>
                                                                    <option value='float'>float</option>
                                                                    <option value='boolean'>boolean</option>
                                                                </Select>
                                                                {storeData.dataTypes[columnIndex].abs === true && <Box my={'auto'}><MdInfo fontSize={16} /></Box>}
                                                            </Flex>
                                                        </Th>
                                                    </Tooltip>
                                                ))
                                            }
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {
                                            storeData.csvData.length > 0 ? (
                                                storeData.csvData.map((item, index) => (
                                                    <Tr key={index}>
                                                        <Td color={"gray"} fontSize={'xs'}>{index + 1}</Td>
                                                        {Object.values(item).map((item_, index_) => (
                                                            <Td
                                                                key={index_}
                                                                fontSize={'xs'}
                                                                bg={storeData.dataTypes[index_] && storeData.dataTypes[index_].abs === true ? "aliceblue" : "white"}
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
                            <Button size={'sm'} onClick={() => handleBack()}>Cancel</Button>
                            <Button size={'sm'} colorScheme="blue">Import</Button>
                        </Flex>
                    </Box>
                </VStack>
            </Flex>
            </>
            : <>
                <Flex height={"100vh"} className="fade-in" mt={15} mb={50}>
                    <VStack m={'auto'} justifyContent={'center'} gap={5} >
                        <Image src={logo} boxSize='100px' alt='logo' borderRadius={"20px"} />
                        <Box p={10} boxShadow={"md"} borderRadius={10} minW={"300px"}>
                            {
                                isLoading &&
                                <Flex gap={3} justifyContent={'center'}>
                                    <Spinner thickness='4px' my={'auto'} />
                                    <StatusComponent status={status} />
                                </Flex>
                            }
                        </Box>
                        <Flex ml={'auto'} mr={0}>
                            <Button size={'xs'} onClick={() => handleBack()}>Cancel</Button>
                        </Flex>
                    </VStack>
                </Flex>
            </>
    )
}

export default Analyse;
