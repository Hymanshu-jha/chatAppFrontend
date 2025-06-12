import React from 'react';
import { useSelector } from 'react-redux';
import  Demo from './Demo'

import {
  Box,
  VStack,
  Text,
  Flex,
  Badge,

} from '@chakra-ui/react';

export const MessageRoomList = ({ rooms, setRoomId, selectedRoomId }) => {
  const { user } = useSelector((state) => state.auth);

  // Static colors (no color mode dependency)
  const containerBg = 'blue.50';
  const cardBg = 'gray.800';
  const cardHoverBg = 'gray.700';
  const selectedCardBg = 'black';
  const titleColor = 'blue.600';
  const emptyMessageColor = 'red.500';

  const getName = (room) => {
    if (room?.isGroup) return room?.roomName;
    const [member1, member2] = room?.members;
    return user?.emailid === member1?.emailid ? member2.name : member1.name;
  };

  const getStatus = (room) => {
    if (room?.isGroup) return 'online';
    const [member1, member2] = room?.members;
    const other = user?.emailid === member1?.emailid ? member2 : member1;
    return other ? 'online' : 'offline';
  };

  if (!rooms || rooms.length === 0) {
    return (
      <Box
        p={4}
        bg={containerBg}
        borderRadius="12px"
        boxShadow="0 0 10px rgba(0, 128, 128, 0.1)"
        maxH="80vh"
        overflowY="auto"
      >
        <Text
          fontSize="xl"
          fontWeight="bold"
          color={titleColor}
          mb={4}
          textAlign="center"
        >
          Your Chat Rooms
        </Text>
        <Text
          color={emptyMessageColor}
          fontWeight="medium"
          textAlign="center"
          mt={8}
        >
          Your Room List is empty...
        </Text>
      </Box>
    );
  }

  return (
    <Box
      p={4}
      bg={containerBg}
      borderRadius="12px"
      boxShadow="0 0 10px rgba(0, 128, 128, 0.1)"
      maxH="80vh"
      overflowY="auto"
    >
      <Text
        fontSize="xl"
        fontWeight="bold"
        color={titleColor}
        mb={4}
        textAlign="center"
      >
        Your Chat Rooms
      </Text>
      
      <VStack spacing={4} align="stretch">
        {rooms.map((room) => {
          const isSelected = selectedRoomId === room._id;
          const status = getStatus(room);

          return (
            <Box
              key={room._id}
              onClick={(e) => setRoomId(e, room)}
              bg={isSelected ? selectedCardBg : cardBg}
              borderLeft="6px solid"
              borderLeftColor={isSelected ? "blue.600" : "green.400"}
              p={3}
              borderRadius="8px"
              cursor="pointer"
              color="white"
              fontSize={isSelected ? "2xl" : "xl"}
              fontWeight={isSelected ? "bold" : "normal"}
              transition="all 0.2s ease"
              _hover={{
                transform: "translateY(-3px)",
                boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
                bg: isSelected ? selectedCardBg : cardHoverBg,
              }}
            >
              <Flex justify="space-between" align="center">
                 
                 <Demo
                 />

                               
                <Text>{getName(room)}</Text>
                <Badge
                  variant="solid"
                  colorScheme={status === 'online' ? 'cyan' : 'gray'}
                  borderRadius="full"
                  w="10px"
                  h="10px"
                  p={0}
                  minW="10px"
                  fontSize="0"
                  bg={status === 'online' ? 'cyan.400' : 'gray.400'}
                />
              </Flex>
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
};



