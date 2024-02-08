import { Flex, Box, Divider, Center } from "@chakra-ui/react"
import { useDispatch, useSelector } from 'react-redux';
import {  useToast } from '@chakra-ui/react'
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SettingsModal from "../Settings/SettingsModal";
import StatusBar from "../Container/StatusBar";
import PreviewTab from "../Container/PreviewTab";
import { fetchData } from "../lib/analyse";
import HeaderTab from "../Container/HeaderTab";
import EntityTab from "../Container/EntityTab";
import EntitySandBox from "../Container/EntitySandBox";
function Analyse() {
    const storeData = useSelector((state) => state.storeData)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const toast = useToast();
    const [columns, setColumns] = useState([])
    const [status, setStatus] = useState('')
    const [dbStatus, setDbStatus] = useState('unknown')
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const [current, setCurrent] = useState({})

    const testConnection = async () => {
        const status = await window.settings.testConnection();
        setDbStatus(status)
    }

    useEffect(() => {
        fetchData(storeData, setColumns, dispatch, navigate, toast, setStatus)

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
                    <EntitySandBox {...{storeData, current, setCurrent, columns}}/>
                </Box>
                <Center height='60vh'>
                    <Divider orientation='vertical' bg={"aliceblue"} />
                </Center>
                <Box p={3} width={"25%"}>
                    <EntityTab {...{storeData, current, setCurrent}} />
                </Box>
            </Flex>
            <Divider />
            <PreviewTab {...{storeData, columns }} />
            <Divider />
            <StatusBar {...{storeData, status, dbStatus, openModal, columns}} />
            <SettingsModal isOpen={isModalOpen} onClose={closeModal} dbStatus={dbStatus} setDbStatus={setDbStatus} storeData={storeData} />
        </>
    );
}

export default Analyse;
