import GameCode from 'game-code';
import React, { useEffect, useState } from 'react';

import ReactAudioPlayer from 'react-audio-player';
import { useRecoilState } from 'recoil';
import extraHits from 'state/extraHits.state';
import musicState from 'state/music.state';

import scoreState from 'state/score.state';
import { v4 as uuidv4 } from 'uuid';

import music from './game-code/assets/ui_music_btn_1.png';
import mute from './game-code/assets/ui_music_btn_2.png';

const App = () => {
    const [score, setScore] = useRecoilState(scoreState);
    const [musicMuted, setMusicMuted] = useRecoilState(musicState);
    const [remainingHits, setRemainingHits] = useRecoilState(extraHits);

    const [bats, setBats]: any = useState([]);
    const [volume, setVolume] = useState(1.0);

    const audioTune = new Audio('/assets/Canned_Warhol_Mix_1.mp3');

    useEffect(() => {
        let bat: JSX.Element[] = [];
        for (let i = 0; i < remainingHits; i++) {
            bat.push(<img src={'/assets/ui_bat.png'} key={uuidv4()} alt="" />);
        }
        setBats(bat);
    }, []);

    useEffect(() => {
        let bat: JSX.Element[] = [];
        for (let i = 0; i < remainingHits; i++) {
            bat.push(<img src={'/assets/ui_bat.png'} key={uuidv4()} alt="" />);
        }
        setBats(bat);
    }, [remainingHits]);

    useEffect(() => {
        if (musicMuted) {
            setVolume(1.0);
        } else {
            setVolume(0.0);
        }
    }, [musicMuted]);

    const musicHandler = () => {
        setMusicMuted(!musicMuted);
    };

    return (
        <div>
            <div className="ui">
                <div className="section">{bats}</div>
                <div className="section">{score}</div>
                <div
                    className="section"
                    id="music"
                    onClick={() => {
                        musicHandler();
                    }}
                >
                    <ReactAudioPlayer src="/assets/Canned_Warhol_Mix_1.mp3" autoPlay volume={volume} loop />
                    {musicMuted ? <img src={music} alt="" /> : <img src={mute} alt="" />}
                </div>
            </div>
            <GameCode />
        </div>
    );
};

export default App;
