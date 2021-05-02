import { Howl } from 'howler';

let sounds = {
    soupLaunch: new Howl({ src: ['assets/sounds/soup_launch.mp3'] }),
    batHit: new Howl({ src: ['assets/sounds/bat_hit.mp3'] }),
    powerUp: new Howl({ src: ['assets/sounds/power_up.mp3'] }),
    canGround: new Howl({ src: ['assets/sounds/can_ground.mp3'] }),
};

var music = new Howl({
    src: ['assets/Canned_Warhol_Mix_1.mp3'],
    loop: true,
    volume: 0.5,
});

let muted = false;

export function setMute(shouldMute: boolean) {
    muted = shouldMute;
    if (muted) {
        music.stop();
    } else {
        music.play();
    }
}

export default function playSound(name: string) {
    const sound = sounds[name];
    if (!sound) {
        console.error(`Sound '${name}' does not exist`);
        return;
    }
    if (muted) {
        return;
    }

    sounds[name].play();
}

export function playMusic() {
    if (!music.playing()) {
        music.play();
    }
}
