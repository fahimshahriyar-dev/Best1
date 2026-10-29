import React, { ReactNode } from 'react'
import { store } from '../redux/store';
import { Provider } from 'react-redux';

type providerProps = {
    children: ReactNode;
}

export function Providers({children}: providerProps) {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}