import { useState } from "react"
import { useNavigate } from "react-router-dom"
import logo from "../../logo.png"
import { Flex, VStack, Image, Button, Text, Box } from "@chakra-ui/react"

function Welcome(){
    const electron = window.electron
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const handleStartImport = () => {
        setInterval(() => {
            setIsLoading(false)
            navigate('/upload')
        }, 2000)
        setIsLoading(true)
    }
    return <>
        <Flex h={'100vh'}>
            <VStack m={'auto'} justifyContent={'center'} textAlign={'center'} gap={5}>
                <Image src={logo} boxSize='150px' alt='logo' borderRadius={"20px"} />
                <Button size={'sm'} onClick={() => handleStartImport()} isLoading={isLoading} >Start Import</Button>
                <Text fontSize={'2xs'} width={"70%"} lineHeight={4}>
                    Before proceeding, please understand that this tool is intended for educational purposes only. It is not advised to use it for a production level, unless you are starting with an empty database.
                </Text>
            </VStack>
            <Box as="footer" position="fixed" bottom="0" left="0" right="0" p="2" textAlign="center" fontSize={'2xs'}>
                Made in <a style={{color: 'red'}}>♥</a> by <a onClick={() => electron.openHttp('https://github.com/mowzlisre')} role="button" rel="noopener noreferrer" style={{color: '#0092A1'}} target='_blank'>Mowzli Sre Mohan Dass</a>
            </Box>
        </Flex>
    </>
}

export default Welcome;