import { atom } from 'recoil';

const musicState = atom({
    key: 'musicState', // unique ID (with respect to other atoms/selectors)
    default: true, // default value (aka initial value)
});

export default musicState;
