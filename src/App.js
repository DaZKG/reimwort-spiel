import React, { useState } from "react";
import "./App.css";

const wordPairs = [
  { words: ["Tisch", "Fisch"], images: ["tisch.png", "fisch.png"] },
  { words: ["Kopf", "Topf"], images: ["kopf.png", "topf.png"] },
  { words: ["Wiege", "Ziege"], images: ["wiege.png", "ziege.png"] },
  { words: ["Rose", "Hose"], images: ["rose.png", "hose.png"] },
  { words: ["Hase", "Nase"], images: ["hase.png", "nase.png"] },
  { words: ["Pudel", "Nudel"], images: ["pudel.png", "nudel.png"] },
  { words: ["Hund", "Mund"], images: ["hund.png", "mund.png"] },
  { words: ["Maus", "Haus"], images: ["maus.png", "haus.png"] },
  { words: ["Hahn", "Zahn"], images: ["hahn.png", "zahn.png"] },
  { words: ["Schwein", "Bein"], images: ["schwein.png", "bein.png"] },
  { words: ["Kuh", "Schuh"], images: ["kuh.png", "schuh.png"] },
  { words: ["Schlange", "Zange"], images: ["schlange.png", "zange.png"] },
];

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "de-DE";
  utterance.rate = 0.6; // langsamer sprechen
  speechSynthesis.speak(utterance);
}

function shuffle(array) {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

function App() {
  const [round, setRound] = useState(null); // 1 oder 2
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [expectedWord, setExpectedWord] = useState(null);
  const [feedback, setFeedback] = useState({});
  const [finished, setFinished] = useState(false);
  const [shuffledImages, setShuffledImages] = useState([]);

  const startRound1 = () => {
    setRound(1);
    setCurrentPairIndex(0);
    setStep(0);
    setFinished(false);

    // Bilder einmal mischen für Runde 1
    setShuffledImages(
      shuffle(
        wordPairs.flatMap((pair, pairIndex) =>
          pair.words.map((word, i) => ({
            word,
            img: pair.images[i],
            key: pairIndex + "-" + i
          }))
        )
      )
    );

    speak(wordPairs[0].words[0]);
    setExpectedWord(wordPairs[0].words[0]);
  };

  const startRound2 = () => {
    setRound(2);
    setCurrentPairIndex(0);
    setStep(0);
    setFinished(false);

    // Bilder einmal mischen für Runde 2
    setShuffledImages(
      shuffle(
        wordPairs.flatMap((pair, pairIndex) =>
          pair.words.map((word, i) => ({
            word,
            img: pair.images[i],
            key: pairIndex + "-" + i
          }))
        )
      )
    );

    speak(wordPairs[0].words[0] + " – " + wordPairs[0].words[1]);
    setExpectedWord(wordPairs[0].words[0]);
  };

  const handleClick = (word, index) => {
    if (!expectedWord) return;

    if (word === expectedWord) {
      setFeedback({ [index]: "correct" });
      setTimeout(() => setFeedback({}), 600);

      if (round === 1) {
        if (step === 0) {
          speak(wordPairs[currentPairIndex].words[1]);
          setExpectedWord(wordPairs[currentPairIndex].words[1]);
          setStep(1);
        } else if (step === 1) {
          speak(
            wordPairs[currentPairIndex].words[0] +
              " – " +
              wordPairs[currentPairIndex].words[1]
          );
          nextPair();
        }
      }

      if (round === 2) {
        if (step === 0) {
          setExpectedWord(wordPairs[currentPairIndex].words[1]);
          setStep(1);
        } else if (step === 1) {
          nextPair();
        }
      }
    } else {
      setFeedback({ [index]: "wrong" });
      setTimeout(() => setFeedback({}), 600);
      speak(expectedWord);
    }
  };

  const nextPair = () => {
    if (currentPairIndex < wordPairs.length - 1) {
      const newIndex = currentPairIndex + 1;
      setCurrentPairIndex(newIndex);
      setStep(0);
      if (round === 1) {
        speak(wordPairs[newIndex].words[0]);
        setExpectedWord(wordPairs[newIndex].words[0]);
      } else {
        speak(
          wordPairs[newIndex].words[0] +
            " – " +
            wordPairs[newIndex].words[1]
        );
        setExpectedWord(wordPairs[newIndex].words[0]);
      }
    } else {
      if (round === 1) {
        speak("Du hast alle Reimwörter gefunden.");
        setExpectedWord(null);
        setRound(null);
        setFinished("round1");
      } else {
        speak("Super gemacht! Alle Runden geschafft.");
        setExpectedWord(null);
        setRound(null);
        setFinished("round2");
      }
    }
  };

  return (
    <div className="App">
      <h1>Reimwort-Spiel</h1>

      {!finished && round === null && (
        <div className="buttons">
          <button onClick={startRound1}>Runde 1 starten</button>
        </div>
      )}

      {finished === "round1" && (
        <div className="end-screen">
          <h2>Du hast alle Reimwörter gefunden 🎉</h2>
          <button onClick={startRound2}>Runde 2 starten</button>
        </div>
      )}

      {finished === "round2" && (
        <div className="end-screen">
          <h2>Super gemacht! 🎉</h2>
          <p>Alle Runden geschafft.</p>
          <button onClick={startRound1}>Nochmal spielen</button>
        </div>
      )}

      {!finished && (
        <div className="grid">
          {shuffledImages.map(item => {
            const imgPath = process.env.PUBLIC_URL + "/Images/" + item.img;
            return (
              <img
                key={item.key}
                src={imgPath}
                alt={item.word}
                onClick={() => handleClick(item.word, item.key)}
                className={feedback[item.key]}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default App;
