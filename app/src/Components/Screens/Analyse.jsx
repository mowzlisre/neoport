import { Flex, Box, Divider, Center } from "@chakra-ui/react"
import { useDispatch, useSelector } from 'react-redux';
import {  useToast } from '@chakra-ui/react'
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import SettingsModal from "../Settings/SettingsModal";
import StatusBar from "../Container/StatusBar";
import PreviewTab from "../Container/PreviewTab";
import { fetchData } from "../lib/analyse";
import HeaderTab from "../Container/HeaderTab";
import EntityTab from "../Container/EntityTab";
import EntitySandBox from "../Container/EntitySandBox";
import ModalBox from "../Elements/ModalBox";
import { setStoreData } from "../../redux/actions/storeActions";
import _ from 'lodash';

function Analyse() {
    const storeData = useSelector((state) => state.storeData)
    const status = useSelector((state) => state.status)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const toast = useToast();
    const [columns, setColumns] = useState([])
    const [dbStatus, setDbStatus] = useState('unknown')
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [current, setCurrent] = useState({})
    const [modalElement, setModalElement] = useState(null);

    const testConnection = async () => {
        const state = await window.settings.testConnection();
        setDbStatus(state)
    }

    useEffect(() => {
        const fetchDataFromBuffer = async () => {
            try {
                window.ipcRenderer.on('openWithFilePath', async (event, data) => {
                    const sata = await window.electron.loadFromBuffer(data.path); 
                    dispatch(setStoreData(sata));
                })
            } catch (error) {
                console.error("Error loading data:", error);
                toast({
                    title: "Error loading data",
                    description: error.message,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }

        };
        fetchDataFromBuffer();
        return () => {
            window.ipcRenderer.removeAllListeners('openWithFilePath');
        };
    }, []);

    const prevStoreDataRef = useRef();

    useEffect(() => {
        if (storeData && !_.isEqual(prevStoreDataRef.current, storeData)) {
            fetchData(storeData, setColumns, dispatch, navigate, toast);
            prevStoreDataRef.current = storeData;
        }
    }, [storeData]);

    useEffect(() => {
        testConnection();
    }, [])

    const openSetModal = (element) => {
        setModalElement(element);
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setIsModalOpen(false);
        setModalElement(null);
    }

    return (
        <>
            <Flex height="60vh" flexDirection="row">
                <HeaderTab {...{columns, storeData}}/>
                <Center height='60vh'>
                    <Divider orientation='vertical' bg={"aliceblue"} />
                </Center>
                <Box width={"50%"}>
                    <EntitySandBox {...{storeData, current, setCurrent, columns, openSetModal}}/>
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
            <StatusBar {...{storeData, dbStatus, setDbStatus, openSetModal, columns, status}} />
            <ModalBox isOpen={isModalOpen} onClose={closeModal} element={modalElement} />
        </>
    );
}

export default Analyse;
