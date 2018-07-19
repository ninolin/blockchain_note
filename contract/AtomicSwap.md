# Atomic Swap

## Intro

this contract use atomic swap to support multi ethereums' ether exchange.

## How to use

Bob want to use chainA's ether to change chainB's ether and Paul want to use chainB's ether to change chainA's ether.

* Bob call chainA's createAtomicSwap and send three arguments: 
    * _toUser: Paul's chainA address.
    * _keepTime: if Paul not withdraw his chainA's ether in this time then Bob can get back his chainA's ether.
    * __secretHash: Bob create a sha256 text like 'hello' => '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824' and talk to Paul.

* Paul call chainB's createAtomicSwap and send three arguments: 
    * _toUser: Bob's chainB address.
    * _keepTime: if Bob not withdraw his chainA's ether in this time then Paul can get back his chainA's ether.
    * _secretHash: sha256 text get from Bob.

* Bob call chainB's withdraw to get Paul's ether and Paul see the event.

* Pual see the sha256 text's plain use the event and call chainA's withdraw to get Bob's ether.


