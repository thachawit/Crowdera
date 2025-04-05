# Crowdera: Anonymous Funding Event Platform

![Donation Platform with Maximum Cap](./cover.png)

> **A transparent donation platform that prevents over-funding of causes by enforcing funding caps on Zircuit and rewards donors with commemorative NFT badges on Flow.**

## Table of Contents

- [Overview](#overview)
- [Integration](#integration)
- [Team](#team)
- [Setup](#setup)
- [Experience & Feedback](#experience--feedback)
- [Demo](#demo)
- [Future Roadmap](#future-roadmap)
- [Repository Structure](#repository-structure)

## Overview

Crowdera addresses a critical issue in Thailand's donation landscape. We've all seen dramatic stories of people in need that flood social media feeds, generating overwhelming donation responses that often exceed actual needs. This can transform genuine assistance into problematic wealth accumulation for recipients.

Our platform enables transparent event and cause funding with clearly defined goals. By setting funding caps and automatically enforcing them, we ensure donations match actual needs without excess. The system provides real-time updates on campaign progress and stops accepting donations once goals are met, preventing the problem of over-donation while rewarding donors with commemorative NFTs.

## Integration

### Zircuit Integration

We integrated Zircuit to implement our secure donation platform:

- Used Zircuit for the primary smart contract deployment where campaign creation and donations occur
- Created smart contract logic that automatically stops accepting donations once a campaign's funding goal is reached
- Leveraged Zircuit's blockchain for seamless wallet interactions, providing a smooth user experience
- Integrated a refund mechanism for cases where funds need to be returned

Our donation flow works as follows:

1. User selects a campaign and donation amount
2. System processes the donation on Zircuit
3. Smart contract accepts the donation and updates the campaign status
4. If the donation would exceed the campaign's goal, it automatically accepts only what's needed and refunds the rest

### Flow Integration

We utilized the Flow blockchain to create and distribute commemorative NFT badges to donors:

- Implemented a Flow smart contract that mints unique NFT badges for successful donations
- Created a secure bridge between Zircuit (for donations) and Flow (for NFT rewards)
- Used Flow's efficient resource-oriented programming model to create a gas-efficient NFT minting process
- Implemented various badge designs that reflect different donation levels and campaigns

The Flow integration works as follows:

1. When a donation is successfully processed on Zircuit, a claim token is generated
2. The donor can use this token to claim their NFT badge on Flow
3. The badge serves as both a commemoration of their donation and proof of participation
4. Each badge contains metadata about the campaign and donation tier

## Team

| Name                 | Role                          | Background                                             | Social Handles                                                                    |
| -------------------- | ----------------------------- | ------------------------------------------------------ | --------------------------------------------------------------------------------- |
| Pawee Tantivasdakarn | Lead Smart Contract Developer | Blockchain developer with 3+ years experience          | [GitHub](https://github.com/paweenthx) / [Twitter](https://twitter.com/paweenthx) |
| Chirayu Charoenyos   | Frontend Developer            | React/NextJS specialist, Computer Science student      | [GitHub](https://github.com/chiracyou) / [Twitter](https://twitter.com/chiracyou) |
| Thawinwit N.         | Backend Integration           | Golang developer with blockchain integration expertise | [GitHub](https://github.com/thawinwit) / [Twitter](https://twitter.com/thawinwit) |

## Setup

### Setup

```bash
# Clone the repository
git clone https://github.com/paweenthx/crowdera.git
cd crowdera

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your configuration settings
```

### Development

```bash
# Start the development server
npm run dev

# The app will be available at http://localhost:3000
```

### Deployment

```bash
# Build the project
npm run build

# Deploy the web application
npm run deploy
```

## Experience & Feedback

### Zircuit Experience

Working with Zircuit for our donation platform was a rewarding experience:

**Wins:**

- The blockchain provided reliable transaction recording and verification
- Documentation was clear on implementing smart contracts
- The developer community was helpful when we encountered integration questions
- Smart contract implementation was flexible enough to support our funding cap feature

**Challenges:**

- Initial setup required learning the platform's specifics
- Testing smart contracts thoroughly required building custom test utilities
- Some edge cases required additional error handling
- Implementing the partial donation acceptance/refund mechanism required creative solutions

Overall, Zircuit provided a solid foundation for our donation system and would be recommended for projects requiring strong functionality with good UX.

### Flow Experience

Integrating with Flow blockchain for NFT badges was straightforward and efficient:

**Wins:**

- Cadence's resource-oriented programming model made implementing NFT logic intuitive
- Flow's transaction model allowed for efficient batch minting of NFTs
- Low transaction fees made issuing badges to all donors economically viable
- Strong documentation and examples accelerated our development process
- The Flow community provided helpful support when we encountered integration challenges

**Challenges:**

- Bridging between Zircuit and Flow required careful design
- Ensuring a smooth cross-chain user experience required extensive testing

Flow proved to be an excellent choice for our NFT badge system due to its efficiency, low costs, and developer-friendly environment.

## Demo

Our demo showcases the complete user journey through the Crowdera platform:

1. **Campaign Creation**: Watch an organizer create a new funding campaign with a specific goal
2. **Donation Process**: See how donors can contribute to causes they care about
3. **Funding Cap in Action**: Witness the system automatically handle a donation that would exceed the funding goal
4. **NFT Badge Minting**: Observe how donors receive their commemorative NFT badges on Flow
5. **Badge Collection**: See the different badge designs and how they showcase participation
6. **Transparent Progress**: View real-time updates of campaign progress
7. **Fund Withdrawal**: See how organizers can withdraw funds once the goal is met

[![Project Demo](https://img.youtube.com/vi/YOUR_VIDEO_ID/0.jpg)](https://youtu.be/YOUR_VIDEO_ID)

_Click the image above to watch our demo video_

Our demo highlights the key innovations:

- Automatic funding cap enforcement
- Cross-chain NFT badge rewards on Flow
- Badge claiming mechanism
- Smooth user experience through Zircuit's blockchain

## Future Roadmap

While our hackathon submission demonstrates the core functionality, we plan to expand the platform with the following features:

1. **Enhanced NFT Badges**: Implement tiered and evolving badges that change based on donation history
2. **Verification System**: Implement a KYC system for campaign organizers to increase trust
3. **Multi-Currency Support**: Accept donations in various tokens and stablecoins
4. **Campaign Categories**: Add categorization for different types of donation needs (medical, education, disaster relief)
5. **Mobile App**: Develop a dedicated mobile application for easier access
6. **Integration with Traditional Payment Methods**: Allow donations via credit cards and bank transfers
7. **Decentralized Governance**: Implement a community voting system for dispute resolution

## Repository Structure

```
crowdera/
├── contracts/
│   ├── zircuit/                   # Zircuit smart contracts
│   │   ├── Campaign.sol           # Main campaign contract
│   │   └── interfaces/            # Contract interfaces
│   └── flow/                      # Flow smart contracts
│       ├── DonationBadge.cdc      # NFT badge contract
│       └── BadgeClaiming.cdc      # Badge claiming
├── frontend/                      # Frontend application
│   ├── src/
│   │   ├── components/            # React components
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── pages/                 # Page components
│   │   └── utils/                 # Utility functions
│   └── public/                    # Static assets
├── backend/                       # Backend services
│   ├── api/                       # API routes
│   └── services/
│       ├── zircuit.js             # Zircuit integration
│       └── flow.js                # Flow integration
├── docs/                          # Documentation
│   └── flow.md                    # Flow integration docs
└── README.md                      # This file
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
