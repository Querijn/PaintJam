import React, {useState, useEffect} from 'react';

import {useRecoilState} from 'recoil';

import * as Pixi from 'pixi.js';

import main from './main';

import TestBackground from '../assets/test-background.png';

const game = () => {
    const app = new Pixi.Application();

    const background = Pixi.Sprite.from(TestBackground);

    // Logic here
    useEffect(() => {
        main(app);

        document.body.appendChild(app.view);
    }, []);

    return <></>;
};

export default game;
