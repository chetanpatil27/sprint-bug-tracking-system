import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    isAuthenticated: boolean;
    user: null | object;
}

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthState(state, action: PayloadAction<Partial<AuthState>>) {
            Object.entries(action.payload).forEach(([key, value]) => {
                if (key in state) {
                    (state as any)[key as keyof AuthState] = value;
                }
            });
        },
    },
});

export const { setAuthState } = authSlice.actions;
export default authSlice.reducer;