import { useState } from 'react';
import './App.css';

const PetGame = () => {
    return (
        <>
            <main>
                <header>
                    <h1>Digital Pet Game</h1>
                    <p>Take care of your virtual companion!</p>
                </header>
                <section className="base-container info-panel">
                    <form className="start-questions">
                        <label htmlFor="pet-name">
                            What is your pet's name?
                        </label>
                        <input type="text" id="pet-name" />
                        <button id="set-name-btn">Start Game</button>
                    </form>
                </section>
            </main>
        </>
    );
};

export default PetGame;
