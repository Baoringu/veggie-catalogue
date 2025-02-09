document.addEventListener("DOMContentLoaded", function () {
    const elements = document.querySelectorAll(".scroll-reveal");

    function revealOnScroll() {
        elements.forEach((el) => {
            const windowHeight = window.innerHeight;
            const elementTop = el.getBoundingClientRect().top;
            const revealPoint = 100;

            if (elementTop < windowHeight - revealPoint) {
                el.classList.add("visible");
            }
        });
    }

    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll(); // Zavoláme hned, aby se prvky zobrazily i při načtení stránky
});
