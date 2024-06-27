// src/redux/slices/hodSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  hod: null,
};

const hodSlice = createSlice({
  name: 'hod',
  initialState,
  reducers: {
    setHod: (state, action) => {
      state.hod = action.payload;
    },
  },
});

export const { setHod } = hodSlice.actions;
export default hodSlice.reducer;
