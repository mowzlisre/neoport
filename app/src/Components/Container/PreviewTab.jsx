import { Box, Flex, Select, Spinner, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tooltip, Tr } from "@chakra-ui/react"
import { MdInfo } from "react-icons/md";
import { setStoreData } from "../../redux/actions/storeActions";
import { useDispatch } from "react-redux";
import NTooltip from "./NTooltip";

const PreviewTab = ({ storeData, columns }) => {
    const dispatch = useDispatch();

    const handleColumnTypeChange = (e, columnIndex) => {
        if (storeData.dataTypes) {
            const newColumnType = [...storeData.dataTypes];
            newColumnType[columnIndex] = e.target.value;
            storeData["dataTypes"] = newColumnType;
            dispatch(setStoreData(storeData));
        }
    };
    return (

        <Flex height={"35.5vh"} bg={"hite"} p={3} pb={0}>
            {
                storeData.filePath !== null ? storeData["csvData"].length > 0 && storeData.dataTypes ?
                    <TableContainer overflowY={'auto'} width={"100%"}>
                        <Table variant='striped' size={'sm'} className="scrollbar">
                            <Thead>
                                <Tr>
                                    <Th></Th>
                                    {columns.length !== 0 && storeData.dataTypes &&
                                        columns.map((item, columnIndex) => (
                                            <Th py={3} role="button" minWidth={170} key={columnIndex} bg={storeData.parseDataTypes === true ? storeData.dataTypes?.[item]?.abs !== true ? "aliceblue" : "white" : "white"}>
                                                <Tooltip
                                                    hasArrow
                                                    label={<NTooltip data={storeData.dataTypes[item]} />}
                                                    placement={"top"}
                                                    p={3}
                                                    fontSize={'xs'}
                                                    borderRadius={5}
                                                    isDisabled={storeData.parseDataTypes === true ? storeData.dataTypes[item].abs : true}
                                                >
                                                    <div>
                                                        <Text fontSize={13}>{item}</Text>
                                                        <Flex gap={2}>
                                                            <Select
                                                                bg={"white"}
                                                                size={'xs'}
                                                                my={1}
                                                                rounded={5}
                                                                value={storeData.dataTypes[item]?.maxDataType || 'UNCHANGED'}
                                                                onChange={handleColumnTypeChange}
                                                            >
                                                                <option value='UNCHANGED'>UNCHANGED</option>
                                                                <option value='STRING'>STRING</option>
                                                                <option value='NULL'>NULL</option>
                                                                <option value='LIST'>LIST</option>
                                                                <option value='MAP'>MAP</option>
                                                                <option value='BOOLEAN'>BOOLEAN</option>
                                                                <option value='INTEGER'>INTEGER</option>
                                                                <option value='FLOAT'>FLOAT</option>
                                                                <option value='ByteArray'>ByteArray</option>
                                                            </Select>
                                                            {storeData.parseDataTypes === true && storeData.dataTypes[item].abs !== true && <Box my={'auto'}><MdInfo fontSize={16} /></Box>}
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
                                    storeData["csvData"].map((item, index) => (
                                        <Tr key={index}>
                                            <Td color={"gray"} fontSize={'xs'}>{index + 1}</Td>
                                            {Object.values(item).map((item_, index_) => (
                                                <Td
                                                    key={index_}
                                                    fontSize={'xs'}
                                                    bg={storeData.parseDataTypes === true ? storeData.dataTypes[columns[index_]]?.abs !== true ? "aliceblue" : "white" : "white"}
                                                >

                                                    {item_ === true ? (
                                                        <b style={{ color: "gray" }}>true</b>
                                                    ) : item_ === false ? (
                                                        <b style={{ color: "gray" }}>false</b>
                                                    ) : item_ === null || item_ === "" ? (
                                                        <b>null</b>
                                                    ) : (
                                                        <Box dangerouslySetInnerHTML={{
                                                            __html: typeof item_ === 'object' ?
                                                                JSON.stringify(item_).length > 30 ?
                                                                    JSON.stringify(item_).slice(0, 30) + " ..."
                                                                    : JSON.stringify(item_)
                                                                : item_.length > 30 ?
                                                                    item_.slice(0, 30) + " ..."
                                                                    : item_
                                                        }} />
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
                        <Spinner size={'md'} thickness="4px" emptyColor='gray.200' color='blue.500' />
                        <Text my={"auto"} fontSize={'sm'}>Loading Data</Text>
                    </Flex>
                : 
                <Flex borderRadius={5} bg={"white"} w={"100%"} p={5} gap={4} justifyContent={'center'}>
                    <Text my={"auto"} fontSize={'sm'}>Add Data Source</Text>
                </Flex>

            }

        </Flex>
    )
}

export default PreviewTab