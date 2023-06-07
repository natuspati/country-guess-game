import React, {useEffect, useRef, useState} from "react";
import {Configuration, GameApi} from "../api_client";
import Cookies from 'js-cookie';

const GameApp = function (props) {
    // Background DOM variables
    const [isLoading, setIsLoading] = useState(true);
    const inputRef = useRef() // autofocus to input field

    // Game state variables
    const maxTries = 4;
    const [finishedToday, setFinishedToday] = useState(false);
    const [gameState, setGameState] = useState("wait");
    const [numTries, setNumTries] = useState(maxTries);
    const [triedCountries, setTriedCountries] = useState([]);
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
    const [country, setCountry] = useState({});

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
            setCountry({
                "name": result.name,
                "capital": result.capital,
                "region": result.region,
                "population": result.population,
                "flag": result.flag
            });

            setName(result.name);
            setCapital(result.capital);
            setRegion(result.region);
            setPopulation(result.population);
            setFlag(result.flag);
            setIsLoading(false);
        });
    }, []);

    // Disable input if the game ends
    useEffect(() => {
        if (gameState === "fail" || gameState === "success") {
            setInputDisabled(true);
        }
    }, [gameState]);

    const handleSubmit = (event) => {
        event.preventDefault();
        setLastValidGuess(guess);

        // Check if the guess has already been tried
        if (triedCountries.includes(titleCase(guess))) {
            setGameState("repeat")
        } else {
            // Check if the guess is correct
            if (guess.toLowerCase() === name.toLowerCase()) {
                setGuess(name);
                setGameState("success");
            } else {
                // Check if the guess is valid
                client.gameCountryCheckCreate({
                    'countryExists': {'name': guess}
                }).then((result) => {
                    // Deduct a try for incorrect guess
                    if (result._exists) {
                        setNumTries(x => x - 1);
                        // Because setState updates asynchronously, use 1 as min value of tries
                        if (numTries > 1) {
                            setGameState("wait");
                        } else {
                            setGameState("fail");
                        }
                        setTriedCountries(countries => [...countries, titleCase(result.name)]);
                    } else {
                        // Don't deduct for incorrect guess
                        setGameState("skip")
                    }
                });
            }
        }

        // Show alert after submission
        setShowAlert(true);

        // Reset input box value and focus to it
        event.target.reset();
        inputRef.current?.focus();
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
                out = ["secondary", responseName, " is not a country."];
                break;
            case "repeat":
                out = ["secondary", responseName, " has already been tried."];
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
                        <div className="custom-progress my-2 my-lg-3">
                            <ProgressBar numTries={numTries} maxTries={maxTries}/>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <form onSubmit={handleSubmit}>
                            <fieldset disabled={inputDisabled}>
                                <div className="input-group w-auto">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter country name"
                                        aria-label="Enter country name"
                                        aria-describedby="submitButton"
                                        autoComplete="off"
                                        ref={inputRef}
                                        onChange={(e) => setGuess(e.target.value)}
                                    />
                                    <button disabled={guess === ""} className="btn btn-primary" type="submit"
                                            id="submit-button" data-mdb-ripple-color="dark">
                                        Enter
                                    </button>
                                </div>
                            </fieldset>
                        </form>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <Message args={alertFormatter(gameState, lastValidGuess)}
                                 show={showAlert}/>
                    </div>
                </div>
                <div className="row row-cols-2 row-cols-lg-4 tried-countries">
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
                <div className="row">
                    <AnswerForm showTries={maxTries - numTries + 1} country={country} showFinal={gameState}/>
                </div>
            </div>
        </div>
    );
};

const Message = ({args, show}) => {
    if (show) {
        return (
            <div className={"alert alert-" + args[0] + " my-2 my-lg-3"}>
                <strong>{args[1]}</strong> {args[2]}
            </div>
        )
    }

}

const ProgressBar = (props) => {
    const {numTries, maxTries} = props;
    const completed = numTries / maxTries * 100;
    let labelText;

    switch (numTries) {
        case 0:
            labelText = "";
            break;
        case 1:
            labelText = `Last try!`;
            break;
        default:
            labelText = `${numTries} tries left`;
    }

    const fillerStyles = {
        width: `${completed}%`,
    };

    return (
        <div className="progress-container">
            <div style={fillerStyles} className="progress-filler">
                <span className="progress-label">{labelText}</span>
            </div>
        </div>
    );
};

const AnswerForm = (props) => {
    const {showTries, country, showFinal} = props;
    let shownNumberFields = 0;
    if (showFinal === "fail" || showFinal === "success") {
        shownNumberFields = 5;
    } else {
        delete country.name;
        shownNumberFields = showTries;
    }

    let formattedCountry = {};
    for (const [index, [key, value]] of Object.entries(Object.entries(country))) {
        if (Number(index) === shownNumberFields) {
            break;
        }
        formattedCountry[key] = value;
    }

    return (
        <div> {
            Object.keys(formattedCountry).map((countryKey, index) => {
                return (<div key={index} className="col mx-auto">
                    <AnswerFormTagFormatter countryKey={countryKey} countryVal={formattedCountry[countryKey]}/>
                </div>)
            })
        }</div>
    );
};

const AnswerFormTagFormatter = (props) => {
    const {countryKey, countryVal} = props;
    let formattedCountryVal = "";

    if (typeof countryVal == 'number') {
        formattedCountryVal = countryVal.toLocaleString();
    } else {
        formattedCountryVal = countryVal;
    }

    if (countryKey === 'flag') {
        return <div className="row justify-content-center my-1">
            <div className="col col-6 col-lg-4">
                <img src={countryVal["full_size"]} alt="Flag" width="100%" border="1"/>
            </div>
        </div>
    } else {
        return <div className="row justify-content-center my-1">
            <div className="col col-6 col-lg-4 border-bottom ">
                {titleCase(countryKey)}: {formattedCountryVal}
            </div>
        </div>
    }

};

export default ProgressBar;


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
