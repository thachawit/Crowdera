import {createWalletClient, http} from 'viem'
import {sepolia, zircuitGarfieldTestnet} from 'viem/chains'
import {privateKeyToAccount} from 'viem/accounts'




// TODO:create api to receives relayAddress
export const relayAddress =  privateKeyToAccount('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80')


export const walletClient = createWalletClient({
    account: relayAddress,
    chain: zircuitGarfieldTestnet,
    transport: http('http://localhost:8545'),
})

