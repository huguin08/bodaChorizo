console.log("invitation.js cargado");

const openInvitationButton =
    document.getElementById("openInvitation");

const hero =
    document.getElementById("hero");

const welcome =
    document.getElementById("welcome");

const weddingAudio =
    document.getElementById("weddingAudio");

const musicIcon =
    document.getElementById("musicIcon");

console.log("Botón encontrado:", openInvitationButton);

const heroGuest =
    document.getElementById("heroGuest");

window.invitationDataPromise
    .then((data) => {

        if (!data || !heroGuest) {
            return;
        }

        heroGuest.textContent =
            data.family;

    });


if (openInvitationButton) {

    let isOpening = false;

    openInvitationButton.addEventListener(
        "click",
        () => {

            if (isOpening) {
                return;
            }

            isOpening = true;

            console.log(
                "Abriendo invitación 💍"
            );


            /*
             * Paso 1:
             * desaparecer sello
             */
            openInvitationButton.classList.add(
                "envelope--opening"
            );


            /*
             * Paso 2:
             * abrir solapa
             */
            setTimeout(() => {

                openInvitationButton.classList.add(
                    "envelope--open"
                );

            }, 350);


            /*
             * Paso 3:
             * sacar carta
             */
            setTimeout(() => {

                openInvitationButton.classList.add(
                    "envelope--card-out"
                );

            }, 800);


            /*
             * Paso 4:
             * entrar a la invitación
             */
            setTimeout(() => {

                openWedding();

            }, 1800);

        }
    );

} else {

    console.error(
        "No se encontró el botón #openInvitation"
    );

}


/* ============================
   OPEN WEDDING
============================ */

function openWedding() {

    console.log("Entrando a la invitación 🌿");

    if (hero) {
        hero.classList.add("hero--leaving");
    }

    startWeddingMusic();

    setTimeout(() => {

        /*
         * Primero mostramos
         * el contenido real
         */
        document.body.classList.add(
            "invitation-open"
        );

        /*
         * Después quitamos
         * la portada del layout
         */
        if (hero) {
            hero.classList.add(
                "hero--hidden"
            );
        }

        /*
         * Mandamos la vista al inicio
         * del módulo verde
         */
        if (welcome) {

            welcome.scrollIntoView({
                behavior: "instant",
                block: "start"
            });

        }

    }, 600);
}


/* ============================
   MUSIC
============================ */

async function startWeddingMusic() {

    if (!weddingAudio) {
        return;
    }

    try {

        await weddingAudio.play();

        if (musicIcon) {

            musicIcon.textContent =
                "❚❚";

        }

        console.log(
            "Música iniciada 🎵"
        );

    } catch (error) {

        /*
         * Safari/iOS u otro navegador
         * puede bloquear la reproducción.
         * El reproductor manual seguirá
         * funcionando.
         */

        console.log(
            "Autoplay bloqueado por el navegador.",
            error
        );

    }

}