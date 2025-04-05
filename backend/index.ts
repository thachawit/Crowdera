import { walletClient } from './relay-config'
import { abi } from './contract'
import { privateKeyToAccount, type Address } from 'viem/accounts'
import type { Request, Response } from 'express';
import type { Hex } from 'viem'
import { parseUnits, serializeAuthorizationList } from 'viem/utils';
const express = require('express')
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());
const eoa = privateKeyToAccount('0x1154c5a6f0ecd6d3343d3298fa9a9e8fb11510fe0e6800c1cdc43096b9c084c7')

// const  hash1 = await walletClient.writeContract({
//     abi,
//     address: eoa.address,
//     functionName: 'ping',
// })



interface SignedPayload {
  signedTx: Hex
}
type TxProcessingError = Error & {
  reason?:string
}

interface Authorization{
  chainId: number;
    nonce: number;
    r: Hex;
    s: Hex;
    v: number;
    address: Address;
    yParity?: number;
}

interface AuthorizationFormatted{
  chainId: number;
    nonce: number;
    r: Hex;
    s: Hex;
    v: bigint;
    address: Address;
    yParity?: number;
}


app.post('/submit-tx', async (req: Request, res) => {
  try{
    const {authorization} = req.body 
    console.log("bigint 1:",BigInt(1))
    console.log(BigInt(authorization.v))
    const authorizationFormatted: AuthorizationFormatted = {
      chainId: authorization.chainId,
      nonce: authorization.nonce,
      r: authorization.r,
      s: authorization.s,
      v: BigInt(authorization.v),
      address: authorization.address,
      yParity: authorization.yParity
    }
    const txHash = await walletClient.writeContract({
      abi,
      address: eoa.address,
      authorizationList: [authorizationFormatted],
      functionName: 'initialize',
    })
    res.json({ txHash })
  } catch (error){
    const txError = error as TxProcessingError
    console.error("Transaction error occured: ", txError)
    res.status(500).json({ error: txError.message || 'Failed to boadcast transaction'})
  }
})

app.listen(3000, () => console.log( 'API running on 3000 '))

