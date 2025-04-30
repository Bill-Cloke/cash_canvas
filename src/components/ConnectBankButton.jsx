import React, { useState, useEffect, useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';

function ConnectBankButton() {
    const [linkToken, setLinkToken] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8080/api/bank/create_link_token', {
            method: 'POST',
            credentials: 'include',            
            headers: { 'Content-Type': 'application/json' },
        })
        .then(res => res.json())
        .then(data => setLinkToken(data.linkToken))
        .catch(console.error);
    }, []);

  
    const onSuccess = useCallback((public_token, metadata) => {
        fetch('http://localhost:8080/api/bank/exchange_public_token', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ public_token }),
    })
        .then(res => res.json())
        .then(result => {
        console.log('Bank account added:', result);
     
        window.location.reload()
          
       
      })
      .catch(console.error);
    }, []);


    const onExit = useCallback((err, metadata) => {
        if (err) {
            console.error('Link error:', err)
            alert('Could not connect. Please try again.')
        } else {
        console.log('User exited early:', metadata)
        }
    }, [])

    const onEvent = useCallback((eventName, metadata) => {
        console.log(`Plaid event: ${eventName}`, metadata)
    }, [])

    const onError = useCallback((err) => {
        console.error('Unhandled Plaid error:', err)
    }, [])

    const config = {
        token: linkToken,
        onSuccess,
        onExit,
        onEvent,
        onError,
    }

    const { open, ready } = usePlaidLink(config);

    return (
        <button
            onClick={() => open()}
            disabled={!ready}
            className=" bg-green-300 text-black px-2 py-1 rounded hover:bg-green-400"
        >
            Connect Bank Account
        </button>
    );
}

export default ConnectBankButton;
