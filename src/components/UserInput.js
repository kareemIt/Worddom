import React, { useState, useRef, useEffect } from 'react';
import Axios from 'axios';
import { getMapWord } from '../utils/word';

const UserInput = ({
  setCurrentRound,
  currentRound,
  currentTime,
  setCurrentTime,
  currentWord,
  setResults,
  setNextRound,
}) => {
  const [board, setBoard] = useState('');
  const copyArry = [];
  const inputEl = useRef(null);
  const [value, setValue] = useState('');
  const wordTracker = getMapWord(currentWord);

  const handleKeyDown = (e) => {
    let input = e.currentTarget.value;
    console.log(wordTracker.has(input));
    console.log(wordTracker.get(input) != 0);
    if (e.nativeEvent.inputType == 'deleteContentBackward') {
      let substring = input.substring(
        input[board.length] - 1,
        input[board.length]
      );
      setBoard(substring);
      setValue(substring);
      return;
    }
    if (wordTracker.has(input) && ordTracker.get(input) != 0) {
      wordTracker.set(input, wordTracker.get(input) - 1);
    }
    if (!currentWord.includes([...input][board.length].toLowerCase())) {
      return;
    }
    setValue(input);
    setBoard(input);
  };

  useEffect(() => {
    const focus = (e) => {
      if (inputEl.current) {
        inputEl.current.focus();
      }
    };
    document.addEventListener('keydown', focus);
    return () => {
      document.removeEventListener('keydown', focus);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputEl.current.value.length < 5) {
      return;
    }
    const data = Axios.get(
      'https://www.wordreference.com/es/translation.asp?tranword=' + board
    );
    data.then((value) => {
      const validWord = value.data.includes('dMatch = true');
      if (validWord) {
        setCurrentRound(currentRound + 1);
        setCurrentTime(currentTime + 10);
        copyArry.push(
          'Round:' + currentRound + ',word:' + board + ',letters:' + currentWord
        );
        setResults(copyArry);
        setValue('');
        setNextRound(true);
      } else {
        setCurrentTime(currentTime - 5);
        setValue('');
      }
      setBoard('');
      inputEl.current.value = '';
    });
  };
  return (
    <div>
      <div className="Game-board">
        {[...board.padEnd(5, ' ')].map((letter, index) => (
          <div className="user-letters">{letter.toUpperCase()}</div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          onChange={handleKeyDown}
          ref={inputEl}
          value={value}
          type="text"
          maxLength="5"
          className="user-input"
        />
      </form>
    </div>
  );
};
export default UserInput;
