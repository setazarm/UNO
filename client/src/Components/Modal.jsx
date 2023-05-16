import React, { useState, useContext } from "react";
import { MyContext } from "../context/context";
import { socket } from "../socket.js";
import calculateNextTurn from "../utilis/calculateNextTurn";


const Modal = ({setShowPopup, skipTurn, reverseTurn, drawCard}) => {
 
  const { setColor, setDiscardpile, discardpile, user, room, playerCards, deck, turn } = useContext(MyContext);

  const handleColorSelect = (event) => {
    event.preventDefault();
    const color = event.target.value;
    setColor(color);
    const updatedDiscardpile = [...discardpile];
    const topCardIndex = updatedDiscardpile.length - 1;
    updatedDiscardpile[topCardIndex] = { ...updatedDiscardpile[topCardIndex], color };
  
    setDiscardpile(updatedDiscardpile);

   let { cards, pile } = drawCard(1, deck.slice(room?.players.length * 7));
    socket.emit("update_game", {
      userId: user._id,
      roomId: room._id,
      gameData: {
          ...playerCards,
          drawpile: pile,
          discardpile: updatedDiscardpile,
          turn: calculateNextTurn(reverseTurn, skipTurn, turn, room.players.length),
          isUno: false,
      },
  });
    setShowPopup(false);
  };

  return (
    <div>
      
        <div className="popup">
          <h3>Wildcard Played!</h3>
          <p>Choose a color:</p>
          <form className="color-options">
            <label>
              <input
                type="radio"
                name="color"
                value="R"
                onClick={handleColorSelect}
              />
              Red
            </label>
            <label>
              <input
                type="radio"
                name="color"
                value="B"
                onClick={handleColorSelect}
              />
              Blue
            </label>
            <label>
              <input
                type="radio"
                name="color"
                value="G"
                onClick={handleColorSelect}
              />
              Green
            </label>
            <label>
              <input
                type="radio"
                name="color"
                value="Y"
                onClick={handleColorSelect}
              />
              Yellow
            </label>
            <button type="submit">Choose</button>
          </form>
        </div>
     
    </div>
  );
};

export default Modal;