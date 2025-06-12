import { useSelector } from 'react-redux';
import { Box, Text, VStack } from '@chakra-ui/react';

export const MessageOpenBox = ({ messages }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Box
      bg="#ebe9e9"
      p={4}
      borderRadius="8px"
      maxH="600px"
      overflowY="auto"
      boxShadow="md"
      display="flex"
      flexDirection="column"
    >
      {messages?.length > 0 ? (
        <VStack align="stretch" spacing={2}>
          {messages.map((msg, index) => {
            const isSent = msg?.sender?._id === user?._id;

            return (
              <Box
                key={msg._id || index}
                alignSelf={isSent ? 'flex-end' : 'flex-start'}
                bg={isSent ? '#cdc7c7' : '#202020'}
                border="1px solid #000000"
                color={isSent ? 'black' : 'white'}
                borderRadius="12px"
                maxW="90%"
                p={3}
                cursor="pointer"
                position="relative"
                _after={{
                  content: '""',
                  position: 'absolute',
                  width: 0,
                  height: 0,
                  borderStyle: 'solid',
                  borderWidth: isSent ? '10px 10px 0 10px' : '0 10px 10px 10px',
                  borderColor: isSent
                    ? '#cdc7c7 transparent transparent transparent' // Upward arrow (bottom of bubble)
                    : 'transparent transparent #202020 transparent', // Downward arrow (top of bubble)
                  top: isSent ? '100%' : '-10px',
                  left: isSent ? 'auto' : '10px',
                  right: isSent ? '10px' : 'auto',
                }}
              >
                <Text fontSize="md" m={0}>
                  {msg.message}
                </Text>
                <Text
                  fontSize="sm"
                  color={isSent ? '#a4a4a4' : '#4e4d4d'}
                  mt={1}
                >
                  {new Date(msg?.createdAt || Date.now()).toLocaleTimeString()}
                </Text>
              </Box>
            );
          })}
        </VStack>
      ) : (
        <Text color="red.500" fontWeight="bold" textAlign="center" mt={4}>
          No messages to show
        </Text>
      )}
    </Box>
  );
};
