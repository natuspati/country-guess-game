import React, {useEffect, useState} from "react";
import {Configuration, CountryExists, GameApi} from "../api_client";
import Cookies from 'js-cookie';

const CountryApp = function (props) {
    const [isLoading, setIsLoading] = useState(true);
    const [countries, setCountries] = useState([]);

    const client = new GameApi(new Configuration({
        basePath: 'http://127.0.0.1:8000',
        headers: {'X-CSRFToken': Cookies.get('csrftoken')}
    }));

    useEffect(
        () => {
            client.gameCountryList().then((result) => {
                setCountries(result.results);
                setIsLoading(false);
            });
        },
        [],
    );

    if (isLoading) {
        return <p>Country data is loading...</p>;
    }
    if (countries.length === 0) {
        return <p>No countries found!</p>;
    } else {
        return <CountryList countries={countries}/>;
    }
};


const CountryList = function (props) {
    return (
        <table>
            <thead>
            <tr>
                <th>Country</th>
                <th>Capital</th>
                <th>Population</th>
            </tr>
            </thead>
            <tbody>
            {
                props.countries.map((country, index) => {
                    return (
                        <tr key={index}>
                            <td>{country.name}</td>
                            <td>{country.capital}</td>
                            <td>{country.population}</td>
                        </tr>
                    );
                })
            }
            </tbody>
        </table>
    );
};

const GameApp = function (props) {
    const [isLoading, setIsLoading] = useState(true);

    const [finishedToday, setFinishedToday] = useState(false)
    const [gameState, setGameState] = useState("wait")
    const [numTries, setNumTries] = useState(4)

    const [name, setName] = useState("");
    const [capital, setCapital] = useState("");
    const [region, setRegion] = useState("");
    const [population, setPopulation] = useState(0);
    const [flag, setFlag] = useState("");


    const client = new GameApi(new Configuration({
        basePath: 'http://127.0.0.1:8000',
        headers: {'X-CSRFToken': Cookies.get('csrftoken')}
    }));

    // Retrieve game state information.
    useEffect(() => {

        client.gameStateRetrieve().then((result) => {
            setFinishedToday(result.finishedToday);
            setGameState(result.gameState);
            setNumTries(result.numberTries);
        });
    }, []);

    // Retrieve country information.
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
        let ce = {
            name: 'a',
            exists: false
        };

        client.gameCountryCheckCreate({
            'CountryExists': {
                name: 'a',
                exists: false
            }
        }).then((result) => {
            console.log('checked', result)
        });

        // client.gameCountryCheckCreate({'name': name}).then((result) => {
        //     if (result.exists) {
        //         setNumTries(x => x-1)
        //         alert("The name you entered was: ${name}\nIt's incorrect. Remaining tries: $(numTries).");
        //     } else {
        //         alert("The name you entered was: ${name}\nIt doesn't exist. Remaining tries: $(numTries).");
        //     }
        // });
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>Enter your name:
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </label>
            <input type="submit"/>
        </form>
    );
};


export {
    CountryApp,
    GameApp,
};
