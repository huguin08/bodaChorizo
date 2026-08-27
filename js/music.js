const audio =
    document.getElementById("weddingAudio");

const musicToggle =
    document.getElementById("musicToggle");

const musicIcon =
    document.getElementById("musicIcon");

const progress =
    document.getElementById("musicProgress");

const progressFill =
    document.getElementById("musicProgressFill");

const musicTime =
    document.getElementById("musicTime");


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


/* ============================
   PLAY / PAUSE
============================ */

musicToggle.addEventListener(
    "click",
    async () => {

        if (audio.paused) {

            try {

                await audio.play();

                musicIcon.textContent = "❚❚";

                musicToggle.setAttribute(
                    "aria-label",
                    "Pausar Sailing"
                );

            } catch (error) {

                console.error(
                    "No se pudo reproducir el audio:",
                    error
                );

            }

        } else {

            audio.pause();

            musicIcon.textContent = "▶";

            musicToggle.setAttribute(
                "aria-label",
                "Reproducir Sailing"
            );

        }

    }
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

        musicTime.textContent =
            formatTime(audio.currentTime);

    }
);


/* ============================
   SEEK
============================ */

progress.addEventListener(
    "click",
    (event) => {

        if (!audio.duration) {
            return;
        }

        const rect =
            progress.getBoundingClientRect();

        const clickPosition =
            event.clientX - rect.left;

        const percentage =
            clickPosition / rect.width;

        audio.currentTime =
            percentage * audio.duration;

    }
);


/* ============================
   SONG FINISHED
============================ */

audio.addEventListener(
    "ended",
    () => {

        musicIcon.textContent = "▶";

        progressFill.style.width = "0%";

        musicTime.textContent = "0:00";

    }
);