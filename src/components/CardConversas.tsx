import { CardHeader, Box, Heading, IconButton, CardBody, CardFooter, Card, Flex, Avatar, Text } from "@chakra-ui/react"


export const CardConversation = () => {
    return (<>
        <Card maxW='md'>
  <CardHeader>
    <Flex>
      <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
       

        <Box>
          <Heading size='sm'>Conversation #01</Heading>
          
        </Box>
      </Flex>
      
    </Flex>
  </CardHeader>
  <CardBody>
    <Text>
    As the sun began to set, painting the sky in hues of orange and pink, Sarah walked along the quiet beach. The sound of gentle waves crashing..
    </Text>
  </CardBody>


  <CardFooter
    justify='space-between'
    flexWrap='wrap'
    sx={{
      '& > button': {
        minW: '136px',
      },
    }}
  >
  </CardFooter>
</Card>
    </>)
}