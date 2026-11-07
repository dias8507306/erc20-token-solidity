# EduToken (EDU): ERC-20 token in Solidity

A minimal ERC-20 token built on OpenZeppelin, with a Hardhat script that runs the whole lab scenario on a local chain (deploy, transfer, approve, transferFrom, allowance check) and unit tests for the same flow.

## Features

- `EduToken` (`EDU`, 18 decimals): OpenZeppelin `ERC20` with an initial supply of **4000 EDU** minted to the deployer
- `scripts/lab.js` runs the lab scenario step by step on the in-process Hardhat network:
  1. deploy, then print `name / symbol / decimals / totalSupply / balances`
  2. `transfer(B, 400)` from A
  3. `approve(B, 200)` from A
  4. `transferFrom(A, B, 80)` sent by B (allowance drops to 120)
  5. limit check: `transferFrom(A, B, 121)` reverts with `ERC20InsufficientAllowance`; total supply stays the same
- `test/EduToken.test.js` checks minting, `Transfer` events, approve/transferFrom and the custom-error revert (Mocha + Chai)

## Tech stack

Solidity 0.8.24 · OpenZeppelin Contracts 5 · Hardhat 2 · ethers.js v6 · Mocha / Chai

## Project structure

```
contracts/EduToken.sol      the token
scripts/lab.js              lab scenario (deploy -> transfer -> approve -> transferFrom -> revert)
test/EduToken.test.js       unit tests
hardhat.config.js
```

## How to run

```bash
npm install
npx hardhat test                    # 3 passing
npx hardhat run scripts/lab.js      # prints the full scenario
```

Everything runs on the built-in Hardhat network: no wallet, RPC URL or private key is needed.

> All data in this repository is randomly generated; brand names are anonymized.

Author: Dias Ayazbay (Blockchain course, Lab 8, variant 4).

## Кратко (RU)

Простой ERC-20 токен (EduToken, EDU) на базе OpenZeppelin. Начальная эмиссия 4000 EDU уходит аккаунту, задеплоившему контракт.
`scripts/lab.js` выполняет все шаги лабораторной в локальной сети Hardhat: transfer, approve, transferFrom и revert при превышении лимита.
Для тестов достаточно `npm install` и `npx hardhat test`.
