import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { Flex, VStack, Box, Text, Image, Button, useToast, Input, Checkbox } from "@chakra-ui/react"
import { TiTimes } from "react-icons/ti";
import logo from "../../logo.png";
import { useDispatch, useSelector } from 'react-redux';
import { TbCsv } from "react-icons/tb";
import { setCSVData, setHeaders } from '../../redux/actions/csvActions';
import { useNavigate } from 'react-router-dom';

const CSVUpload = () => {
  const [dropzoneActive, setDropzoneActive] = useState(true);
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const csvData = useSelector((state) => state.csvData)
  const headers = useSelector((state) => state.csvData.headers);
  const toast = useToast()
  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    if (file.type !== 'text/csv') {
      toast({
        title: 'Account created.',
        description: "We've created your account for you.",
        status: 'success',
        duration: 9000,
        isClosable: true,
      })
    }
    
    Papa.parse(file, {
      complete: (result) => {
        const { data } = result;
        setDropzoneActive(false);
        dispatch(
          setCSVData({
            csvData: data,
            fileName: file.name,
            fileSize: file.size,
          })
        );
      },
    });
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'text/csv': [
        '.csv, text/csv, application/vnd.ms-excel, application/csv, text/x-csv, application/x-csv, text/comma-separated-values, text/x-comma-separated-values',
      ],
    },
    disabled: !dropzoneActive,
  });

  const enableDropzone = () => {
    setDropzoneActive(true);
    dispatch(setCSVData({
      csvData: null,
      fileName: null,
      fileSize: null,
    }));
  }
  
  function formatFileSize(fileSizeInBytes) {
    if (fileSizeInBytes < 1024) {
      return `${fileSizeInBytes} bytes`;
    } else if (fileSizeInBytes < 1024 * 1024) {
      const fileSizeInKB = (fileSizeInBytes / 1024).toFixed(2);
      return `${fileSizeInKB} KB`;
    } else if (fileSizeInBytes < 1024 * 1024 * 1024) {
      const fileSizeInMB = (fileSizeInBytes / (1024 * 1024)).toFixed(2);
      return `${fileSizeInMB} MB`;
    } else {
      const fileSizeInGB = (fileSizeInBytes / (1024 * 1024 * 1024)).toFixed(2);
      return `${fileSizeInGB} GB`;
    }
  }

  const handleBack = () => {
    navigate('/')
    enableDropzone()
  }

  const handleHeadersChange = () => {
    const newHeadersValue = !headers; // Toggle the headers value
    dispatch(setHeaders(newHeadersValue)); // Dispatch the action to update Redux state
  };

  return (
    <div>
      <Flex h={'100vh'} className="dropzone">
        <VStack m={'auto'} justifyContent={'center'} textAlign={'center'} gap={5}>
          <Image src={logo} boxSize='100px' alt='logo' borderRadius={"20px"} />
          <Box textAlign={'center'} role='button'>
            {csvData.fileName ? (
            <VStack gap={5} py={10} px={20} boxShadow={"md"} borderRadius={10}>
              <Flex gap={1}>
                <TbCsv fontSize={22}/>
                <Text fontSize={14}>
                  {csvData.fileName}
                  <span style={{color: "grey"}}>({csvData.fileSize ? formatFileSize(csvData.fileSize) : 'N/A'})</span>
                </Text>
                <Box mt={1}>
                  <TiTimes onClick={() => enableDropzone()} fontSize={14} style={{color: "grey"}}/>
                </Box>
              </Flex>
              <Flex textAlign={'start'} w={"100%"}>
                <Checkbox defaultChecked={headers} onChange={handleHeadersChange} size={'sm'}>
                  <Text fontSize={'xs'}>Has Headers</Text>
                </Checkbox>
              </Flex>
              <Button size={'sm'} onClick={() => navigate('/analyse')}>Analyse</Button>
            </VStack>
            ) : (
            <>
              <Box p={20} boxShadow={"md"} borderRadius={10} {...getRootProps()} >
                <Box><TbCsv fontSize={50}/></Box>
                <Text fontSize={'small'}>Drag & drop a CSV file here, or click to select one</Text>
                <input type='file' {...getInputProps()} accept='text/csv' />
              </Box>
            </>
          )}
          </Box>
          <Flex ml={'auto'} mr={0}>
            <Button size={'xs'} onClick={() => handleBack()}>Cancel</Button>
          </Flex>
        </VStack>
      </Flex>
    </div>
  );
};

export default CSVUpload;
