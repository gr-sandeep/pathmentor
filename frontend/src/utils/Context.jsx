import React, { useState, useContext, createContext } from "react";

const Context = createContext()

export const ContextProvider = ({ children }) => {
    const [appTheme, setAppTheme] = useState("light")
    return (
        <Context.Provider value={{ appTheme, setAppTheme }}>
            {children}
        </Context.Provider>
    )
}

export const PathmentorContext = () => {
    return useContext(Context)
}