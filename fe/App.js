import React, {useEffect, useRef, useState} from "react";
import {Configuration, CountryExists, GameApi} from "../api_client";
import Cookies from 'js-cookie';

const GameApp = function (props) {
    // Background DOM variables
    const [isLoading, setIsLoading] = useState(true);
    const inputRef = useRef() // autofocus to input field

    // Game state variables
    const [finishedToday, setFinishedToday] = useState(false);
    const [gameState, setGameState] = useState("wait");
    const [numTries, setNumTries] = useState(4);
    const [triedCountries, setTriedCountries] = useState(["Very Long String Very", "test", "string", "test", "test"]);
    const [nonexistentCountry, setNonexistentCountry] = useState("test");
    const [guess, setGuess] = useState("");
    const [lastValidGuess, setLastValidGuess] = useState("")

    // UI state variables
    const [showAlert, setShowAlert] = useState(false);
    const [inputDisabled, setInputDisabled] = useState(false);

    // Country of the day variables
    const [name, setName] = useState("");
    const [capital, setCapital] = useState("");
    const [region, setRegion] = useState("");
    const [population, setPopulation] = useState(0);
    const [flag, setFlag] = useState("");

    const client = new GameApi(new Configuration({
        basePath: 'http://127.0.0.1:8000',
        headers: {'X-CSRFToken': Cookies.get('csrftoken')}
    }));

    // Retrieve game state information
    useEffect(() => {
        client.gameStateRetrieve().then((result) => {
            setFinishedToday(result.finishedToday);
            setGameState(result.gameState);
            setNumTries(result.numberTries);
        });
    }, []);

    // Retrieve country information
    useEffect(() => {
        client.gameCountryTodayRetrieve().then((result) => {
            setName(result.name);
            setCapital(result.capital);
            setRegion(result.region);
            setPopulation(result.population);
            setFlag(result.flag);
            setIsLoading(false);
        });
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        setLastValidGuess(guess);

        // Check if the submitted guess is correct
        if (guess.toLowerCase() === name.toLowerCase()) {
            setGuess(name);
            setGameState("success");
            setInputDisabled(true);
        } else {
            client.gameCountryCheckCreate({
                'countryExists': {'name': guess}
            }).then((result) => {
                if (result._exists) {
                    setGameState("wait")
                    setNumTries(x => x - 1);
                    setTriedCountries(countries => [...countries, result.name]);
                } else {
                    setGameState("skip")
                    setNonexistentCountry(x => result.name);
                }
            });
        }

        // Show alert after submission
        setShowAlert(true);

        // Reset input box value and focus to it
        event.target.reset();
        inputRef.current?.focus();

        // Autoclose the alert
        // const timeId = setTimeout(() => {
        //     setShowAlert(false);
        // }, 10000);
        // return () => {
        //     clearTimeout(timeId)
        // }

    };

    const alertFormatter = (responseGameState, responseNameNoFormat) => {
        let out = [];
        const responseName = titleCase(responseNameNoFormat);
        switch (responseGameState) {
            case "wait":
                out = ["warning", responseName, " is incorrect."];
                break;
            case "success":
                out = ["success", responseName, " is correct!"];
                break;
            case "fail":
                out = ["danger", name, " is correct answer."];
                break;
            case "skip":
                out = ["secondary", responseName, " is not a country."]
                break;
            default:
                out = ["primary", "Debug", " message"]
        }
        return out
    };

    return (
        <div className="container-fluid justify-content-center text-center" id="gameDiv">
            <div className="col-10 col-lg-6 mx-auto">
                <div className="row">
                    <div className="col">
                        Remaining tries: {numTries}
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <form onSubmit={handleSubmit}>
                            <fieldset disabled={inputDisabled}>
                                <label>
                                    <input type="text" className="form-control"
                                           placeholder="Enter country name" autoComplete="off" ref={inputRef}
                                           onChange={(e) => setGuess(e.target.value)}
                                    />
                                </label>
                                <button disabled={guess === ""}>Submit</button>
                            </fieldset>
                        </form>
                    </div>
                    <div className="row">
                        <div className="col">
                            <Message args={alertFormatter(gameState, lastValidGuess)}
                                     show={showAlert}/>
                        </div>
                    </div>
                    <div className="row row-cols-2 row-cols-lg-4 g-2 g-lg-4">
                        {triedCountries.map((name, i) => {
                            return (
                                <div className="col my-auto py-1 pb-lg-2" key={i}>
                                    <div className="border my-auto" key={i}>
                                        {name}
                                    </div>
                                </div>
                            )
                        })}
                    </div>


                </div>
            </div>
        </div>
    );
};

const Message = ({
                     args, show
                 }) => {
    if (show) {
        return (
            <div className={`alert alert-${args[0]}`}>
                <strong>{args[1]}</strong> {args[2]}
            </div>
        )
    }

}

function titleCase(str) {
    str = str.toLowerCase().split(' ');
    for (let i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
}

export {
    GameApp
};
