import { createSlice } from '@reduxjs/toolkit';

const initialState = {
 isRoomClicked: false,
 roomInfo: null // 👈 NEW: Track loading state
};

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    setRoom: (state, action) => {
      state.roomInfo = action.payload;
      state.isRoomClicked = true;
    },
    clearRoom: (state) => {
      state.roomInfo = null;
      state.isRoomClicked = false;
    },
  },
});

export const { setRoom , clearRoom } = roomSlice.actions;
export default roomSlice.reducer;
