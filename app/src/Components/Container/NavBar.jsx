import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { IoChevronBackOutline } from "react-icons/io5";
import logo from "../../logo.png";

function NavBar(){

    const handleBack = () => {
        window.ipcRenderer.send('returnBackToWelcomeScreen')
    }
    return (
        <Flex height={"5vh"}>
            <Box my={'auto'} px={5}>
                <Flex justifyContent={'space-evenly'} my={'auto'} gap={3}>
                    <Box width={"20%"} my={"auto"} onClick={handleBack} role="button">
                        <IoChevronBackOutline fontSize={15} color={"teal"} />
                    </Box>
                    <Flex width={"60%"} justifyContent={'center'} gap={2}>
                        <Image src={logo} boxSize='20px' my={'auto'} alt='logo' borderRadius={"20px"}  />
                    </Flex>
                    <Box width={"20%"}></Box>
                </Flex>
            </Box>
        </Flex>
    )
}

export default NavBar;