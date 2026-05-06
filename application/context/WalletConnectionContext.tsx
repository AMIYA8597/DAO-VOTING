import { useAddress, useConnectionStatus } from "@thirdweb-dev/react";
import { createContext, useContext, useEffect, useState } from "react";
import { APP_OWNER_ADDRESS } from "../config/blockchain";

type WalletConnectorContextValue = {
    isWalletConnected: boolean;
    isAdminWalletConnected: boolean;
    isWalletConnectionLoading: boolean;
};

export const WalletConnectorContext = createContext<WalletConnectorContextValue | undefined>(undefined);

export const useWalletConnector = () => {
    const context = useContext(WalletConnectorContext);

    if (!context) {
        throw new Error('useWalletConnector must be used within WalletContextProvider');
    }

    return context;
};

interface ChildrenType {
    children: React.ReactNode;
}


export const WalletContextProvider = ({ children }: ChildrenType) => {
    const [isWalletConnected, setWalletStatus] = useState(false);
    const [isAdminWalletConnected, setAdminWalletStatus] = useState(false);
    const [isWalletConnectionLoading, setWalletConnectionLoading] = useState(true);

    const connectionStatus = useConnectionStatus();
    const address = useAddress();

    useEffect(() => {
        if (connectionStatus === 'connecting' || connectionStatus === 'unknown') {
            setWalletConnectionLoading(true);
            return;
        }

        setWalletConnectionLoading(false);
        setWalletStatus(Boolean(address));
    }, [connectionStatus, address])


    useEffect(() => {
        if (address && APP_OWNER_ADDRESS) {
            setAdminWalletStatus(APP_OWNER_ADDRESS.toLowerCase() === address.toLowerCase());
            return;
        }

        setAdminWalletStatus(false);
    }, [address, APP_OWNER_ADDRESS])


    return (
        <WalletConnectorContext.Provider
            value={{
                isWalletConnected,
                isAdminWalletConnected,
                isWalletConnectionLoading,
            }}>
            {children}
        </WalletConnectorContext.Provider>
    )

}
