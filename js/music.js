(() => {

    console.log("music.js cargado");

    const audio =
        document.getElementById("weddingAudio");

    const toggleButton =
        document.getElementById("musicToggle");

    const icon =
        document.getElementById("musicIcon");

    const progressBar =
        document.getElementById("musicProgress");

    const progressFill =
        document.getElementById("musicProgressFill");

    const timeDisplay =
        document.getElementById("musicTime");

    const volumeToggle =
        document.getElementById("volumeToggle");

    const volumeIcon =
        document.getElementById("volumeIcon");

    const volumeRange =
        document.getElementById("volumeRange");


    if (
        !audio ||
        !toggleButton ||
        !icon ||
        !progressBar ||
        !progressFill ||
        !timeDisplay ||
        !volumeToggle ||
        !volumeIcon ||
        !volumeRange
    ) {

        console.error(
            "No se encontraron todos los elementos del reproductor."
        );

        return;
    }


    let previousVolume = 0.7;


    /* ============================
       INITIAL VOLUME
    ============================ */

    audio.volume = 0.7;

    volumeRange.value = audio.volume;


    function formatTime(seconds) {

        if (!Number.isFinite(seconds)) {
            return "0:00";
        }

        const minutes =
            Math.floor(seconds / 60);

        const remainingSeconds =
            Math.floor(seconds % 60)
                .toString()
                .padStart(2, "0");

        return `${minutes}:${remainingSeconds}`;
    }


    function updatePlayerState() {

        if (audio.paused) {

            icon.textContent = "▶";

            toggleButton.setAttribute(
                "aria-label",
                "Reproducir Sailing"
            );

        } else {

            icon.textContent = "❚❚";

            toggleButton.setAttribute(
                "aria-label",
                "Pausar Sailing"
            );

        }

    }


    function updateVolumeIcon() {

        if (
            audio.muted ||
            audio.volume === 0
        ) {

            volumeIcon.textContent = "🔇";

            volumeToggle.setAttribute(
                "aria-label",
                "Activar sonido"
            );

        } else if (audio.volume < 0.5) {

            volumeIcon.textContent = "🔉";

            volumeToggle.setAttribute(
                "aria-label",
                "Silenciar música"
            );

        } else {

            volumeIcon.textContent = "🔊";

            volumeToggle.setAttribute(
                "aria-label",
                "Silenciar música"
            );

        }

    }


    function updateVolumeTrack() {

        const percentage =
            Number(volumeRange.value) * 100;

        volumeRange.style.background =
            `linear-gradient(
                to right,
                var(--color-gold) 0%,
                var(--color-gold) ${percentage}%,
                rgba(89, 101, 78, 0.18) ${percentage}%,
                rgba(89, 101, 78, 0.18) 100%
            )`;

    }


    /* ============================
       PLAY / PAUSE
    ============================ */

    toggleButton.addEventListener(
        "click",
        async () => {

            if (audio.paused) {

                try {

                    await audio.play();

                } catch (error) {

                    console.error(
                        "No se pudo reproducir el audio:",
                        error
                    );

                }

            } else {

                audio.pause();

            }

        }
    );


    /* ============================
       AUDIO STATE
    ============================ */

    audio.addEventListener(
        "play",
        updatePlayerState
    );

    audio.addEventListener(
        "pause",
        updatePlayerState
    );


    /* ============================
       PROGRESS
    ============================ */

    audio.addEventListener(
        "timeupdate",
        () => {

            if (!audio.duration) {
                return;
            }

            const percentage =
                (
                    audio.currentTime /
                    audio.duration
                ) * 100;

            progressFill.style.width =
                `${percentage}%`;

            timeDisplay.textContent =
                formatTime(audio.currentTime);

        }
    );


    /* ============================
       SEEK
    ============================ */

    progressBar.addEventListener(
        "click",
        (event) => {

            if (!audio.duration) {
                return;
            }

            const rect =
                progressBar.getBoundingClientRect();

            const clickPosition =
                event.clientX - rect.left;

            const percentage =
                Math.min(
                    Math.max(
                        clickPosition / rect.width,
                        0
                    ),
                    1
                );

            audio.currentTime =
                percentage * audio.duration;

        }
    );


    /* ============================
       VOLUME RANGE
    ============================ */

    volumeRange.addEventListener(
        "input",
        () => {

            const newVolume =
                Number(volumeRange.value);

            audio.volume =
                newVolume;

            audio.muted =
                newVolume === 0;

            if (newVolume > 0) {

                previousVolume =
                    newVolume;

            }

            updateVolumeIcon();

            updateVolumeTrack();

        }
    );


    /* ============================
       MUTE / UNMUTE
    ============================ */

    volumeToggle.addEventListener(
        "click",
        () => {

            if (
                audio.muted ||
                audio.volume === 0
            ) {

                audio.muted = false;

                audio.volume =
                    previousVolume || 0.7;

                volumeRange.value =
                    audio.volume;

            } else {

                previousVolume =
                    audio.volume;

                audio.muted = true;

                volumeRange.value = 0;

            }

            updateVolumeIcon();

            updateVolumeTrack();

        }
    );


    /* ============================
       FINISHED
    ============================ */

    audio.addEventListener(
        "ended",
        () => {

            progressFill.style.width =
                "0%";

            timeDisplay.textContent =
                "0:00";

            updatePlayerState();

        }
    );


    /* ============================
       INITIAL STATE
    ============================ */

    updatePlayerState();

    updateVolumeIcon();

    updateVolumeTrack();

})();