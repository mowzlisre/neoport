import { Box, Flex } from "@chakra-ui/react";

const NTooltip = ({data}) => {
    console.log(data)
    return (
        <Box>
            <div>
                <div>This field has a mixed data type</div>
                <Box my={1}>
                    {
                        data.INTEGER !== 0 && <Flex gap={1}>
                            <b>Integer*</b> <a>{data.INTEGER}</a>
                        </Flex>
                    }
                    {
                        data.FLOAT !== 0 && <Flex gap={1}>
                            <b>Float*</b> <a>{data.FLOAT}</a>
                        </Flex>
                    }
                    {
                        data.STRING !== 0 && <Flex gap={1}>
                            <b>String*</b> <a>{data.STRING}</a>
                        </Flex>
                    }
                    {
                        data.BOOLEAN !== 0 && <Flex gap={1}>
                            <b>Boolean*</b> <a>{data.BOOLEAN}</a>
                        </Flex>
                    }
                    {
                        data.LIST !== 0 && <Flex gap={1}>
                            <b>List*</b> <a>{data.LIST}</a>
                        </Flex>
                    }
                    {
                        data.MAP !== 0 && <Flex gap={1}>
                            <b>Map (Object)*</b> <a>{data.MAP}</a>
                        </Flex>
                    }
                    {
                        data.NULL !== 0 && <Flex gap={1}>
                            <b>NULL*</b> <a>{data.NULL}</a>
                        </Flex>
                    }
                    {
                        data.ByteArray !== 0 && <Flex gap={1}>
                            <b>ByteArray*</b> <a>{data.ByteArray}</a>
                        </Flex>
                    }
                </Box>
                <div>Please select a different data type, to standardize the data</div>
            </div>
        </Box>
    )
}

export default NTooltip;