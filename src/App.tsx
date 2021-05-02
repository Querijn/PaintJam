import GameCode from 'game-code';
import React, { useEffect, useState } from 'react';

import { useRecoilState } from 'recoil';
import extraHits from 'state/extraHits.state';
import highscoreState from 'state/highscore.state';
import musicState from 'state/music.state';
import { setMute } from './game-code/sound';

import scoreState from 'state/score.state';
import { v4 as uuidv4 } from 'uuid';

import music from './game-code/assets/ui_music_btn_1.png';
import mute from './game-code/assets/ui_music_btn_2.png';

const App = () => {
    const [highscore, setHighscore] = useRecoilState(highscoreState);
    const [score, setScore] = useRecoilState(scoreState);
    const [musicMuted, setMusicMuted] = useRecoilState(musicState);
    const [remainingHits, setRemainingHits] = useRecoilState(extraHits);

    const [bats, setBats]: any = useState([]);
    const [volume, setVolume] = useState(1.0);

    useEffect(() => {
        let bat: JSX.Element[] = [];
        for (let i = 0; i < remainingHits; i++) {
            bat.push(<img src={'/assets/ui_bat.png'} key={uuidv4()} alt="" />);
        }
        setBats(bat);
        document.getElementById('startscreen')?.addEventListener('click', () => {
            document.getElementById('startscreen')?.classList.add('fadeout');
            setTimeout(() => {
                document.getElementById('startscreen')?.remove();
            }, Number.parseInt(document.getElementById('startscreen')?.style.animationDuration || '0'));
        });
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
        setMute(musicMuted);
    };

    return (
        <div>
            <div className="startscreen" id="startscreen">
                <div className="blink">Click to start.</div>
            </div>
            <div className="ui">
                <div className="section">{bats}</div>
                <div className="section">Highscore: {highscore}</div>
                <div
                    className="section"
                    id="music"
                    onClick={() => {
                        musicHandler();
                    }}
                >
                    {musicMuted ? <img src={music} alt="" /> : <img src={mute} alt="" />}
                </div>
            </div>
            <GameCode />
        </div>
    );
};

export default App;
