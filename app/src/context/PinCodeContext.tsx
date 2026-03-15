import { createContext, useContext, useEffect, useState } from 'react';
import { storage } from '../utils/storage';

type E_STATE = 'loading' | 'unlocked' | 'locked' | 'noPin';

interface PinCodeContextType {
    pinCode: string;
    state: E_STATE;
    setState: (state: E_STATE) => void;
    setPinCode: (code: string) => void;
    removePinCode: () => void;
}

const PinCodeContext = createContext<PinCodeContextType | undefined>(undefined);

export function PinCodeProvider({ children }: { children: React.ReactNode }) {
    const [pinCode, setPinCode] = useState<string>('');
    const [state, setState] = useState<E_STATE>('loading');

    useEffect(() => {
        loadPinCode();
    }, []);

    const loadPinCode = async () => {
        const savedPinCode = await storage.getPin();
        if (savedPinCode) {
            setPinCode(savedPinCode);
            setState('locked');
        } else {
            setPinCode('');
            setState('noPin');
        }
    };

    const setPinCodeHandler = async (code: string) => {
        setPinCode(code);
        await storage.setPin(code);
        setState('locked');
    };

    const removePinCode = async () => {
        setPinCode('');
        await storage.removePin();
        setState('noPin');
    };

    return (
        <PinCodeContext.Provider value={{
            pinCode,
            setPinCode: setPinCodeHandler,
            removePinCode,
            state,
            setState,
        }}>
            {children}
        </PinCodeContext.Provider>
    );
}

export function usePinCode() {
    const context = useContext(PinCodeContext);
    if (context === undefined) {
        throw new Error('usePinCode must be used within a PinCodeProvider');
    }
    return context;
}
