const calculateNextTurn = (reverseTurn, skipTurn, currentTurn, numPlayers) => {
  console.log(reverseTurn, skipTurn, currentTurn, numPlayers);
    if (reverseTurn) {
        return (currentTurn - 1 + numPlayers) % numPlayers;
    } else if (skipTurn) {
        return (currentTurn + 2) % numPlayers;
    } else {
        return (currentTurn + 1) % numPlayers;
    }
};

export default calculateNextTurn;
