import { useCoinbaseWallet, useMetamask } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useWalletConnector } from "../context/WalletConnectionContext";
import { Alert, Box, Button, Paper, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { APP_CHAIN } from "../config/blockchain";

const Home: NextPage = () => {
  const { isWalletConnected, isWalletConnectionLoading } = useWalletConnector();
  const router = useRouter();
  const connectMetamask = useMetamask();
  const connectCoinbaseWallet = useCoinbaseWallet();
  const [activeConnector, setActiveConnector] = useState<string | null>(null);
  const [connectError, setConnectError] = useState<string | null>(null);

  const handleConnect = async (
    connectorName: string,
    connect: (options?: { chainId?: number; projectId?: string }) => Promise<void>,
  ) => {
    setConnectError(null);
    setActiveConnector(connectorName);

    try {
      await connect({ chainId: APP_CHAIN.chainId });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to connect wallet.";
      setConnectError(message);
    } finally {
      setActiveConnector(null);
    }
  };


  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if (isWalletConnected && !isWalletConnectionLoading && router.asPath !== '/dashboard') {
      router.replace('/dashboard')
    }
  }, [isWalletConnected, isWalletConnectionLoading, router])


  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 3,
        py: 6,
        background: 'radial-gradient(circle at top, rgba(255, 193, 7, 0.18), transparent 40%), linear-gradient(180deg, #f9fafb 0%, #eef2ff 100%)',
      }}
    >
      {!isWalletConnected && (
        <Paper elevation={10} sx={{ width: '100%', maxWidth: 560, p: { xs: 3, sm: 5 }, borderRadius: 4 }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="overline" sx={{ letterSpacing: 3, color: 'text.secondary' }}>
                Decentralized Voting System
              </Typography>
              <Typography variant="h3" fontWeight={800} sx={{ mt: 1 }}>
                Login with a supported wallet
              </Typography>
              <Typography sx={{ mt: 1, color: 'text.secondary' }}>
                Use MetaMask or Coinbase Wallet. The app now skips the generic extension picker,
                which avoids the Phantom service worker failure in the browser.
              </Typography>
            </Box>

            <Stack spacing={1.5}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                disabled={activeConnector !== null}
                onClick={() => handleConnect('metamask', connectMetamask)}
              >
                {activeConnector === 'metamask' ? 'Connecting to MetaMask...' : 'Connect MetaMask'}
              </Button>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                disabled={activeConnector !== null}
                onClick={() => handleConnect('coinbase', connectCoinbaseWallet)}
              >
                {activeConnector === 'coinbase' ? 'Connecting to Coinbase Wallet...' : 'Connect Coinbase Wallet'}
              </Button>
            </Stack>

            {connectError && <Alert severity="error">{connectError}</Alert>}

            <Box sx={{ display: 'grid', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Supported wallets: MetaMask and Coinbase Wallet.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                If a wallet extension is stuck, restart the extension and try again.
              </Typography>
            </Box>
          </Stack>
        </Paper>
      )}
    </Box>
  );
};

export default Home;
