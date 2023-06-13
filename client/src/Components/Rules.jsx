import React from "react";
import rules from '../assets/rules.png'
const Rules = () => {
    return (
        <div className="bg-white p-6">
            <h2 className="text-2xl font-bold mb-4">Learn How to Play Uno – Get Started Quickly</h2>
            <p className="mb-4">
                Excited to dive into a game of Uno? You've come to the perfect place. Take a look at
                the Uno infographic below and kick off your Uno experience in just 2 minutes!
            </p>
            <p className="mb-4">
                Get acquainted with all the Uno Rules effortlessly. As the saying goes, a single
                image can convey more than a myriad of words!
            </p>

            <p className="mb-4">Utilize, store, share, print, and savor the enjoyment!</p>
            <img
                className="mb-4"
                src={rules}
                alt="Uno infographic"
            />
            <p className="mb-4">
                Do you wish to delve deeper into the intricacies of Uno Rules? Simply download our
                comprehensive Uno guide below.
            </p>
            <a
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-block mb-4"
                href="https://www.unorules.org/wp-content/uploads/2021/03/Uno-Rules-PDF-Official-Rules-unorules.org_.pdf"
                target="_blank"
                rel="noreferrer"
            >
                Download PDF
            </a>
        </div>
    );
};

export default Rules;
