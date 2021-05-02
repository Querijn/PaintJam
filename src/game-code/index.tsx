import React, { useLayoutEffect, useState, useEffect } from 'react';
import ReactAudioPlayer from 'react-audio-player';

//import music from './assets/Canned_Warhol_Mix_1.mp3';

import { useRecoilState } from 'recoil';

import * as Pixi from 'pixi.js';

import main from './main';

function useWindowSize() {
    const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
        function updateSize() {
            setSize([window.innerWidth, window.innerHeight]);
        }
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);
    return size;
}

const game = () => {
    const app = new Pixi.Application({ antialias: true, backgroundColor: 0xf2ecea });

    const audioTune = new Audio('/assets/Canned_Warhol_Mix_1.mp3');

    const [width, height] = useWindowSize();
    useEffect(() => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
    }, [width, height]);

    // Logic here
    useEffect(() => {
        main(app);
        app.renderer.resize(window.innerWidth, window.innerHeight);
        audioTune.loop = true;
        audioTune.load();
        document.getElementById('root')?.appendChild(app.view);
    }, []);

    return <div id="parallax">{/* <ReactAudioPlayer src="assets/Canned_Warhol_Mix_1.mp3" autoPlay={true} /> */}</div>;
};

export default game;
