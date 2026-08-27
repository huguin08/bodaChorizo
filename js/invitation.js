console.log("invitation.js cargado");

const openInvitationButton =
    document.getElementById("openInvitation");

console.log("Botón encontrado:", openInvitationButton);

if (openInvitationButton) {
    openInvitationButton.addEventListener("click", () => {
        console.log("Invitación abierta 💍");
    });
} else {
    console.error("No se encontró el botón #openInvitation");
}