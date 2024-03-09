import { createContext, useContext, useState } from 'react'

export const Context = createContext({})

export function ContextProvider({children, context}) {
  const parentContext = useAppContext();

  const [data, setData] = useState({...parentContext, ...context});

  const updateContext = newContext => {
    setData({...data, ...newContext})
  }

  return <Context.Provider value={{...data, updateContext}}>
    {children}
  </Context.Provider>
}

export const useAppContext = () => {
  return useContext(Context)
}