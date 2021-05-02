import { atom } from 'recoil';

const extraHits = atom({
    key: 'extrahits', // unique ID (with respect to other atoms/selectors)
    default: 3, // default value (aka initial value)
});

export default extraHits;
