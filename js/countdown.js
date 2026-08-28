(() => {

    const daysElement =
        document.getElementById("countdownDays");

    const hoursElement =
        document.getElementById("countdownHours");

    const minutesElement =
        document.getElementById("countdownMinutes");

    const secondsElement =
        document.getElementById("countdownSeconds");


    if (
        !daysElement ||
        !hoursElement ||
        !minutesElement ||
        !secondsElement
    ) {
        return;
    }


    const weddingDate =
        new Date("2026-12-12T15:00:00-06:00");


    function pad(value) {
        return String(value)
            .padStart(2, "0");
    }


    function updateCountdown() {

        const now =
            new Date();

        const difference =
            weddingDate.getTime() -
            now.getTime();


        if (difference <= 0) {

            daysElement.textContent = "00";
            hoursElement.textContent = "00";
            minutesElement.textContent = "00";
            secondsElement.textContent = "00";

            return;
        }


        const totalSeconds =
            Math.floor(
                difference / 1000
            );


        const days =
            Math.floor(
                totalSeconds / 86400
            );


        const hours =
            Math.floor(
                (totalSeconds % 86400) / 3600
            );


        const minutes =
            Math.floor(
                (totalSeconds % 3600) / 60
            );


        const seconds =
            totalSeconds % 60;


        daysElement.textContent =
            String(days);

        hoursElement.textContent =
            pad(hours);

        minutesElement.textContent =
            pad(minutes);

        secondsElement.textContent =
            pad(seconds);
    }


    updateCountdown();

    setInterval(
        updateCountdown,
        1000
    );

})();