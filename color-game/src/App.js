import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader } from "./components/ui/Card";
import { Button } from "./components/ui/Button";
import {
  Clipboard,
  SmilePlus,
  Gauge,
  Skull,
  Star,
  Gamepad2,
  RefreshCw,
  Trophy,
  Volume2,
  VolumeX,
  Music,
  Music4Icon,
  Music4,
} from "lucide-react";

const DIFFICULTY_LEVELS = {
  easy: {
    name: "Easy",
    timeLimit: 45,
    revealTime: 6,
    pointsPerCorrect: 1,
    colorVariation: 60,
    optionCount: 6,
  },
  medium: {
    name: "Medium",
    timeLimit: 30,
    revealTime: 3,
    pointsPerCorrect: 2,
    colorVariation: 40,
    optionCount: 6,
  },
  hard: {
    name: "Hard",
    timeLimit: 20,
    revealTime: 2,
    pointsPerCorrect: 3,
    colorVariation: 10,
    optionCount: 6,
  },
};

const correctSound = new Audio("/sounds/correct.mp3");
const incorrectSound = new Audio("/sounds/incorrect.mp3");
const backgroundMusic = new Audio("/sounds/background-music.mp3");


const createConfetti = () => {
  const confettiContainer = document.createElement("div");
  confettiContainer.style.position = "fixed";
  confettiContainer.style.top = "0";
  confettiContainer.style.left = "0";
  confettiContainer.style.width = "100%";
  confettiContainer.style.height = "100%";
  confettiContainer.style.pointerEvents = "none";
  confettiContainer.style.zIndex = "1000";

  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement("div");
    confetti.style.position = "absolute";
    confetti.style.width = "10px";
    confetti.style.height = "10px";
    confetti.style.borderRadius = "50%";
    confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 50%, 50%)`;

    const startX = Math.random() * window.innerWidth;
    const startY = -10;

    confetti.style.left = `${startX}px`;
    confetti.style.top = `${startY}px`;

    confettiContainer.appendChild(confetti);

    const animationDuration = Math.random() * 3 + 2;
    confetti.animate(
      [
        { transform: `translate(0, 0) rotate(0deg)` },
        {
          transform: `translate(${(Math.random() - 0.5) * 200}px, ${
            window.innerHeight + 10
          }px) rotate(${Math.random() * 360}deg)`,
          opacity: 0,
        },
      ],
      {
        duration: animationDuration * 1000,
        easing: "cubic-bezier(0.25, 0.1, 0.25, 1)",
      }
    );

    setTimeout(() => {
      confettiContainer.removeChild(confetti);
    }, animationDuration * 1000);
  }

  document.body.appendChild(confettiContainer);
  setTimeout(() => {
    document.body.removeChild(confettiContainer);
  }, 3000);
};

// Utility functions
const generateRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const adjustColor = (color, variation) => {
  const hex2rgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  };

  const rgb2hex = (r, g, b) => {
    return `#${[r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")}`;
  };

  let [r, g, b] = hex2rgb(color);

  r = Math.max(
    0,
    Math.min(255, r + Math.floor(Math.random() * variation - variation / 2))
  );
  g = Math.max(
    0,
    Math.min(255, g + Math.floor(Math.random() * variation - variation / 2))
  );
  b = Math.max(
    0,
    Math.min(255, b + Math.floor(Math.random() * variation - variation / 2))
  );

  return rgb2hex(r, g, b);
};

const generateColorOptions = (correctColor, difficulty) => {
  const { colorVariation, optionCount } = DIFFICULTY_LEVELS[difficulty];
  const options = [correctColor];

  while (options.length < optionCount) {
    let newColor;
    if (difficulty === "easy") {
      newColor = generateRandomColor();
    } else if (difficulty === "medium") {
      newColor = generateRandomColor();
    } else if (difficulty === "hard") {
      newColor = adjustColor(correctColor, colorVariation * 0.25);
    }

    if (!options.includes(newColor)) {
      options.push(newColor);
    }
  }

  return options.sort(() => Math.random() - 0.5);
};

