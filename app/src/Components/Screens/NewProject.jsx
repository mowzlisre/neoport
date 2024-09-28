import { Box, Button, Flex, HStack, Input, Stack, Text, Textarea, useToast, VStack } from "@chakra-ui/react"
import { IoMdClose } from "react-icons/io"
import { useNavigate } from "react-router-dom"
import { primaryColorBg } from "../lib/conf"
import { useState } from "react"
import { setStoreData } from "../../redux/actions/storeActions"
import { useDispatch, useSelector } from "react-redux"

const NewProject = () => {
    const navigate = useNavigate()
    const checkForExisting = window.electron.checkForExisting
    const storeData = useSelector((state) => state.storeData)
    const [title, setTitle] = useState(storeData.projectTitle || '')
    const [description, setDescription] = useState(storeData.projectDescription || '')
    const [fileExists, setFileExists] = useState(false)
    const toast = useToast()
    const id = '000'
    const dispatch = useDispatch();

    const handleCloseWindow = () => {
        window.ipcRenderer.send('closeWindow');
    }

    const titleOnChange = (e) => {
        const title = e.target.value.trim()
        const exists = checkForExisting(title)
        if (title !== ''){
            setFileExists(exists)
            setTitle(title)
            if(exists === true){
                if (!toast.isActive(id)) {
                    toast({
                        title: 'Project already exists',
                        status: 'error',
                        duration: 2000,
                    })
                }
            }
        } else{
            setTitle('')
        }
    }

    const descriptionOnChange = (e) => {
        const description = e.target.value
        setDescription(description)
    }

    const createProjectPreflight = () => {
        const exists = checkForExisting(title)
        setFileExists(exists)

        if (title !== ''){
            if (exists === false){
                storeData["projectTitle"] = title
                storeData["projectDescription"] = description
                dispatch(setStoreData(storeData));
                navigate('/updatedatasource')
            } else{
                if (!toast.isActive(id)) {
                    toast({
                        id,
                        title: 'Project Name already exists',
                        status: 'error',
                        duration: 2000,
                    })
                }
            }
        }
        return;
    }

    return (
        <div className='fade-in'>
            <Box position={"fixed"} top={15} right={15} sx={{ cursor: 'pointer' }} onClick={handleCloseWindow}>
                <IoMdClose />
            </Box>
            <Box display={"flex"} width={"100%"}>
                <Stack direction={"column"} height={"100vh"} width={"30%"} bg={primaryColorBg} px={1} py={2} gap={1}>
                </Stack>
                <Flex width={"100%"} height={"100vh"} padding={10}>
                    <Box width={"100%"} my={'auto'} >
                        <VStack gap={1} mb={3}>
                            <Text fontSize={'2xl'} fontWeight={'light'} mr={'auto'}>Project Title</Text>
                            <Input value={title} onChange={titleOnChange} isInvalid={fileExists} ></Input>
                        </VStack>
                        <VStack gap={1} mb={3}>
                            <Text fontSize={'sm'} fontWeight={'light'} mr={'auto'} color={'gray'}>Description</Text>
                            <Textarea fontSize={'sm'} value={description} onChange={descriptionOnChange} resize={"none"}></Textarea>
                        </VStack>
                        <HStack gap={2}>
                            <Button fontSize={'xs'} size={'sm'} onClick={() => createProjectPreflight()}>Create</Button>
                            <Button fontSize={'xs'} size={'sm'} variant={"ghost"} colorScheme="blue"  onClick={() => navigate('/prompt')}>Cancel</Button>
                        </HStack>
                    </Box>
                </Flex>
            </Box>
        </div>
    )
}

export default NewProject