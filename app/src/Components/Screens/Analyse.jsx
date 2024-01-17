import { Flex, VStack, Box, Text, Image, Button, Spinner, Card, Divider, Center } from "@chakra-ui/react"
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
import { checkForAbsolute} from "../lib/conf";
import { FcDeleteDatabase } from "react-icons/fc";
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

    function secondsToTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const minutesStr = minutes < 10 ? `0${minutes}` : minutes.toString();
        const secondsStr = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds.toString();
        return `${minutesStr}m ${secondsStr}s`;
    }

    const handleColumnTypeChange = (e, columnIndex) => {
        if (storeData.dataTypes) {
            const newColumnType = [...storeData.dataTypes];
            newColumnType[columnIndex] = e.target.value;
            storeData["dataTypes"] = newColumnType;
            dispatch(setStoreData(storeData));
        }
    };

    const NTooltip = (data) => (
        <Box>
            <div>
                <div>This field has a mixed data type</div>
                <Box my={1}>
                    {
                        data.INTEGER !== 0 && <Flex gap={1}>
                            <b>Integer*</b> <a>{data.INTEGER}</a>
                        </Flex>
                    }
                    {
                        data.FLOAT !== 0 && <Flex gap={1}>
                            <b>Float*</b> <a>{data.FLOAT}</a>
                        </Flex>
                    }
                    {
                        data.STRING !== 0 && <Flex gap={1}>
                            <b>String*</b> <a>{data.STRING}</a>
                        </Flex>
                    }
                    {
                        data.BOOLEAN !== 0 && <Flex gap={1}>
                            <b>Boolean*</b> <a>{data.BOOLEAN}</a>
                        </Flex>
                    }
                    {
                        data.LIST !== 0 && <Flex gap={1}>
                            <b>List*</b> <a>{data.LIST}</a>
                        </Flex>
                    }
                    {
                        data.MAP !== 0 && <Flex gap={1}>
                            <b>Map (Object)*</b> <a>{data.MAP}</a>
                        </Flex>
                    }
                    {
                        data.NULL !== 0 && <Flex gap={1}>
                            <b>NULL*</b> <a>{data.NULL}</a>
                        </Flex>
                    }
                    {
                        data.ByteArray !== 0 && <Flex gap={1}>
                            <b>ByteArray*</b> <a>{data.ByteArray}</a>
                        </Flex>
                    }
                </Box>
                <div>Please select a different data type, to standardize the data</div>
            </div>
        </Box>
    );


    const handleBack = () => {
        storeData["csvData"] = {}
        console.log(storeData)
        dispatch(setStoreData(storeData));
        navigate('/upload')
    }

    async function setStatusWithDelay(status, delay) {
        setStatus(status);
        setTimeout(delay)
    }

    const fetchData = async () => {
        setIsLoading(true);
        try {
            await setStatusWithDelay("Reading file ...", 1000);
            let headers = []
            let dataType = {}
            if (storeData.filePath !== null) {
                const n = await window.electron.getLines(storeData.filePath, storeData.headers)
                await setStatusWithDelay("Skipping empty lines ...", 1000);
                headers = await window.electron.getHeaders(storeData.filePath, storeData.headers)
                setColumns(headers);
                const arr = Array.from({ length: Math.ceil((n + 1) / 10000) }, (v, i) => i * 10000).concat(n + 1);
                if (storeData.headers === true) {
                    arr[0] = 1
                }
                headers.map((item, index) => {
                    dataType[headers[index]] = {
                        NULL: 0,
                        LIST: 0,
                        MAP: 0,
                        BOOLEAN: 0,
                        INTEGER: 0,
                        FLOAT: 0,
                        STRING: 0,
                        ByteArray: 0,
                    }
                })
                if (arr.length > 2) {
                    for (let i = 0; i < arr.length - 1; i++) {
                        let d = await window.electron.getData(storeData.filePath, headers, arr[i], arr[i + 1], dataType, "init")
                        if (i === 0) {
                            console.log("storing for once")
                            storeData["csvData"] = d.data.slice(0, 10)
                            dispatch(setStoreData(storeData));
                        }
                        dataType = d.dataType
                        await setStatusWithDelay(`Reading CSV data (${(((i + 1) * 100) / arr.length - 1).toFixed(0)}%) ~ ${secondsToTime((arr.length - i) * 4)}`, 1000);
                    }
                } else {
                    let d = await window.electron.getData(storeData.filePath, headers, arr[0], arr[1], dataType, "init")
                    storeData["csvData"] = d.data.slice(0, 10)
                    dataType = d.dataType

                }
                dataType = checkForAbsolute(dataType)
                storeData["dataTypes"] = dataType;
                dispatch(setStoreData(storeData));

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
            await setStatusWithDelay("Identifying data types ...", 1000);
            setIsParsed(true);
            setIsLoading(false);
            await setStatusWithDelay("", 1000);


        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <>
            <Flex height="60vh" flexDirection="row">
                <Box p={2} width={"25%"} bg={"aliceblue"}>
                    <Flex gap={1} p={3} justifyContent={'center'}>
                        <Image src={logo} boxSize='30px' alt='logo' borderRadius={"20px"} />
                        <Text my={'auto'} fontWeight={"bold"} fontSize={"lg"}>NeoPort</Text>
                    </Flex>
                    {
                        columns.length !== 0 ?
                        <Flex p={1}>
                            <Box borderRadius={5} bg={"white"} w={"100%"} p={3} height={"50vh"} overflow={"auto"}>
                                {
                                    columns.map((item, index) => (
                                        <Tag px={4} key={index} m={1} bg={"gray.100"} shadow={'sm'}>
                                            <TagLabel fontSize={11}>{item}</TagLabel>
                                        </Tag>
                                    ))
                                }
                            </Box>
                        </Flex> :
                        <Flex borderRadius={5} bg={"white"} w={"100%"} p={5} gap={4} justifyContent={'center'}>
                            <Spinner size={'md'} thickness="4px" emptyColor='gray.200' color='blue.500'/>
                            <Text my={"auto"} fontSize={'sm'}>Identifying headers</Text>
                        </Flex>
                    }
                </Box>
                <Center height='60vh'>
                    <Divider orientation='vertical' />
                </Center>
                <Box width={"50%"}>
                    <Box overflowX="auto" maxWidth="100%">

                    </Box>
                </Box>
                <Center height='60vh'>
                    <Divider orientation='vertical' />
                </Center>
                <Box p={3} width={"25%"}>
                    <Text>Third Section</Text>
                    <VStack spacing={4}>
                        <Card width={"100%"}>
                            <Button onClick={() => handleBack()}>Back</Button>
                        </Card>
                    </VStack>
                </Box>
            </Flex>
            <Divider/>
            <Flex height={"35vh"} bg={"white"} p={3} pb={0}>
                {
                    storeData.csvData.length > 0 && storeData.dataTypes ?
                        <TableContainer overflowY={'scroll'}>
                            <Table variant='striped' size={'sm'}>
                                <Thead>
                                    <Tr>
                                        <Th></Th>
                                        {columns.length !== 0 && storeData.dataTypes &&
                                            columns.map((item, columnIndex) => (
                                                <Th py={3} role="button" minWidth={170} key={columnIndex} bg={storeData.dataTypes?.[item]?.abs !== true ? "aliceblue" : "white"}>
                                                    <Tooltip
                                                        hasArrow
                                                        label={<NTooltip {...storeData.dataTypes[item]} />}
                                                        placement={"top"}
                                                        p={3}
                                                        fontSize={'xs'}
                                                        borderRadius={5}
                                                        isDisabled={storeData.dataTypes[item].abs}
                                                    >
                                                        <div>
                                                            <Text fontSize={13}>{item}</Text>
                                                            <Flex gap={2}>
                                                                <Select
                                                                    bg={"white"}
                                                                    size={'xs'}
                                                                    my={1}
                                                                    rounded={5}
                                                                    value={storeData.dataTypes[item].maxDataType}
                                                                    onChange={handleColumnTypeChange}
                                                                >
                                                                    <option value='string'>string</option>
                                                                    <option value='integer'>integer</option>
                                                                    <option value='float'>float</option>
                                                                    <option value='boolean'>boolean</option>
                                                                </Select>
                                                                {storeData.dataTypes[item].abs !== true && <Box my={'auto'}><MdInfo fontSize={16} /></Box>}
                                                            </Flex>
                                                        </div>
                                                    </Tooltip>
                                                </Th>
                                            ))
                                        }
                                    </Tr>
                                </Thead>
        
        
                                <Tbody>
                                    {
                                        storeData.csvData.map((item, index) => (
                                            <Tr key={index}>
                                                <Td color={"gray"} fontSize={'xs'}>{index + 1}</Td>
                                                {Object.values(item).map((item_, index_) => (
                                                    <Td
                                                        key={index_}
                                                        fontSize={'xs'}
                                                        bg={storeData.dataTypes[columns[index_]]?.abs !== true ? "aliceblue" : "white"}
                                                    >
        
                                                        {item_ === true ? (
                                                            <b style={{ color: "gray" }}>true</b>
                                                        ) : item_ === false ? (
                                                            <b style={{ color: "gray" }}>false</b>
                                                        ) : (
                                                            <Box dangerouslySetInnerHTML={{ __html: typeof item_ === 'object' ? JSON.stringify(item_) : item_ }}></Box>
                                                        )}
                                                    </Td>
                                                ))}
                                            </Tr>
                                        ))
                                    }
                                </Tbody>
                            </Table>
                        </TableContainer>
                        : 
                        <Flex borderRadius={5} bg={"white"} m={"auto"} w={"100%"} p={5} gap={4} justifyContent={'center'}>
                            <Spinner size={'md'} thickness="4px" emptyColor='gray.200' color='blue.500'/>
                            <Text my={"auto"} fontSize={'sm'}>Loading Data</Text>
                        </Flex>
                    
                }

            </Flex>
            <Divider/>
            <Flex height={"4vh"} justifyContent={"end"} px={10} mt={1}>
                <Flex gap={3} my={'auto'}>
                    <Text fontSize={'xs'} my={"auto"} >{status}Hello</Text>
                    <Center height='4vh' my={'auto'}>
                        <Divider orientation='vertical' />
                    </Center>
                    <Box my={"auto"} role="button">
                        <FcDeleteDatabase />
                    </Box>
                </Flex>
            </Flex>
        </>
    );
}

export default Analyse;
