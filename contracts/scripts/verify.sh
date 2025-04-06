#/bin/sh
# verify on zircuit
# forge verify-contract --verifier-url https://explorer.garfield-testnet.zircuit.com/api/contractVerifyHardhat 0x6Cc0A879a4c59fd18553FE16CEb417652a39Afc5 CrowderaToken  --root . --etherscan-api-key FDAE1A6B127CC89DD136E778C96832DB0E
# verify on flow
forge verify-contract --rpc-url https://testnet.evm.nodes.onflow.org/ \
    --verifier blockscout \
    --verifier-url https://evm-testnet.flowscan.io/api \
    0x2Ba069A7651904B4ABD9E8F6ff180a390530dC5F \
    CrowderaToken
