"use client"
import React from 'react'
import { persistor, store } from '@/store'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider as ReduxProvider } from 'react-redux'
import { ThemeProvider } from '@/context/ThemeContext'
import { SidebarProvider } from '@/context/SidebarContext'

const AppProvider: React.FC<React.PropsWithChildren<object>> = ({ children }) => {
    return (
        <ReduxProvider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <ThemeProvider>
                    <SidebarProvider>
                        {children}
                    </SidebarProvider>
                </ThemeProvider>
            </PersistGate>
        </ReduxProvider>
    )
}

export default AppProvider