import { useSelector, useDispatch } from 'react-redux';
import { setRoom } from '../redux/features/rooms/roomSlice';
import { createChatFunctions } from '../utils/ChatPage';


export const useChatActions = (chatContext, user) => {
  const dispatch = useDispatch();

  const {
    handleClick,
    handleSendButton,
    handleTabChange,
    getReceiver,
    handleSearchInput,
    handleAddRooms,
    handleDeleteMessage,
    getCurrentReceiver,
    handleAddSearchQuery,
    getName,
  } = createChatFunctions({
    ...chatContext,
    user,
    dispatch,
  });

  return {
    handleClick,
    handleSendButton,
    handleTabChange,
    getReceiver,
    handleSearchInput,
    handleAddRooms,
    handleDeleteMessage,
    getCurrentReceiver,
    handleAddSearchQuery,
    getName,
  };
};
