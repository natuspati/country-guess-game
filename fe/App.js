import React, {useEffect, useRef, useState} from "react";
import {Configuration, GameApi} from "../api_client";
import Cookies from 'js-cookie';
import {debounce} from 'lodash';
import Select from "react-select";

let debouncedFunction;

const GameApp = function (props) {
    // Background DOM variables
    const inputRef = useRef() // autofocus to input field

    // Game state variables
    const maxTries = 4;
    const [finishedToday, setFinishedToday] = useState(false);
    const [gameState, setGameState] = useState("wait");
    const [numTries, setNumTries] = useState(maxTries);
    const [triedCountries, setTriedCountries] = useState([]);
    const [guess, setGuess] = useState("");

    // UI state variables
    const [showAlert, setShowAlert] = useState(false);
    const [inputDisabled, setInputDisabled] = useState(false);
    const [countryOptions, setCountryOptions] = useState([])
    const [selectedCountryOption, setSelectedCountryOption] = useState();

    // Country of the day variable
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
                name: result.name,
                capital: result.capital,
                region: result.region,
                population: result.population,
                flag: result.flag
            });
        });
    }, []);

    // Disable input if the game ends
    useEffect(() => {
        if (gameState === "fail" || gameState === "success") {
            setInputDisabled(true);
        }
    }, [gameState]);

    const onSearchChange = (inputData) => {
        try {
            if (inputData !== "") {
                // Cancel old saved debounced functions
                if (debouncedFunction && debouncedFunction.cancel)
                    debouncedFunction.cancel();

                debouncedFunction = debounce(async () => {
                    const response = await client.gameCountryList({
                        "name": inputData
                    });

                    if (response.results) {
                        let searchResults = [];
                        for (const countryOption of response.results) {
                            searchResults.push({
                                label: countryOption["name"],
                                value: countryOption["name"]
                            });
                        }
                        setCountryOptions(searchResults);
                    }

                }, 2000);
                debouncedFunction();
            } else {
                setCountryOptions([]);
            }

        } catch (error) {
            console.error(error);
        }
    }

    const onSubmit = (inputData) => {
        const newGuess = inputData["value"];
        setGuess(newGuess)

        if (triedCountries.includes(newGuess)) {
            setGameState("repeat");
        } else {
            if (newGuess === country.name) {
                setGameState("success");
            } else {
                setNumTries(x => x - 1);
                if (numTries > 1) {
                    setGameState("wait");
                } else {
                    setGameState("fail");
                }
                setTriedCountries(countries => [...countries, newGuess]);
            }
        }

        // Show alert after submission
        setShowAlert(true);
    }

    const alertFormatter = (responseGameState) => {
        let out;
        switch (responseGameState) {
            case "wait":
                out = ["warning", guess, " is incorrect."];
                break;
            case "success":
                out = ["success", guess, " is correct!"];
                break;
            case "fail":
                out = ["danger", country.name, " is correct answer."];
                break;
            case "repeat":
                out = ["secondary", guess, " has already been tried."];
                break;
            default:
                out = ["primary", "Debug", " message"]
        }
        return out
    };

    return (
        <div className="container-fluid justify-content-center text-center" id="gameDiv">
            <div className="col-10 col-lg-4 mx-auto">
                <div className="row">
                    <div className="col">
                        <div className="custom-progress my-2 my-lg-3">
                            <ProgressBar numTries={numTries} maxTries={maxTries}/>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <Select
                            options={countryOptions}
                            placeholder="Select country"
                            value={selectedCountryOption}
                            isSearchable={true}
                            onInputChange={onSearchChange}
                            onChange={onSubmit}
                            isDisabled={inputDisabled}
                            autoFocus={true}
                            ref={inputRef}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <Message args={alertFormatter(gameState)}
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
    let hiddenCountry = Object.assign({}, country);
    let shownNumberFields;
    if (showFinal === "fail" || showFinal === "success") {
        shownNumberFields = 5;
    } else {
        delete hiddenCountry.name;
        shownNumberFields = showTries;
    }

    let formattedCountry = {};
    for (const [index, [key, value]] of Object.entries(Object.entries(hiddenCountry))) {
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
    let formattedCountryVal;

    if (typeof countryVal == 'number') {
        formattedCountryVal = countryVal.toLocaleString();
    } else {
        formattedCountryVal = countryVal;
    }

    if (countryKey === 'flag') {
        return <div className="row justify-content-center my-1">
            <div className="col col-6">
                <img src={countryVal["full_size"]} alt="Flag" width="100%" border="1"/>
            </div>
        </div>
    } else {
        return <div className="row justify-content-center my-1">
            <div className="col col-6 border-bottom ">
                {titleCase(countryKey)}: <strong>{formattedCountryVal}</strong>
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
