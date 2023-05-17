const setBgColor = (cardColor) => {
    switch(cardColor)
    {
        case 'R':
            return 'bg-red-400';
        case 'G':
            return 'bg-green-400';
        case 'B':
            return 'bg-blue-400';
        case 'Y':
            return 'bg-yellow-400';
        case 'W':
            return 'bg-white';
        default:
            return 'bg-gray-400';

    }

}

export default setBgColor;