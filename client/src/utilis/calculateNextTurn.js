const calculateNextTurn = (isReversed, skipTurn, currentTurn, numPlayers) => {
    console.log('isreversed',isReversed);
    if (isReversed) {
        if (skipTurn) {
            // 0 + 2 %3 =>2
            // 1+ 2%3 =>0
            // 2 + 2%3 =>1
          
            return (((currentTurn + numPlayers - 1) % numPlayers) - 1) % numPlayers;
            
        } else {
            return (currentTurn + (numPlayers - 1)) % numPlayers;
        }
    } else {
        if (skipTurn) {
            return (currentTurn + 2) % numPlayers;
        } else {
            return (currentTurn + 1) % numPlayers;
        }
    }
};

export default calculateNextTurn;
