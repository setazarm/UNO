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
    const cardToDisplay = unoCards.filter((card) => card.includes(cardImage));
    console.log(cardToDisplay);

    return (
        <div className>
            {<img className="w-[200px]" src={unoCards.filter((card) => card.includes(cardImage))} alt={cardImage} />}
        </div>
    );
};
export default Card;
