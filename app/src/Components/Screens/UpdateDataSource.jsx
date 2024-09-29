import { Box, Button, Checkbox, Flex, HStack, Stack, Text, useToast, VStack } from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { IoCloudUploadOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setStoreData } from "../../redux/actions/storeActions";
import { formatFileSize, primaryColorBg } from "../lib/conf";


const UpdateDataSource = () => {

    const handleCloseWindow = () => {
        window.ipcRenderer.send('closeWindow');
    }

    const navigate = useNavigate()
    const createProject = window.electron.createProject
    const dispatch = useDispatch();
    const storeData = useSelector((state) => state.storeData)
    const dropzoneRef = useRef(null);
    const fileInputRef = useRef(null);

    const toast = useToast();
    const [existingProject, setExistingProject] = useState(false)

    useEffect(() => {
        window.ipcRenderer.on('returnToDataSourceMissing', async(event, data) => {
            console.log(data)
            const sata = await window.electron.loadFromBuffer(data.data.path); 
            sata["filePath"] = null
            sata["fileName"] = null
            sata["fileSize"] = null
            dispatch(setStoreData({...sata}))
            setExistingProject(true)
        });
    
        return () => {
            window.ipcRenderer.removeAllListeners('returnToDataSourceMissing');
        };
    }, []);
    


    const handleFile = useCallback((files) => {
        if (files.length > 0) {
            const file = files[0];
            if (file.type === 'text/csv' || /\.csv$/.test(file.name)) {
                storeData["fileName"] = file.name
                storeData["fileSize"] = file.size
                storeData["filePath"] = file.path
                dispatch(setStoreData(storeData));
            } else {
                toast({
                    title: <Text fontSize={'sm'}>Unsupported File Type</Text>,
                    status: "error",
                    duration: 3000,
                    variant: "subtle"
                });
            }
        }
    }, [dispatch, storeData, toast]);
    

    const openFileDialog = () => {
        fileInputRef.current.click();
    };
    const handleFileSelect = (e) => {
        const files = e.target.files;
        handleFile(files)
    };

    useEffect(() => {
        if (!dropzoneRef.current) {
            return;
        }
        const handleDragOver = (e) => {
            e.preventDefault();
        };
    
        const handleDrop = (e) => {
            e.preventDefault();
            const files = e.dataTransfer.files;
            handleFile(files)
    
        };
    
        const dropzone = dropzoneRef.current;
        dropzone.addEventListener('dragover', handleDragOver);
        dropzone.addEventListener('drop', handleDrop);
    
        return () => {
            dropzone.removeEventListener('dragover', handleDragOver);
            dropzone.removeEventListener('drop', handleDrop);
        };
    }, [handleFile]);
    

    const handleFileCancel = () => {
        storeData["fileName"] = null
        storeData["fileSize"] = null
        dispatch(setStoreData(storeData));

    }

    const handleHeadersChange = () => {
        storeData["headers"] = !storeData["headers"]
        dispatch(setStoreData(storeData));
    };

    const handleParseChange = () => {
        storeData["parseDataTypes"] = !storeData["parseDataTypes"]
        dispatch(setStoreData(storeData));
    };

    const handleAnalyse = () => {
        const path = createProject(storeData)
        window.ipcRenderer.send('proceedFromNewProject', {path});
    }

    return (
        storeData &&
        <div className='fade-in'>
            <Box position={"fixed"} top={15} right={15} sx={{ cursor: 'pointer' }} onClick={handleCloseWindow}>
                <IoMdClose />
            </Box>
            <Box display={"flex"} width={"100%"}>
                <Stack direction={"column"} height={"100vh"} width={"30%"} bg={primaryColorBg} px={1} py={2} gap={1}>
                </Stack>
                <Flex width={"100%"} height={"100vh"} padding={10}>
                    <Box width={"100%"} my={'auto'} >
                        {
                            storeData.fileName !== null ?
                            <Box>
                                <VStack gap={1} mb={3}>
                                    <Text fontSize={'2xl'} fontWeight={'light'} mr={'auto'}>{storeData.fileName} ({storeData.fileSize ? formatFileSize(storeData.fileSize) : 'N/A'})</Text>
                                </VStack>
                                <VStack gap={3}>
                                    <input ref={fileInputRef} type="file" hidden onChange={handleFileSelect} accept=".csv" />
                                    <Box mr={'auto'}>
                                        <Flex textAlign={'start'} w={"100%"} mb={2}>
                                            <Checkbox defaultChecked={storeData["headers"]} onChange={handleHeadersChange} size={'sm'}>
                                                <Text fontSize={'xs'}>Has Headers</Text>
                                            </Checkbox>
                                        </Flex>
                                        <Flex textAlign={'start'} w={"100%"} mb={2}>
                                            <Checkbox defaultChecked={storeData["parseDataTypes"]} onChange={handleParseChange} size={'sm'}>
                                                <Text fontSize={'xs'}>Parse Advanced Data Types like Lists and Maps</Text>
                                            </Checkbox>
                                        </Flex>
                                    </Box>

                                    <HStack gap={3} mr={'auto'}>
                                        <Button colorScheme="blue" size={'sm'} fontSize={'xs'} onClick={handleAnalyse}>Analyse</Button>
                                        <Button mr={'auto'} size={'sm'} leftIcon={<IoCloudUploadOutline />} variant='solid'  onClick={openFileDialog}>
                                            <Text fontSize={'xs'}>Replace File</Text>
                                        </Button>
                                        <Button size={'sm'} fontSize={'xs'} onClick={() => handleFileCancel()}>Cancel</Button>
                                        {
                                            !existingProject &&
                                            <Button size={'sm'} variant='ghost'>
                                                <Text fontSize={'xs'} onClick={() => navigate('/newproject')}>Back</Text>
                                            </Button>
                                        }
                                    </HStack>
                                </VStack>
                            </Box>
                            : <Box>
                                <VStack gap={1} mb={3}>
                                    <Text fontSize={'2xl'} fontWeight={'light'} mr={'auto'}>Upload Data Source for the Project</Text>
                                </VStack>
                                <HStack gap={2}>
                                <Button size={'sm'} leftIcon={<IoCloudUploadOutline />} variant='solid'  onClick={openFileDialog}>
                                    <Text fontSize={'xs'}>Choose File</Text>
                                </Button>
                                {
                                    !existingProject &&
                                    <Button size={'sm'} variant='ghost'>
                                        <Text fontSize={'xs'} onClick={() => navigate('/newproject')}>Back</Text>
                                    </Button>
                                }

                                <input ref={fileInputRef} type="file" hidden onChange={handleFileSelect} accept=".csv" />
                                </HStack>
                            </Box>
                        }
                    </Box>
                </Flex>
            </Box>
        </div>
    )
}

export default UpdateDataSource