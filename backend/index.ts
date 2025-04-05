import express from 'express'
import {walletClient} from './relay-config'
import {abi} from './contract'
import { privateKeyToAccount, type Address } from 'viem/accounts'
import type { Request, Response } from 'express';
const app = express();

const eoa = privateKeyToAccount('0x1154c5a6f0ecd6d3343d3298fa9a9e8fb11510fe0e6800c1cdc43096b9c084c7')

// const  hash1 = await walletClient.writeContract({
//     abi,
//     address: eoa.address,
//     functionName: 'ping',
// })


app.get('/designate-address', async (req:Request, res) =>{
    const {contractAddress} = req.query
    
    const authorized = await walletClient.signAuthorization({
        account: eoa,
        contractAddress: contractAddress as Address ,
    })

    console.log("Authorize", authorized)

    const txHash = await walletClient.writeContract({
        abi,
        address: eoa.address,
        authorizationList: [authorized],
        functionName: 'initialize',
    })
    res.json({ txHash })
})


app.listen(3000, () => {
    console.log(`started on 3000`)
})