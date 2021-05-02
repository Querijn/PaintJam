import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { v4 as uuidv4 } from 'uuid';

import GameCode from 'game-code';

import scoreState from 'state/score.state';
import musicState from 'state/music.state';
import extraHits from 'state/extraHits.state';

import music from './game-code/assets/ui_music_btn_1.png';
import mute from './game-code/assets/ui_music_btn_2.png';

const App = () => {
    const [score, setScore] = useRecoilState(scoreState);
    const [musicMuted, setMusicMuted] = useRecoilState(musicState);
    const [remainingHits, setRemainingHits] = useRecoilState(extraHits);

    const [bats, setBats]: any = useState([]);

    useEffect(() => {
        let bat: JSX.Element[] = [];
        console.log(`REMAINIING HITS: ${remainingHits}`);
        for (let i = 0; i < remainingHits; i++) {
            bat.push(<img src={'/assets/ui_bat.png'} key={uuidv4()} alt="" />);
            console.log(`Printing bat: ${i}`);
        }

        setBats(bat);
    }, []);

    const musicHandler = () => {
        switch (musicMuted) {
            case true:
                setMusicMuted(false);
                break;
            case false:
                setMusicMuted(true);
                break;
            default:
                setMusicMuted(false);
                break;
        }
    };

    return (
        <div>
            <div className="ui">
                <div className="section">{bats}</div>
                <div className="section">{score}</div>
                <div
                    className="section"
                    onClick={() => {
                        musicHandler();
                    }}
                >
                    {musicMuted ? <img src={mute} alt="" /> : <img src={music} alt="" />}
                </div>
            </div>
            <GameCode />
        </div>
    );
};

export default App;
