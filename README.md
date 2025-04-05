# ZK-Enhanced Event Funding Platform

![Anonymous Donations with Maximum Cap](./cover.png)

> **A privacy-preserving donation platform that prevents over-funding of causes by using zero-knowledge proofs on Zircuit with transparent goal tracking and MultiBaas deployment.**

## Table of Contents

- [Overview](#overview)
- [Integration](#integration)
- [Team](#team)
- [Setup & Testing](#setup--testing)
- [Experience & Feedback](#experience--feedback)
- [Demo](#demo)
- [Repository Structure](#repository-structure)

## Overview

ZK-Enhanced Event Funding Platform addresses a critical issue in Thailand's donation landscape. We've all seen dramatic stories of people in need that flood social media feeds, generating overwhelming donation responses that often exceed actual needs. This can transform genuine assistance into problematic wealth accumulation for recipients.

Our platform enables transparent event and cause funding with privacy-preserving donations using zero-knowledge proofs. By setting clear funding goals and automatically enforcing donation caps, we ensure donations match actual needs without excess. The system provides real-time updates on campaign progress and stops accepting donations once goals are met, preventing the problem of over-donation while maintaining donor privacy.

## Integration

### Zircuit Integration

We integrated Zircuit's EIP-7702 (account abstraction) to implement zero-knowledge proofs for private donations:

- Used Zircuit for the primary smart contract deployment where campaign creation and donations occur
- Implemented ZK-secured donations that hide donor identities while proving donation validity
- Created smart contract logic that automatically stops accepting donations once a campaign's funding goal is reached
- Leveraged Zircuit's account abstraction for seamless wallet interactions, providing a smooth user experience while preserving privacy
- Integrated a refund mechanism for cases where funds need to be returned, maintaining the same privacy guarantees

### MultiBaas Integration

We utilized Curvegrid's MultiBaas for deployment and management of our smart contracts:

- Deployed and managed our core campaign smart contracts through MultiBaas
- Used MultiBaas API for contract interaction, particularly for the campaign creation and fund withdrawal functions
- Leveraged MultiBaas's simplified deployment process to quickly iterate on our contracts during development
- Utilized MultiBaas's contract management features to monitor and debug transactions
- Implemented real-time notification system for campaign status updates using MultiBaas webhooks

## Team

Introduce your team members and their backgrounds/roles in the project.

| Name                 | Role                          | Background               | Social Handles                                                                  |
| -------------------- | ----------------------------- | ------------------------ | ------------------------------------------------------------------------------- |
| Pawee Tantivasdakarn | Lead Smart Contract Developer | Blockchain developer     | [GitHub](https://github.com/username) / [Twitter](https://twitter.com/username) |
| Chirayu Charoenyos   | Frontend Developer            | React,NextJS, cs student | [GitHub](https://github.com/username) / [Twitter](https://twitter.com/username) |
| Thawinwit N.         | Backend Integration           | Backend Golang developer | [GitHub](https://github.com/username) / [Twitter](https://twitter.com/username) |

## Setup & Testing

### Prerequisites

- Node.js v16+
- Docker
- MetaMask or compatible web3 wallet
- Access to MultiBaas platform

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/zk-event-funding.git
cd zk-event-funding

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your MultiBaas access credentials
```

### Running Tests

```bash
# Run the complete test suite
npm test

# Run tests for specific components
npm test -- -t "campaign creation"
npm test -- -t "zk donations"
npm test -- -t "funding cap"
```

### Local Development

```bash
# Start the development server
npm run dev

# The app will be available at http://localhost:3000
```

### Deployment

```bash
# Build the project
npm run build

# Deploy smart contracts using MultiBaas (requires configuration)
npm run deploy:contracts
```

## Experience & Feedback

### Zircuit Experience

Working with Zircuit and implementing EIP-7702 for our ZK-secured donations was a rewarding experience:

**Wins:**

- The account abstraction features provided a seamless UX while maintaining privacy
- Documentation was clear on implementing basic ZK proofs
- The developer community was helpful when we encountered integration questions
- The ZK implementation allowed us to create a donation system that preserves donor privacy while maintaining public transparency about funding progress
- Smart contract implementation was flexible enough to support our funding cap feature

**Challenges:**

- Initial setup of the ZK verification circuit had a steeper learning curve than expected
- Testing ZK proofs thoroughly required building custom test utilities
- Some edge cases in ZK verification required additional error handling
- Implementing the partial donation acceptance/refund mechanism while maintaining ZK privacy required creative solutions

Overall, Zircuit provided a solid foundation for our privacy-preserving donation system and would be recommended for projects requiring strong privacy guarantees with good UX.

### MultiBaas Experience

Curvegrid's MultiBaas significantly streamlined our deployment and contract management process:

**Wins:**

- The deployment process was straightforward and saved considerable development time
- Contract management interface made monitoring transactions and debugging easier
- API integration was well-documented and simple to implement
- The event monitoring capabilities helped us build a responsive UI that updates in real-time
- The ability to quickly deploy updated contracts during development accelerated our iteration cycles

**Challenges:**

- More advanced features required deeper familiarity with the platform
- Some custom functionality required workarounds
- Initial setup required coordination between team members for access

MultiBaas proved to be an excellent choice for rapid development during the hackathon, allowing us to focus on building core features rather than deployment logistics.

## Demo

[![Project Demo](demo_thumbnail_url_here)](your_video_url_here)

_Click the image above to watch our demo video_

Alternatively, you can view our [slide deck](slides_url_here).

## Repository Structure

```
zk-event-funding/
├── contracts/                     # Smart contracts
│   ├── Campaign.sol               # Main campaign contract
│   ├── ZKDonation.sol             # ZK donation implementation
│   └── interfaces/                # Contract interfaces
├── circuits/                      # ZK circuits for donation privacy
│   ├── donation.circom            # Donation verification circuit
│   └── scripts/                   # Circuit compilation scripts
├── tests/                         # Test files
│   ├── campaign.test.js           # Campaign contract tests
│   ├── zkDonation.test.js         # ZK donation tests
│   └── fundingCap.test.js         # Funding cap tests
├── frontend/                      # Frontend application
│   ├── src/
│   │   ├── components/            # React components
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── pages/                 # Page components
│   │   └── utils/                 # Utility functions
│   └── public/                    # Static assets
├── backend/                       # Backend services
│   ├── api/                       # API routes
│   └── services/                  # Service integrations
│       ├── multiBaas.js           # MultiBaas integration
│       └── zircuit.js             # Zircuit integration
├── scripts/                       # Deployment and utility scripts
│   ├── deploy.js                  # Contract deployment script
│   └── verify.js                  # ZK verification script
├── docs/                          # Documentation
│   ├── api.md                     # API documentation
│   └── zkp.md                     # ZK proof documentation
└── README.md                      # This file
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
