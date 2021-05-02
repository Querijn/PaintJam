import React, { useLayoutEffect, useState, useEffect } from 'react';

import * as Pixi from 'pixi.js';

import main from './main';

const game = () => {
    const app = new Pixi.Application({ antialias: true, backgroundColor: 0xf2ecea });

    window.addEventListener('resize', () => {
        app.renderer.resize(window.innerWidth, window.innerHeight * 0.9);
    });

    // Logic here
    useEffect(() => {
        main(app);
        app.renderer.resize(window.innerWidth, window.innerHeight * 0.9);

        document.getElementById('music')?.addEventListener('click', () => {});

        document.getElementById('root')?.appendChild(app.view);
    }, []);

    return <div id="parallax" />;
};

export default game;
