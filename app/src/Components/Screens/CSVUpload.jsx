import React, { useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import {
    Flex,
    VStack,
    Box,
    Text,
    Image,
    Button,
    useToast,
    Input,
    Checkbox,
    Spinner
} from "@chakra-ui/react"
import { TiTimes } from "react-icons/ti";
import logo from "../../logo.png";
import { useDispatch, useSelector } from 'react-redux';
import { TbCsv } from "react-icons/tb";
import { setStoreData, setHeaders } from '../../redux/actions/storeActions';
import { useNavigate } from 'react-router-dom';
import { formatFileSize } from '../lib/conf';

const CSVUpload = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const storeData = useSelector((state) => state.storeData)
    const dropzoneRef = useRef(null);
    const fileInputRef = useRef(null);

    const toast = useToast();

    const handleFile = (files) => {
        if (files.length > 0) {
            const file = files[0];
            if (file.type === 'text/csv' || /\.csv$/.test(file.name)) {
                dispatch(setStoreData({ filePath: file.path, fileName: file.name, fileSize: file.size, headers: storeData["headers"] }));
            } else {
                toast({
                    title: <Text fontSize={'sm'}>Unsupported File Type</Text>,
                    status: "error",
                    duration: 3000,
                    variant: "subtle"
                });
            }
        }
    }

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
    }, []);


    const handleBack = () => {
        navigate('/')
    }

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
        navigate('/analyse')
    }

    return (
        <div>
            <Flex h={'100vh'} className="dropzone fade-in">
                <VStack m={'auto'} justifyContent={'center'} textAlign={'center'} gap={5}>
                    <Image src={logo} boxSize='100px' alt='logo' borderRadius={"20px"} />
                    <Box textAlign={'center'} role='button'>
                        {storeData.fileName ? (
                            <VStack gap={5} className='fade-in' py={10} px={20} boxShadow={"md"} borderRadius={10}>
                                <Flex gap={1}>
                                    <TbCsv fontSize={22} />
                                    <Text fontSize={14}>
                                        {storeData.fileName}
                                        <span style={{ color: "grey" }}>
                                            ({storeData.fileSize ? formatFileSize(storeData.fileSize) : 'N/A'})
                                        </span>
                                    </Text>
                                    <Box mt={1}>
                                        <TiTimes onClick={() => handleFileCancel()} fontSize={14} style={{ color: "grey" }} />
                                    </Box>
                                </Flex>
                                <Flex textAlign={'start'} w={"100%"}>
                                    <Checkbox defaultChecked={storeData["headers"]} onChange={handleHeadersChange} size={'sm'}>
                                        <Text fontSize={'xs'}>Has Headers</Text>
                                    </Checkbox>
                                </Flex>
                                <Flex textAlign={'start'} w={"100%"}>
                                    <Checkbox defaultChecked={storeData["parseDataTypes"]} onChange={handleParseChange} size={'sm'}>
                                        <Text fontSize={'xs'}>Parse DataTypes (slower)</Text>
                                    </Checkbox>
                                </Flex>
                                <Button size={'sm'} onClick={handleAnalyse}>Analyse</Button>
                            </VStack>) : (
                            <>
                                <Box p={20} boxShadow={"md"} borderRadius={10} ref={dropzoneRef} className="dropzone fade-in" onClick={openFileDialog}>
                                    <Flex gap={2}>
                                        <Box><TbCsv fontSize={50} /></Box>
                                    </Flex>
                                    <Text fontSize={'small'}>Drag & drop a CSV file here, or click to select one</Text>
                                    <input ref={fileInputRef} type="file" hidden onChange={handleFileSelect} accept=".csv" />
                                </Box>
                            </>
                        )
                        } </Box>
                    <Flex ml={'auto'} mr={0}> <Button size={'xs'} onClick={() => handleBack()}>Cancel</Button>
                    </Flex>
                </VStack>
            </Flex>
        </div>
    );
};

export default CSVUpload;
