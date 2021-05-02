import { atom } from 'recoil';

const scoreState = atom({
    key: 'scoreState', // unique ID (with respect to other atoms/selectors)
    default: 0, // default value (aka initial value)
});

export default scoreState;
