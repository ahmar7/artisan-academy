import { createSlice } from '@reduxjs/toolkit'


const initialState = {
 
  token: null,

  userData: {
    _id: "",
    name: "",
    email: "",
    profile:"",
    role: ""
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserDetails(state, { payload }) {
      state.token = payload.token
      state.userData = payload.userData
    },
    setProfile(state, { payload }) {
      state.userData.profile = payload.profile
     
    },
  }
})

export const {
  setUserDetails,
  setProfile
  
} = authSlice.actions

export default authSlice.reducer
