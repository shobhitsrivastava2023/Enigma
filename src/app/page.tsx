// pages/index.tsx

"use client"
import React, { useState } from 'react';
import EnigmaForm from './components/enigmaform';
import { StackedCircularFooter } from '@/components/ui/stacked-circular-footer';

const Home: React.FC = () => {
    const [processedMessage, setProcessedMessage] = useState('');

    return (
        <div className='bg-[#121212] h-screen'>
          <div className='bg-[#1F1B24]'>

         
           
            <EnigmaForm onProcess={(message) => setProcessedMessage(message)} />
            {processedMessage && (
                <div>
                    <h2>Processed Message:</h2>
                    <p>{processedMessage}</p>
                </div>
            )}
            </div>
            <div>
                <StackedCircularFooter />

            </div>
        </div>
    );
};

export default Home;