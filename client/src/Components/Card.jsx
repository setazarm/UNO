import { unoCards } from "../assets/unoCards";
const Card = ({ color, number }) => {
    const colorLookup = {
        R: "Red",
        G: "Green",
        B: "Blue",
        Y: "Yellow",
    };

    const fullColor = colorLookup[color];
    const cardImage =
        number === "skip"
            ? `${fullColor}_Skip`
            : number === "_"
            ? `${fullColor}_Reverse`
            : number === "D2"
            ? `${fullColor}_Draw`
            : number === ""
            ? "Wild_1"
            : number === "D4"
            ? "Wild_Draw"
            : `${fullColor}_${number}`;

    return (
        <>
            {
                <img
                    className="w-[180px] transition-transform transition-ease-out duration-300 hover:scale-110"
                    src={unoCards.filter((card) => card.includes(cardImage))}
                    alt={cardImage}
                />
            }
        </>
    );
};
export default Card;
