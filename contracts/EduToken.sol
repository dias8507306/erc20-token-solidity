// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title EduToken (EDU) — №8 зертханалық жұмыс, 4-нұсқа
/// @notice Оқу платформасындағы белсенділік үшін берілетін бонус-токен.
/// Бастапқы эмиссия: 4000 EDU, толығымен контрактты орналастырған аккаунтқа (A) беріледі.
contract EduToken is ERC20 {
    uint256 public constant INITIAL_SUPPLY = 4000;

    constructor() ERC20("Edu Token", "EDU") {
        // decimals() = 18, сондықтан 4000 * 10^18 ең кіші бірлік шығарылады
        _mint(msg.sender, INITIAL_SUPPLY * 10 ** decimals());
    }
}
