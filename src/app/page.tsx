// pages/index.tsx

"use client"
import React, { useState } from 'react';
import EnigmaForm from './components/enigmaform';

const Home: React.FC = () => {
    const [processedMessage, setProcessedMessage] = useState('');

    return (
        <div>
            <h1>Enigma Machine</h1>
            <EnigmaForm onProcess={(message) => setProcessedMessage(message)} />
            {processedMessage && (
                <div>
                    <h2>Processed Message:</h2>
                    <p>{processedMessage}</p>
                </div>
            )}
        </div>
    );
};

export default Home;