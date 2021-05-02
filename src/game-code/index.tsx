import React, { useState, useEffect } from 'react';
import ReactAudioPlayer from 'react-audio-player';

//import music from './assets/Canned_Warhol_Mix_1.mp3';

import { useRecoilState } from 'recoil';

import * as Pixi from 'pixi.js';

import main from './main';

import TestBackground from './assets/test-background.png';

const game = () => {
    const app = new Pixi.Application({ antialias: true, backgroundColor: 0xf2ecea });

    const background = Pixi.Sprite.from(TestBackground);

    const audioTune = new Audio('/assets/Canned_Warhol_Mix_1.mp3');

    // Logic here
    useEffect(() => {
        main(app);
        app.renderer.resize(window.innerWidth - 1, window.innerHeight - 2);
        audioTune.load();
        document.getElementById('root')?.appendChild(app.view);
    }, []);

    return (
        <div id="parallax">
            <ReactAudioPlayer src="assets/Canned_Warhol_Mix_1.mp3" autoPlay={true} />
        </div>
    );
};

export default game;
