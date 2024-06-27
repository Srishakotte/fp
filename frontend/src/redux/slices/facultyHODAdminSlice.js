// src/redux/slices/facultyHODAdminSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { setHod } from './hodSlice';  // Import setHod action

export const loginUser = createAsyncThunk(
  'facultyHODAdmin/loginUser',
  async (userCredentials, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(`http://localhost:4000/${userCredentials.role}-api/login`, userCredentials);

      console.log('Login response:', response);

      if (response.data && response.data.user && response.data.token) {
        if (userCredentials.role === 'hod') {
          dispatch(setHod(response.data.user));
        }
        return response.data;
      } else {
        return rejectWithValue('Invalid response data');
      }
    } catch (err) {
      console.error('Error logging in:', err);
      return rejectWithValue(err.response?.data || 'An error occurred');
    }
  }
);

const facultyHODAdminSlice = createSlice({
  name: 'facultyHODAdmin',
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logoutUser } = facultyHODAdminSlice.actions;
export default facultyHODAdminSlice.reducer;
