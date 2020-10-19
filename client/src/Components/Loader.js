import React from 'react';

export default function Loader() {
    return (
        <div className="overlay">
            <img src="/spinner.svg" id="spinner" alt="spinner"/>
        </div>
    )
}
