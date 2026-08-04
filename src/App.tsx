import { useState, useEffect, useRef } from 'react';
import './App.css';

// Define corresponding data types
interface Pet {
    name: string;
    hunger: number;
    happiness: number;
    energy: number;
}

enum Action {
    Eat = 'EAT',
    Play = 'PLAY',
    Sleep = 'SLEEP',
}

enum PetMood {
    HAPPY,
    EXCITED,
    CONTENT,
    SAD,
    TIRED,
    SICK,
    HUNGRY,
}

const moodEmoji: Record<PetMood, string> = {
    [PetMood.HAPPY]: '😊',
    [PetMood.EXCITED]: '🤩',
    [PetMood.CONTENT]: '🙂',
    [PetMood.SAD]: '😢',
    [PetMood.TIRED]: '😴',
    [PetMood.SICK]: '🤢',
    [PetMood.HUNGRY]: '🍔',
};

const getPetMood = (pet: Pet): PetMood => {
    if (pet.hunger > 70) {
        return PetMood.HUNGRY;
    } else if (pet.energy < 30) {
        return PetMood.TIRED;
    } else if (pet.happiness < 30) {
        return PetMood.SAD;
    } else if (pet.happiness > 80 && pet.energy > 70) {
        return PetMood.EXCITED;
    } else if (pet.happiness > 60) {
        return PetMood.HAPPY;
    } else {
        return PetMood.CONTENT;
    }
};

const PetGame = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [petName, setPetName] = useState('');
    const [gameStarted, setGameStarted] = useState(false);
    const [pet, setPet] = useState<Pet>({
        name: '',
        hunger: 0,
        happiness: 100,
        energy: 100,
    });

    useEffect(() => {
        let timeoutId: number;

        const tick = () => {
            setPet((currentPet) => ({
                ...currentPet,
                hunger: Math.min(100, currentPet.hunger + 1),
                energy: Math.min(100, currentPet.energy + 1),
                happiness: Math.max(0, currentPet.happiness - 1),
            }));
            timeoutId = window.setTimeout(tick, 1000);
        };

        timeoutId = window.setTimeout(tick, 1000);

        return () => clearTimeout(timeoutId);
    }, []);

    const handleStartGame = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const nameFromInput = inputRef.current?.value.trim() ?? '';

        if (nameFromInput === '') {
            return;
        }

        setPetName(nameFromInput);

        setPet((currentPet) => ({
            ...currentPet,
            name: nameFromInput,
        }));

        setGameStarted(true);
    };

    const currentMood = getPetMood(pet);

    const clamp = (value: number) => {
        return Math.min(100, Math.max(0, value));
    };

    const handleAction = (action: Action) => {
        setPet((currentPet) => {
            const updatedPet = { ...currentPet };

            switch (action) {
                case Action.Eat:
                    if (updatedPet.hunger > 0) {
                        updatedPet.hunger -= 10;
                    }
                    if (updatedPet.energy < 100) {
                        updatedPet.energy += 10;
                    }
                    break;
                case Action.Play:
                    if (updatedPet.energy > 0) {
                        updatedPet.energy -= 10;
                    }
                    if (updatedPet.happiness < 100) {
                        updatedPet.happiness += 10;
                    }
                    break;
                case Action.Sleep:
                    if (updatedPet.hunger < 100) {
                        updatedPet.hunger += 10;
                    }
                    if (updatedPet.energy < 100) {
                        updatedPet.energy += 20;
                    }
                    break;
            }
            updatedPet.hunger = clamp(updatedPet.hunger);
            updatedPet.happiness = clamp(updatedPet.happiness);
            updatedPet.energy = clamp(updatedPet.energy);
            return updatedPet;
        });
    };

    return (
        <>
            <main>
                <header>
                    <h1>Digital Pet Game</h1>
                    <p>Take care of your virtual companion!</p>
                </header>

                {!gameStarted ? (
                    <section className="base-container info-panel">
                        <form
                            className="start-questions"
                            onSubmit={handleStartGame}
                        >
                            <label htmlFor="pet-name">
                                What is your pet's name?
                            </label>
                            <input
                                type="text"
                                id="pet-name"
                                ref={inputRef}
                                defaultValue={petName}
                                onChange={(e) => setPetName(e.target.value)}
                            />
                            <button id="set-name-btn" type="submit">
                                Start Game
                            </button>
                        </form>
                    </section>
                ) : (
                    <section className="base-container info-panel">
                        <h2 className="pet-name">{pet.name}</h2>
                        <div className="pet-buttons">
                            <button
                                className="pet-button"
                                id="eat-action"
                                onClick={() => handleAction(Action.Eat)}
                            >
                                EAT
                            </button>
                            <button
                                className="pet-button"
                                id="play-action"
                                onClick={() => handleAction(Action.Play)}
                            >
                                PLAY
                            </button>
                            <button
                                className="pet-button"
                                id="sleep-action"
                                onClick={() => handleAction(Action.Sleep)}
                            >
                                SLEEP
                            </button>
                        </div>
                        <section className="stats-grid">
                            <div className="stat-bar stat">
                                <div className="stat-header">
                                    <div className="stat-label">
                                        <span className="stat-icon">🍽️</span>
                                        <span className="stat-name">
                                            Hunger
                                        </span>
                                    </div>
                                    <span className="stat-value">
                                        {pet.hunger}
                                    </span>
                                </div>
                            </div>
                            <div className="stat-bar stat">
                                <div className="stat-header">
                                    <div className="stat-label">
                                        <span className="stat-icon">😊</span>
                                        <span className="stat-name">
                                            Happiness
                                        </span>
                                    </div>
                                    <span className="stat-value">
                                        {pet.happiness}
                                    </span>
                                </div>
                            </div>
                            <div className="stat-bar stat">
                                <div className="stat-header">
                                    <div className="stat-label">
                                        <span className="stat-icon">⚡</span>
                                        <span className="stat-name">
                                            Energy
                                        </span>
                                    </div>
                                    <span className="stat-value">
                                        {pet.energy}
                                    </span>
                                </div>
                            </div>
                        </section>
                    </section>
                )}
            </main>
        </>
    );
};

export default PetGame;
