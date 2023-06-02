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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-8 max-w-md">
                <h3 className="text-2xl font-bold mb-4">Wildcard Played!</h3>
                <p className="mb-4">Choose a color:</p>
                <form className="color-options">
                    <label className="flex items-center mb-2">
                        <input
                            type="radio"
                            name="color"
                            value="R"
                            onClick={handleColorSelect}
                            className="mr-2"
                        />
                        <span className="w-4 h-4 rounded-full bg-red-500 inline-block"></span>
                        <span className="ml-2">Red</span>
                    </label>
                    <label className="flex items-center mb-2">
                        <input
                            type="radio"
                            name="color"
                            value="B"
                            onClick={handleColorSelect}
                            className="mr-2"
                        />
                        <span className="w-4 h-4 rounded-full bg-blue-500 inline-block"></span>
                        <span className="ml-2">Blue</span>
                    </label>
                    <label className="flex items-center mb-2">
                        <input
                            type="radio"
                            name="color"
                            value="G"
                            onClick={handleColorSelect}
                            className="mr-2"
                        />
                        <span className="w-4 h-4 rounded-full bg-green-500 inline-block"></span>
                        <span className="ml-2">Green</span>
                    </label>
                    <label className="flex items-center mb-2">
                        <input
                            type="radio"
                            name="color"
                            value="Y"
                            onClick={handleColorSelect}
                            className="mr-2"
                        />
                        <span className="w-4 h-4 rounded-full bg-yellow-500 inline-block"></span>
                        <span className="ml-2">Yellow</span>
                    </label>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                        Choose
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Modal;
