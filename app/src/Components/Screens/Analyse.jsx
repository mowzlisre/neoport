import { Box, Center, Divider, Flex, useToast } from "@chakra-ui/react";
import _ from 'lodash';
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { setStoreData } from "../../redux/actions/storeActions";
import EntitySandBox from "../Container/EntitySandBox";
import EntityTab from "../Container/EntityTab";
import HeaderTab from "../Container/HeaderTab";
import NavBar from "../Container/NavBar";
import PreviewTab from "../Container/PreviewTab";
import StatusBar from "../Container/StatusBar";
import ModalBox from "../Elements/ModalBox";
import { fetchData } from "../lib/analyse";

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
    const [modalSize, setModalSize] = useState('lg');
    const testConnection = async () => {
        const state = await window.settings.testConnection();
        setDbStatus(state)
    }

    useEffect(() => {
        const fetchDataFromBuffer = async () => {
            try {
                window.ipcRenderer.on('openWithFilePath', async (event, data) => {
                    localStorage.setItem('currentProject', data.path)
                    const sata = await window.electron.loadFromBuffer(data.path); 
                    window.electron.saveProject(sata, localStorage.getItem('currentProject'))
                    sata["projectTitle"] = window.electron.getProjectName(data.path)
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
    }, [dispatch, toast]);

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

    const openSetModal = (element, size) => {
        setModalElement(element);
        setModalSize(size)
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setIsModalOpen(false);
        setModalElement(null);
    }

    return (
        <>
            <NavBar/>
            <Divider/>
            <Flex height="55vh" flexDirection="row">
                <HeaderTab {...{columns, storeData}}/>
                <Center height='55vh'>
                    <Divider orientation='vertical' bg={"aliceblue"} />
                </Center>
                <Box width={"50%"}>
                    <EntitySandBox {...{storeData, current, setCurrent, columns, openSetModal, closeModal}}/>
                </Box>
                <Center height='55vh'>
                    <Divider orientation='vertical' bg={"aliceblue"} />
                </Center>
                <Box p={1} width={"25%"}>
                    <EntityTab {...{storeData, current, setCurrent}} />
                </Box>
            </Flex>
            <Divider />
            <PreviewTab {...{storeData, columns }} />
            <Divider />
            <StatusBar {...{storeData, dbStatus, setDbStatus, openSetModal, columns, status, closeModal}} />
            <ModalBox isOpen={isModalOpen} element={modalElement} size={modalSize} />
        </>
    );
}

export default Analyse;
