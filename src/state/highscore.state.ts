import { atom } from 'recoil';

const highscoreState = atom({
    key: 'highscoreState', // unique ID (with respect to other atoms/selectors)
    default: 0, // default value (aka initial value)
});

export default highscoreState;
