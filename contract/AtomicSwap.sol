pragma solidity ^0.4.19;

contract AtomicSwap {
    
    struct swap{
        address fromUser;
        address toUser;
        uint256 amount;
        uint256 keepTime;
        bytes32 secretHash;
    }
    mapping(bytes32 => swap) public swapBooks;
    bytes32[] public swapIdBook;

    function createAtomicSwap(
        address _toUser, 
        uint256 _keepTime, 
        bytes32 _secretHash
    )
        public payable returns(bytes32) 
    {
        require(msg.value > 0);
        bytes32 swapId = sha256(sha256(msg.sender, _toUser, msg.value), block.timestamp, _secretHash);
        swapBooks[swapId].fromUser = msg.sender;
        swapBooks[swapId].toUser = _toUser;
        swapBooks[swapId].amount = msg.value;
        swapBooks[swapId].keepTime = block.timestamp + _keepTime;
        swapBooks[swapId].secretHash = _secretHash;
        swapIdBook.push(swapId);
        return swapId;
    }

    function getAtomicSwapBook(
        bytes32 _swapId
    )
        public returns(address, address, uint256, uint256, bytes32)
    {
        return (
            swapBooks[_swapId].fromUser, 
            swapBooks[_swapId].toUser, 
            swapBooks[_swapId].amount,
            swapBooks[_swapId].keepTime,
            swapBooks[_swapId].secretHash
        );
    }

    function withdraw(bytes32 _swapId, string _secretPlain) public {
        if(
            swapBooks[_swapId].secretHash == sha256(_secretPlain) && 
            swapBooks[_swapId].amount > 0 && 
            swapBooks[_swapId].toUser == msg.sender &&
            swapBooks[_swapId].keepTime <= block.timestamp
        ){
            uint256 amountTemp = swapBooks[_swapId].amount;
            swapBooks[_swapId].amount = 0;
            dismissSwapIdBook(_swapId);
            msg.sender.transfer(amountTemp);
        } 
        else if(
            swapBooks[_swapId].secretHash == sha256(_secretPlain) && 
            swapBooks[_swapId].amount > 0 && 
            swapBooks[_swapId].fromUser == msg.sender &&
            swapBooks[_swapId].keepTime > block.timestamp
        ){
            amountTemp = swapBooks[_swapId].amount;
            swapBooks[_swapId].amount = 0;
            dismissSwapIdBook(_swapId);
            msg.sender.transfer(amountTemp);
        }
    }

    function dismissSwapIdBook(bytes32 _swapId) internal {
        for(uint i = 0; i < swapIdBook.length; i++) {
            if(swapIdBook[i] == _swapId) {
                swapIdBook[i] = swapIdBook[swapIdBook.length - 1];
                swapIdBook.length -= 1;
            }
        }
    }
}