export default function ColorGame() {
  const [screen, setScreen] = useState("main-menu");
  const [difficulty, setDifficulty] = useState(null);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const backgroundMusicRef = useRef(null);
  const [targetColor, setTargetColor] = useState("");
  const [colorOptions, setColorOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameStatus, setGameStatus] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isColorRevealed, setIsColorRevealed] = useState(true);
  const [revealCountdown, setRevealCountdown] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [musicError, setMusicError] = useState(false);

  const handleQuit = () => {
    setIsModalOpen(true); 
  };

  const handleConfirmQuit = () => {
    setIsModalOpen(false); 
    setScreen("main-menu"); 
  };

  const handleCancelQuit = () => {
    setIsModalOpen(false); 
  };

  const startGame = (selectedDifficulty) => {
    const currentDifficultySettings = DIFFICULTY_LEVELS[selectedDifficulty];

    const newTargetColor = generateRandomColor();
    const newColorOptions = generateColorOptions(
      newTargetColor,
      selectedDifficulty
    );

    setDifficulty(selectedDifficulty);
    setTargetColor(newTargetColor);
    setColorOptions(newColorOptions);
    setScore(0);
    setGameStatus("");

    setRevealCountdown(currentDifficultySettings.revealTime);
    setTimeRemaining(currentDifficultySettings.timeLimit);
    setIsColorRevealed(true);

    setScreen("game");
  };


  useEffect(() => {
    if (!isColorRevealed || revealCountdown <= 0) return;

    const revealTimer = setTimeout(() => {
      setRevealCountdown((prev) => prev - 1);
      if (revealCountdown === 1) {
        setIsColorRevealed(false);
      }
    }, 1000);

    return () => clearTimeout(revealTimer);
  }, [revealCountdown, isColorRevealed]);

  // Game Timer Effect
  useEffect(() => {
    if (isColorRevealed || screen !== "game") return;

    const gameTimer = setTimeout(() => {
      if (timeRemaining > 0) {
        setTimeRemaining((prev) => prev - 1);
      } else {
        if (score > highScore) {
          setHighScore(score);
        }
        setScreen("game-over");
      }
    }, 1000);

    return () => clearTimeout(gameTimer);
  }, [timeRemaining, isColorRevealed, screen, score, highScore]);

  useEffect(() => {
    backgroundMusic.loop = true;
    backgroundMusicRef.current = backgroundMusic;

    return () => {
      backgroundMusic.pause();
      backgroundMusic.currentTime = 0;
    };
  }, []);

  useEffect(() => {
    if (isMusicPlaying && isSoundEnabled) {
      backgroundMusicRef.current
        .play()
        .catch((e) => console.log("Music play error"));
    } else {
      backgroundMusicRef.current.pause();
    }
  }, [isMusicPlaying, isSoundEnabled]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const audio = new Audio("/sounds/background-music.mp3");
      audio.loop = true;
      backgroundMusicRef.current = audio;

      audio.addEventListener("error", (e) => {
        console.error("Audio error:", e);
        setMusicError(true);
      });

      return () => {
        audio.pause();
        audio.currentTime = 0;
      };
    }
  }, []);

  useEffect(() => {
    const audio = backgroundMusicRef.current;
    if (!audio) return;

    const playPromise = isMusicPlaying ? audio.play() : audio.pause();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setMusicError(false);
        })
        .catch((error) => {
          console.error("Playback failed:", error);
          setMusicError(true);
          setIsMusicPlaying(false);
        });
    }
  }, [isMusicPlaying]);
  const handleGuess = (color) => {
    if (isColorRevealed) return;

    const currentDifficultySettings = DIFFICULTY_LEVELS[difficulty];

    if (color === targetColor) {
      if (isSoundEnabled) {
        correctSound.play();
      }
      createConfetti(); 

      const pointsEarned = currentDifficultySettings.pointsPerCorrect;
      setGameStatus(`Correct 😄!`);

      setTimeout(() => {
        setScore((prev) => prev + pointsEarned);
        const newTargetColor = generateRandomColor();
        const newColorOptions = generateColorOptions(
          newTargetColor,
          difficulty
        );

        setTargetColor(newTargetColor);
        setColorOptions(newColorOptions);
        setRevealCountdown(currentDifficultySettings.revealTime);
        setIsColorRevealed(true);
      }, 500);
    } else {
      if (isSoundEnabled) {
        incorrectSound.play();
      }
      setGameStatus("Wrong guess 😥!");
    }
  };
  const renderMusicButton = () => {
    if (musicError) {
      return (
        <Button size="lg" className="w-full bg-red-500 text-white" disabled>
          <Music4 className="mr-2" />
          <span className="font-montserrat">Music Unavailable</span>
        </Button>
      );
    }

    return (
      <Button
        size="lg"
        className="w-full"
        onClick={() => setIsMusicPlaying(!isMusicPlaying)}
      >
        {isMusicPlaying ? (
          <Music4 className="mr-2" />
        ) : (
          <Music className="mr-2" />
        )}
        <span className="font-montserrat">
          {isMusicPlaying ? "Stop Music" : "Play Music"}
        </span>
      </Button>
    );
  };

  const renderScreen = () => {
    switch (screen) {
      case "main-menu":
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center">
            <Card className="w-full max-w-md">
              <CardContent className="p-8 space-y-6 text-center">
                <h1 className="text-xl font-light font-pressStart text-purple-700">
                  Color Guessing Game
                </h1>
                <p className="text-lg font-montserrat">
                  Guess the correct color.
                </p>
                <div className="space-y-4">
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={() => setScreen("difficulty-menu")}
                  >
                    <Gamepad2 className="mr-2" />{" "}
                    <span className="font-montserrat">Start Game</span>
                  </Button>
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={() => setHighScore(0)} 
                  >
                    <RefreshCw className="mr-2" />{" "}
                    <span className="font-montserrat">Reset High Scores</span>
                  </Button>
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={() => setScreen("high-score")}
                  >
                    <Trophy className="mr-2" />{" "}
                    <span className="font-montserrat">High Score</span>
                  </Button>
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={() => setIsMusicPlaying(!isMusicPlaying)}
                  >
                    {isMusicPlaying ? (
                      <Music4Icon className="mr-2" />
                    ) : (
                      <Music className="mr-2" />
                    )}
                    <span className="font-montserrat">
                      {isMusicPlaying
                        ? "Stop Background Music"
                        : "Play Background Music"}
                    </span>
                  </Button>
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={() => setScreen("rules")}
                  >
                    <Clipboard className="mr-2" />{" "}
                    <span className="font-montserrat">Rules</span>
                  </Button>
                  {renderMusicButton}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "difficulty-menu":
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center">
            <Card className="w-full max-w-md">
              <CardContent className="p-8 space-y-6">
                <h2 className="text-2xl font-bold text-purple-700 font-pressStart text-center">
                  Select Difficulty level
                </h2>
                <div className="grid grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    className="flex flex-col items-center justify-center py-8 h-auto"
                    onClick={() => startGame("easy")}
                  >
                    <SmilePlus className="mb-2 h-6 w-6 text-yellow-500" />
                    <span className="font-montserrat">Easy</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex flex-col items-center justify-center py-8 h-auto"
                    onClick={() => startGame("medium")}
                  >
                    <Gauge className="mb-2 h-6 w-6 text-blue-500" />
                    <span className="font-montserrat">Medium</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex flex-col items-center justify-center py-8 h-auto"
                    onClick={() => startGame("hard")}
                  >
                    <Skull className="mb-2 h-6 w-6 text-red-500" />
                    <span className="font-montserrat">Hard</span>
                  </Button>
                </div>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => setScreen("main-menu")}
                >
                  <span className="font-montserrat">Back to Main Menu</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case "high-score":
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center">
            <Card className="w-full max-w-md text-center">
              <CardContent className="p-8 space-y-6">
                <h2 className="text-3xl font-bold font-pressStart text-purple-700">
                  High Score
                </h2>
                <p className="text-xl font-montserrat">
                  Your High Score: {highScore}
                </p>
                <Button
                  className="w-full"
                  onClick={() => setScreen("main-menu")}
                >
                  <span className="font-montserrat">Back to Main Menu</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case "rules":
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center">
            <Card className="w-full max-w-md text-center">
              <CardContent className="p-8 space-y-6">
                <h2 className="text-3xl font-bold font-pressStart text-purple-700">
                  Game Rules
                </h2>
                <p className="text-xl font-montserrat">
                  <strong>The objective of the game:</strong> Guess the correct
                  color based on the displayed target color. At the start, a
                  target color will be shown for a few seconds, after which
                  you’ll have to choose the correct match from several color
                  options. ✅<br />
                  <br />
                  <strong>⏳ Limited Time:</strong> You have a limited time to
                  make your guess. Race against the clock! ⏰
                  <br />
                  <strong>🎮 Difficulty Modes:</strong> Choose your challenge!
                  The game has three difficulty modes:
                  <ul>
                    <li>
                      <strong>Easy:</strong> Basic color matching.
                    </li>
                    <li>
                      <strong>Medium:</strong> Same colors, but with trickier
                      shades to choose from.
                    </li>
                    <li>
                      <strong>Hard:</strong> Same colors as the medium level,
                      but even more subtle differences in shades to test your
                      eyes!
                    </li>
                  </ul>
                  <br />
                  <strong>🚀 Point System:</strong> Each correct selection earns
                  you +1 point. Stay focused and rack up those points! 💯
                  <br />
                  <strong>🏆 Progressive Difficulty:</strong> As you advance,
                  the game becomes more challenging — different shades of the
                  same color make it trickier to identify the target color.
                  <br />
                  <strong>🏠 Navigation:</strong> You can return to the main
                  menu at any time by clicking the Quit Game button.
                  <br />
                  <strong>🎮 Enjoy the game!</strong> Best of luck and have fun!
                </p>

                <Button
                  className="w-full"
                  onClick={() => setScreen("main-menu")}
                >
                  <span className="font-montserrat">Back to Main Menu</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case "game":
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center">
            <Card className="w-full max-w-2xl">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-montserrat">
                    {DIFFICULTY_LEVELS[difficulty].name} Mode
                  </h2>
                  <div className="flex items-center space-x-4 font-montserrat">
                    <button
                      onClick={() => setIsSoundEnabled(!isSoundEnabled)}
                      className="p-2 rounded-full hover:bg-gray-100 transition"
                    >
                      {isSoundEnabled ? <Volume2 /> : <VolumeX />}
                    </button>
                    <span>Time: {timeRemaining}s</span>
                    <span data-testid="score">Score: {score}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <p
                  data-testid="gameInstructions"
                  className="text-lg text-center mb-4 font-montserrat"
                >
                  Guess the correct color.
                </p>
                {isColorRevealed ? (
                  <div className="text-center">
                    <h3 className="text-xl mb-4 font-montserrat">
                      Memorize the Color🧠!
                    </h3>
                    <div
                      data-testid="colorBox"
                      className="w-48 h-48 mx-auto rounded-lg animate-pulse"
                      style={{
                        backgroundColor: targetColor,
                      }}
                    />
                    <div className="mt-4 text-lg font-montserrat">
                      Reveal Countdown: {revealCountdown}s
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <h3
                      data-testid="gameStatus"
                      className="text-xl mb-4 font-montserrat"
                    >
                      {gameStatus || "Choose the Correct Color!"}
                    </h3>
                    <div className="grid grid-cols-3 gap-4 w-fit mx-auto">
                      {colorOptions.map((color, index) => (
                        <button
                          key={index}
                          data-testid="colorOption"
                          className="w-24 h-24 rounded-lg shadow-md transition-all duration-300 hover:scale-110 focus:outline-none"
                          style={{ backgroundColor: color }}
                          onClick={() => handleGuess(color)}
                        />
                      ))}
                    </div>
                    <Button className="w-full mt-3" onClick={handleQuit}>
                      <span className="font-montserrat">Quit Game</span>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            {isModalOpen && (
              <div className="backdrop-blur-0 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-12 h-50 rounded-lg shadow-lg">
                  <h3 className="text-xl mb-4 font-montserrat">
                    Are you sure you want to quit?
                  </h3>
                  <div className="flex justify-center items-center gap-2">
                    <Button onClick={handleConfirmQuit}>
                      <span className="font-montserrat">Yes</span>
                    </Button>
                    <Button onClick={handleCancelQuit}>
                      <span className="font-montserrat">No</span>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case "game-over":
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center">
            <Card className="w-full max-w-md text-center">
              <CardContent className="p-8 space-y-6">
                <h2 className="text-3xl font-bold font-montserrat">
                  Game Over😭!
                </h2>
                <div className="flex justify-center items-center space-x-2">
                  <Trophy className="text-yellow-500" size={24} />
                  <span className="text-2xl font-montserrat">
                    Score: {score}
                  </span>
                </div>
                <div className="flex justify-center items-center space-x-2">
                  <Star className="text-blue-500" size={24} />
                  <span className="text-xl font-montserrat">
                    High Score: {highScore}
                  </span>
                </div>
                <Button
                  data-testid="newGameButton"
                  className="w-full"
                  onClick={() => setScreen("difficulty-menu")}
                >
                  <RefreshCw className="mr-2" />{" "}
                  <span className="font-montserrat">Play Again</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full font-montserrat"
                  onClick={() => setScreen("main-menu")}
                >
                  Back to Main Menu
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return <div>Loading...</div>;
    }
  };

  return renderScreen();
}
