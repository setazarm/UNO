import React, { useState, useContext } from "react";
import { MyContext } from "../context/context";
import { socket } from "../socket.js";

const Modal = ({ setShowPopup, room }) => {
    const { setColor } = useContext(MyContext);

    const handleColorSelect = (event) => {
  event.preventDefault();
  const color = event.target.value;
  setColor(color);
  const updatedDiscardPile = [...room.gameData.discardPile];
  updatedDiscardPile[0].color = color;
  const allPlayerCards = [...room.gameData.allPlayerCards];

  socket.emit("update_game", {
    ...room,
    gameData: {
      ...room.gameData,
      discardPile: updatedDiscardPile,
      allPlayerCards,
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
                        <input type="radio" name="color" value="R" onClick={handleColorSelect} />
                        Red
                    </label>
                    <label>
                        <input type="radio" name="color" value="B" onClick={handleColorSelect} />
                        Blue
                    </label>
                    <label>
                        <input type="radio" name="color" value="G" onClick={handleColorSelect} />
                        Green
                    </label>
                    <label>
                        <input type="radio" name="color" value="Y" onClick={handleColorSelect} />
                        Yellow
                    </label>
                    <button type="submit">Choose</button>
                </form>
            </div>
        </div>
    );
};

export default Modal;
