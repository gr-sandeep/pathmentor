import React, { useState, useContext, createContext, useEffect } from "react";
import secureLocalStorage from "react-secure-storage";

const Context = createContext()

export const ContextProvider = ({ children }) => {
    const [appTheme, setAppTheme] = useState("light")

    useEffect(() => {
        const theme = secureLocalStorage.getItem('theme')
        setAppTheme(theme)
    }, [])

    const toggleTheme = () => {
        if (appTheme == 'light') {
            setAppTheme('dark')
            secureLocalStorage.setItem('theme', 'dark')
            document.documentElement.classList.add('dark');
        } else {
            setAppTheme('light')
            secureLocalStorage.setItem('theme', 'light')
            document.documentElement.classList.remove('dark');
        }
    }

    return (
        <Context.Provider value={{ appTheme, toggleTheme }}>
            {children}
        </Context.Provider>
    )
}

export const PathmentorContext = () => {
    return useContext(Context)
}