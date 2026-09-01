(() => {

    async function loadInvitationData() {

        const params =
            new URLSearchParams(
                window.location.search
            );

        const token =
            params.get("i");

        if (!token) {
            console.warn(
                "No se encontró token de invitación."
            );

            return null;
        }

        try {

            const response =
                await fetch(
                    `/.netlify/functions/getInvitation?i=${encodeURIComponent(token)}`
                );

            if (!response.ok) {
                throw new Error(
                    `Error HTTP ${response.status}`
                );
            }

            const data =
                await response.json();

            return {
                token: data.token,
                family: data.familia,
                passes: data.pases
            };

        } catch (error) {

            console.error(
                "Error cargando invitación:",
                error
            );

            return null;
        }
    }


    window.invitationDataPromise =
        loadInvitationData();

})();