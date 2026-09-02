(() => {

    const rsvpFamily =
        document.getElementById("rsvpFamily");

    const rsvpPasses =
        document.getElementById("rsvpPasses");

    const confirmButton =
        document.getElementById("rsvpConfirmButton");

    const declineButton =
        document.getElementById("rsvpDeclineButton");


    const modal =
        document.getElementById("rsvpModal");

    const modalBackdrop =
        document.getElementById("rsvpModalBackdrop");

    const modalClose =
        document.getElementById("rsvpModalClose");

    const modalCancel =
        document.getElementById("rsvpModalCancel");

    const modalConfirm =
        document.getElementById("rsvpModalConfirm");


    const modalEyebrow =
        document.getElementById("rsvpModalEyebrow");

    const modalTitle =
        document.getElementById("rsvpModalTitle");

    const modalFamily =
        document.getElementById("rsvpModalFamily");

    const modalPasses =
        document.getElementById("rsvpModalPasses");

    const modalPassesBlock =
        document.getElementById("rsvpModalPassesBlock");

    const modalMessage =
        document.getElementById("rsvpModalMessage");

    const modalBody =
        document.querySelector(".rsvp-modal__body");

    const RSVP_DEADLINE =
        new Date(
            "2026-11-10T23:59:59-06:00"
        );

    const deadlineNote =
        document.getElementById(
            "rsvpDeadlineNote"
        );


    if (
        !confirmButton ||
        !declineButton ||
        !modal
    ) {
        return;
    }


    /* ============================
       TEMPORARY DATA
    ============================ */

    let invitation = {
        token: null,
        family: "",
        passes: 0,
        status: null
    };


    let currentAction = null;

    function updateInvitationUI() {

        if (rsvpFamily) {
            rsvpFamily.textContent =
                invitation.family;
        }

        if (rsvpPasses) {
            rsvpPasses.textContent =
                invitation.passes;
        }


        modalFamily.textContent =
            invitation.family;

        modalPasses.textContent =
            invitation.passes;

        updateRSVPButtons();
    }

    function updateRSVPButtons() {

        // Estado normal por defecto
        rsvpConfirmButton.disabled = false;
        rsvpDeclineButton.disabled = false;

        rsvpConfirmButton.textContent =
            "Confirmar asistencia";

        rsvpDeclineButton.textContent =
            "No podremos asistir";


        if (
            invitation.status ===
            "CONFIRMADO"
        ) {

            rsvpConfirmButton.disabled =
                true;

            rsvpConfirmButton.textContent =
                "Asistencia confirmada";
        }


        if (
            invitation.status ===
            "NO_ASISTE"
        ) {

            rsvpDeclineButton.disabled =
                true;

            rsvpDeclineButton.textContent =
                "Respuesta registrada";
        }
    }

    function isRSVPClosed() {

        return new Date() >
            RSVP_DEADLINE;
    }

    function applyDeadlineState() {

        if (!isRSVPClosed()) {
            return;
        }


        confirmButton.disabled =
            true;

        declineButton.disabled =
            true;


        confirmButton.textContent =
            "Confirmación cerrada";

        declineButton.style.display =
            "none";


        if (deadlineNote) {

            deadlineNote.innerHTML =
                "El periodo para confirmar asistencia <strong>ha finalizado</strong>.";
        }
    }


    /* ============================
       OPEN / CLOSE
    ============================ */

    function openModal() {

        modal.classList.add("is-open");

        modal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.style.overflow =
            "hidden";
    }


    function closeModal() {

        modal.classList.remove("is-open");

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.style.overflow =
            "";

        currentAction = null;

        resetModal();
    }


    /* ============================
       RESET
    ============================ */

    function resetModal() {

        modalBody.classList.remove(
            "is-result"
        );

        modalEyebrow.textContent =
            "Confirmación";

        modalFamily.textContent =
            invitation.family;

        modalPasses.textContent =
            invitation.passes;

        modalPassesBlock.style.display =
            "";

        modalCancel.style.display =
            "";

        modalConfirm.style.display =
            "";

        modalConfirm.disabled =
            false;
    }


    /* ============================
       CONFIRM ATTENDANCE
    ============================ */

    function showConfirmModal() {

        resetModal();

        currentAction =
            "confirm";

        modalTitle.textContent =
            "Confirmar asistencia";

        modalMessage.textContent =
            "¿Deseas confirmar tu asistencia?";

        modalConfirm.textContent =
            "Sí, confirmar";

        openModal();
    }


    /* ============================
       DECLINE ATTENDANCE
    ============================ */

    function showDeclineModal() {

        resetModal();

        currentAction =
            "decline";

        modalTitle.textContent =
            "¿No podrán asistir?";

        modalPassesBlock.style.display =
            "none";

        modalMessage.textContent =
            "Registraremos que no podrán acompañarnos en este día tan especial.";

        modalConfirm.textContent =
            "Confirmar que no asistiremos";

        openModal();
    }


    /* ============================
       RESULT
    ============================ */

    function showResult() {

        modalBody.classList.add(
            "is-result"
        );

        modalPassesBlock.style.display =
            "none";

        modalCancel.style.display =
            "none";

        modalConfirm.textContent =
            "Cerrar";

        modalConfirm.disabled =
            false;


        if (
            currentAction ===
            "confirm"
        ) {

            modalEyebrow.textContent =
                "¡Gracias!";

            modalTitle.textContent =
                "Asistencia confirmada";

            modalMessage.textContent =
                `Hemos registrado ${invitation.passes} pases para ${invitation.family}.`;

        } else {

            modalEyebrow.textContent =
                "Gracias por avisarnos";

            modalTitle.textContent =
                "Confirmación registrada";

            modalMessage.textContent =
                "Lamentamos que no puedan acompañarnos, pero agradecemos mucho que nos lo hayan hecho saber.";
        }


        currentAction =
            "result";
    }

    async function saveRSVP(status) {

        try {

            modalConfirm.disabled = true;

            modalConfirm.textContent =
                "Guardando...";


            const response =
                await fetch(
                    "/.netlify/functions/updateRSVP",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            token:
                                invitation.token,

                            estado:
                                status
                        })
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {
                throw new Error(
                    data.error ||
                    "No se pudo guardar la confirmación"
                );
            }

            invitation.status =
                data.estado;

            updateRSVPButtons();


            showResult();


        } catch (error) {

            console.error(
                "Error guardando RSVP:",
                error
            );


            modalConfirm.disabled =
                false;

            modalConfirm.textContent =
                "Intentar nuevamente";


            modalMessage.textContent =
                "Ocurrió un error al guardar tu respuesta. Por favor intenta nuevamente.";
        }
    }


    /* ============================
       EVENTS
    ============================ */

    confirmButton.addEventListener(
        "click",
        showConfirmModal
    );


    declineButton.addEventListener(
        "click",
        showDeclineModal
    );


    modalConfirm.addEventListener(
        "click",
        async () => {

            if (
                currentAction ===
                "result"
            ) {
                closeModal();
                return;
            }


            if (
                currentAction ===
                "confirm"
            ) {
                await saveRSVP(
                    "CONFIRMADO"
                );

                return;
            }


            if (
                currentAction ===
                "decline"
            ) {
                await saveRSVP(
                    "NO_ASISTE"
                );
            }
        }
    );


    modalCancel.addEventListener(
        "click",
        closeModal
    );


    modalClose.addEventListener(
        "click",
        closeModal
    );


    modalBackdrop.addEventListener(
        "click",
        closeModal
    );


    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape" &&
                modal.classList.contains(
                    "is-open"
                )
            ) {
                closeModal();
            }

        }
    );

    window.invitationDataPromise
        .then((data) => {

            if (!data) {
                return;
            }

            invitation = data;

            updateInvitationUI();

            applyDeadlineState();

        });


})();