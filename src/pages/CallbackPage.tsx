import React from 'react';
import { AppData } from '../AppData';
import { useState, useEffect } from 'react'

// ResponseData of /auth
export interface AuthResponse {
    access_token: string,
    expires_in: number, // Time left in seconds
    created?: number, // Creation date of the token, milliseconds since utc
    id_hint: string,
    refreshToken: string,
    scope: string,
    token_type: string
}

function getAuth(code: string): Promise<AuthResponse | null> {
    // URL of the API endpoint
    const baseUrl = 'https://main.websited26df17a-review.myrnastet.coherencesites.com/auth/';
    // Construct the query string
    const payload = {
        code: code
    };
    //const url = baseUrl + code;

    // Making the GET request
    return fetch(baseUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json() as Promise<AuthResponse>; // Type assertion
        })
        .catch(() =>{
            return null
        })
}

const CallbackPage: React.FC = () => {
    const [, setAuthData] = useState<AuthResponse | null>(null);
    const [isCounting, setIsCounting] = useState(false);
    const [message, setMessage] = useState<string | null>("message"); 
    const [code, setCode] = useState<string | null>(null);
    const [counter, setCounter] = useState(0);
    const [hasFetched, setHasFetched] = useState(false);
    // Handle callback logic here
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const error = params.get("error");

        if (error) {
            setMessage(params.get("message"));
        } else {
            setMessage("Succesfully connected!");
            setCode(params.get("code"));
            const state = params.get("state");
            const id = AppData.getSessionId();
            if (state === id) {
                window.console.log("State match");
            } else {
                setMessage("State mismatch, try logging in again.");
                window.console.log("State mismatch");
            }
        }
    }, []); // Run only once on component mount
    
    const startRedirect = () => {
        setIsCounting(true);
    };
    
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isCounting) {
            setCounter(3);
            timer = setInterval(() => {
                setCounter(prevCounter => {
                if (prevCounter === 1) {
                    clearInterval(timer);
                    window.location.href = '/#/overview';
                }
                return prevCounter - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isCounting]);


    useEffect(() => {
        if (!hasFetched && message === "Succesfully connected!" && code !== null) {
            /*if (AppData.getAccessToken() !== null) {
                let data = AppData.getAccessToken();
                setAuthData(data);
                startRedirect();
                return;
            }*/
            getAuth(code)
                .then(data => {
                    setAuthData(data);
                    if (data !== null) {
                        AppData.setAccessToken(data);
                        startRedirect();
                    }
                })
                .catch(error => {
                    console.error('Error while fetching authentication data:', error);
                    setAuthData(null);
                })
                .finally(() => {
                    setHasFetched(true);
                });
        }
    }, [message, code, hasFetched]); // Run only when dependencies change


    const handleClick = () => {
        startRedirect(); // Start redirect immediately on button click
    };

    return (
        <div>
            <h1>{message}</h1>
            <div className="card">
            <button onClick={handleClick}>Click here if you don't redirect automatically</button>
            </div>
            <div>
                {isCounting && <p>Redirecting in {counter} seconds...</p>}
            </div>
        </div>

    );
}


export default CallbackPage;