// tempAuthSlice.ts
import { createSlice } from "@reduxjs/toolkit";

const tempAuthSlice = createSlice({
  name: "tempAuth",
  initialState: { email: "", password: "" },
  reducers: {
    setTempAuth: (state, action) => {
      state.email = action.payload.email;
      state.password = action.payload.password;
    },
    clearTempAuth: (state) => {
      state.email = "";
      state.password = "";
    },
  },
});

export const { setTempAuth, clearTempAuth } = tempAuthSlice.actions;
export default tempAuthSlice.reducer;
