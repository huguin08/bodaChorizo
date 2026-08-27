console.log("invitation.js cargado");

const openInvitationButton =
    document.getElementById("openInvitation");

console.log("Botón encontrado:", openInvitationButton);

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

        }
    );

} else {
    console.error("No se encontró el botón #openInvitation");
}