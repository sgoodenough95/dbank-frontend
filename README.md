<div align="center">
<h1><strong> Profile.io Front-end </strong></h1>

## Description

Front-end for Profile.io's DIF hackathon submission that builds upon a minimalist Web3 boilerplate.

Supports MetaMask, WalletConnect and Coinbase Wallet login methods. WalletConnect provides a gateway for Safe Smart Contract Accounts to execute transactions and sign messages.

Users can link a sample DWN server to their Ethereum account. A dedicated Credit Checker DWN is responsible for issuing the User a Credit Score Credential. Once issued, the user can request a loan - the details for which, such as amount borrowable and interest - is dependent on their credit score record.

The dBank app presents a window into the future where users can take out unsecured loans, using their traditional credit information, in a manner that is decentralised, privacy-preserving, and secure - made possible by DWNs and Decentralised Identtity!

## Known Bugs

- Currently the user interface cannot detect when a Safe transaction has finished executing. This is a minor issue and there are some fixes that yet to be implemented.

## Built With

- [![React][react.js]][react-url]
- [![typescript]][typescript-url]
- [![AntDesign]][antdesign-url]
- [![web3react]][web3react-url]
- [![prettier]][prettier-url]
- [![ESLint]][eslint-url]

## Installation

### Make sure you have the following ready:

- [node.js](https://nodejs.org/) installed (developped on LTS v18)
- [typescript](https://www.typescriptlang.org/) installed (developped on v5.2.2)
- [yarn](https://yarnpkg.com/) installed
- [MetaMask](https://metamask.io/) (or any web3 compatible wallet) installed in your browser

### Once your config is ready, create a new repo, open your favorite code editor, and clone the repo with the following cmd:

```bash
git clone https://gitlab.com/tabled/profileio-frontend.git .
```

### Install all package dependancies by running:

```bash
yarn install
```

<b>IMPORTANT: Double check your package.json to make sure you've installed the exact same version for all @web3-react packages. Since the version 8+ is still in beta, it may not be automatically installed.</b>

### Add your API keys in the .env file:

Create a .env file at the root of your project and copy the content of the .env.example file into it. Then, fill in the following variables:

```js
REACT_APP_INFURA_KEY = "your API key here";
...
REACT_APP_WALLETCONNECT_PROJECT_ID = "Project id needed for WalletConnect v2";
```

### start the web3-boilerplate:

```bash
yarn start
```

## Features:

- [x] Web3 Wallet (Metamask / Wallet connect / Coinbase)
- [x] Chain selector
- [x] Wallet balance
- [x] Sign Messages & Transfer Native
- [x] Dark mode support
- [x] Hook to query user's Token Balances
- [ ] Hook to query user's NFTs

<!-- MARKDOWN LINKS & IMAGES -->

[react.js]: https://img.shields.io/badge/React_v18.2-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[react-url]: https://reactjs.org/
[typescript]: https://img.shields.io/badge/typescript_v5.2.2-375BD2?style=for-the-badge&logo=typescript&logoColor=61DAFB
[typescript-url]: https://www.typescriptlang.org/
[web3react]: https://img.shields.io/badge/@web3react_v8.2-006600?style=for-the-badge&logo=web3-react&logoColor=4FC08D
[web3react-url]: https://github.com/Uniswap/web3react#readme
[antdesign]: https://img.shields.io/badge/AntDesign_v5.10.0-FF0000?style=for-the-badge&logo=AntDesign&logoColor=61DAFB
[antdesign-url]: https://ant.design/
[prettier]: https://img.shields.io/badge/Prettier-360D3A?style=for-the-badge&logo=Prettier&logoColor=61DAFB
[prettier-url]: https://prettier.io/
[eslint]: https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=ESLint&logoColor=61DAFB
[eslint-url]: https://eslint.org/
# dbank-frontend
