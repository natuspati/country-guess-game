import React, {useEffect, useRef, useState} from "react";
import {Configuration, GameApi, UserStats} from "../api_client";
import Cookies from 'js-cookie';
import {debounce} from 'lodash';
import Select from "react-select";

let debouncedFunction;

const GameApp = function (props) {
    // Background DOM variables
    const inputRef = useRef() // autofocus to input field

    // Local state variables
    const maxTries = 4;
    const [gameState, setGameState] = useState("");
    const [numTries, setNumTries] = useState(maxTries);
    const [triedCountries, setTriedCountries] = useState([]);
    const [score, setScore] = useState(0);
    const [input, setInput] = useState("");

    // UI state variables
    const [showAlert, setShowAlert] = useState([false, ""]);
    const [inputDisabled, setInputDisabled] = useState(true);
    const [countryOptions, setCountryOptions] = useState([])
    const [selectedCountryOption, setSelectedCountryOption] = useState();

    // Country  variable
    const [country, setCountry] = useState({});


    const client = new GameApi(new Configuration({
        basePath: 'http://0.0.0.0:8000',
        headers: {'X-CSRFToken': Cookies.get('csrftoken')}
    }));

    // Retrieve game state information
    useEffect(() => {
        client.gameStatsRetrieve().then((result) => {
            setGameState(result.lastGameState);
            setNumTries(result.lastNumberTries);
            setScore(result.score);
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

        // for debug purposes
        // client.gameCountryList().then((result) => {
        //     let searchResults = [];
        //     for (const countryOption of result.results) {
        //         searchResults.push({
        //             label: countryOption["name"],
        //             value: countryOption["name"]
        //         });
        //     }
        //     setCountryOptions(searchResults);
        //     console.log(result.results);
        // });
    }, []);

    // Update user stats
    const putStatsUpdate = (props) => {
        client.gameStatsUpdate({
            'userStats': {
                "score": props.score,
                "lastGameState": props.gameState,
                "lastNumberTries": props.numTries
            }
        }).then((result) => console.log(result))
    };

    // Disable input if the game ends
    useEffect(() => {
        if (!country.name) {
            console.log('Waiting for country data to load.');
        } else {
            if (gameState === "fail" || gameState === "success") {
                setInputDisabled(true);
                setShowAlert([true, country.name]);
            } else {
                setInputDisabled(false);
            }
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
        let newGuess = inputData["value"];

        if (triedCountries.includes(newGuess)) {
            setGameState("repeat");
        } else {
            let localNumTries = numTries;
            let localGameState;
            let localScore = score;

            if (newGuess === country.name) {
                localGameState = "success"
                localScore += 1;
            } else {
                if (numTries > 1) {
                    localGameState = "wait"
                } else {
                    localGameState = "fail"
                    newGuess = country.name;
                }
                localNumTries -= 1;
            }
            setGameState(localGameState)
            setNumTries(localNumTries);
            setScore(localScore);
            setTriedCountries(countries => [...countries, newGuess]);

            putStatsUpdate({
                score: localScore,
                gameState: localGameState,
                numTries: localNumTries
            });
        }

        setShowAlert([true, newGuess]);
    }

    const alertFormatter = (responseGameState) => {
        let out;
        switch (responseGameState) {
            case "wait":
                out = ["warning", " is incorrect."];
                break;
            case "success":
                out = ["success", " is correct!"];
                break;
            case "fail":
                out = ["danger", " is correct answer."];
                break;
            case "repeat":
                out = ["secondary", " has already been tried."];
                break;
            default:
                out = ["primary", "Debug message"]
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
                            inputValue={input}
                            isSearchable={true}
                            onInputChange={(value, action) => {
                                if (action.action === "input-change") {
                                    onSearchChange(value);
                                    setInput(value);
                                }
                            }}
                            onChange={onSubmit}
                            isDisabled={inputDisabled}
                            autoFocus={true}
                            // menuIsOpen={true} // Enable to debug
                            ref={inputRef}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <Message formattingArgs={alertFormatter(gameState)}
                                 textArgs={showAlert}/>
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

const Message = ({formattingArgs, textArgs}) => {
    if (textArgs[0]) {
        return (
            <div className={"alert alert-" + formattingArgs[0] + " my-2 my-lg-3"}>
                <strong>{textArgs[1]}</strong> {formattingArgs[1]}
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
