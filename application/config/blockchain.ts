import { Sepolia } from "@thirdweb-dev/chains";

const FALLBACK_NETWORK = "sepolia";

const networkName = (process.env.NEXT_PUBLIC_APP_NETWORK ?? FALLBACK_NETWORK).toLowerCase();

const networkMap = {
    sepolia: Sepolia,
} as const;

export const APP_CHAIN = networkMap[networkName as keyof typeof networkMap] ?? Sepolia;
export const APP_CHAIN_ID = APP_CHAIN.chainId;
export const APP_CHAIN_NAME = APP_CHAIN.name;
export const APP_CONTRACT_ADDRESS =
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ??
    process.env.NEXT_PUBLIC_CONTRACT_KEY ??
    "";
export const APP_OWNER_ADDRESS = process.env.NEXT_PUBLIC_OWNER_ADDRESS ?? "";