import React, { useState, useEffect } from 'react';

import { useRecoilState } from 'recoil';

import * as Pixi from 'pixi.js';

import main from './main';

import TestBackground from './assets/test-background.png';

const game = () => {
    const app = new Pixi.Application({ antialias: true, backgroundColor: 0xf2ecea });

    const background = Pixi.Sprite.from(TestBackground);

    // Logic here
    useEffect(() => {
        main(app);
        app.renderer.resize(window.innerWidth - 1, window.innerHeight - 2);
        document.getElementById('root')?.appendChild(app.view);
    }, []);

    return <div id="parallax" />;
};

export default game;
