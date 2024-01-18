import { Flex, VStack, Box, Text, Image, Spinner, Card, Divider, Center } from "@chakra-ui/react"
import { useDispatch, useSelector } from 'react-redux';
import {  useToast, Tag, TagLabel } from '@chakra-ui/react'
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { setStoreData } from "../../redux/actions/storeActions";
import { IoChevronBackOutline } from "react-icons/io5";
import SettingsModal from "../Settings/SettingsModal";
import StatusBar from "../Container/StatusBar";
import PreviewTab from "../Container/PreviewTab";
import { fetchData } from "../lib/analyse";
import HeaderTab from "../Container/HeaderTab";
function Analyse() {
    const storeData = useSelector((state) => state.storeData)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const toast = useToast();
    const [columns, setColumns] = useState([])
    const [status, setStatus] = useState('')
    const [n, setN] = useState(0)
    const [sample, setSample] = useState({})
    const [dbStatus, setDbStatus] = useState('unknown')
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);


    const testConnection = async () => {
        const status = await window.settings.testConnection();
        setDbStatus(status)
    }

    useEffect(() => {
        fetchData(storeData, setN, setColumns, setSample, dispatch, navigate, toast, setStatus)
        testConnection()
    }, [])

    return (
        <>
            <Flex height="60vh" flexDirection="row">
                <HeaderTab {...{columns, storeData}}/>
                <Center height='60vh'>
                    <Divider orientation='vertical' bg={"aliceblue"} />
                </Center>
                <Box width={"50%"}>
                    <Box overflowX="auto" maxWidth="100%">

                    </Box>
                </Box>
                <Center height='60vh'>
                    <Divider orientation='vertical' bg={"aliceblue"} />
                </Center>
                <Box p={3} width={"25%"}>
                    <Text>Third Section</Text>
                    <VStack spacing={4}>
                        <Card width={"100%"}>

                        </Card>
                    </VStack>
                </Box>
            </Flex>
            <Divider />
            <PreviewTab {...{ sample, storeData, columns }} />
            <Divider />
            <StatusBar {...{status, dbStatus, openModal, columns, n}} />
            <SettingsModal isOpen={isModalOpen} onClose={closeModal} dbStatus={dbStatus} setDbStatus={setDbStatus} />
        </>
    );
}

export default Analyse;
