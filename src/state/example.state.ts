import { atom } from 'recoil';

const exampleState = atom({
    key: 'textState', // unique ID (with respect to other atoms/selectors)
    default: 'mems', // default value (aka initial value)
});

export default exampleState;
