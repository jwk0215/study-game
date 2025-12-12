export class SoundUtil {
    static soundManager = new Map<string, HTMLAudioElement>();


    static addSound(name: string, src: string) {
        this.soundManager.set(name, new Audio(src));
    }


    static playSound(name: string) {
        const audio = this.soundManager.get(name);

        if (!audio) return;
        audio.currentTime = 0;
        audio.play();
    }
}