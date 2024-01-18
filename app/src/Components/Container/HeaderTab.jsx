import { Box, Flex, Image, Spinner, Tag, TagLabel, Text } from "@chakra-ui/react";
import { IoChevronBackOutline } from "react-icons/io5";
import logo from "../../logo.png";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setStoreData } from "../../redux/actions/storeActions";


const HeaderTab = ({columns, storeData}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleBack = () => {
        dispatch(setStoreData(storeData));
        navigate('/upload')
    }
    return (
        <Box p={2} width={"25%"} bg={"aliceblue"}>
            <Flex gap={1} p={3} justifyContent={'space-evenly'}>
                <Box width={"20%"} my={"auto"} onClick={handleBack} role="button">
                    <IoChevronBackOutline fontSize={25} color={"teal"} />
                </Box>
                <Flex width={"60%"} justifyContent={'center'}>
                    <Image src={logo} boxSize='30px' alt='logo' borderRadius={"20px"} />
                    <Text my={'auto'} fontWeight={"bold"} fontSize={"lg"}>NeoPort</Text>
                </Flex>
                <Box width={"20%"}></Box>
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
                        <Spinner size={'md'} thickness="4px" emptyColor='gray.200' color='blue.500' />
                        <Text my={"auto"} fontSize={'sm'}>Identifying headers</Text>
                    </Flex>
            }
        </Box>
    )
}

export default HeaderTab;