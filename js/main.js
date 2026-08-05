const transitionLinks = document.querySelectorAll(".page-transition");
const pageLoader = document.getElementById("pageLoader");
const loaderText = document.querySelector(".loader-text");

const transitionAudio = new Audio("assets/audio/transition-click.mp3");
transitionAudio.volume = 0.35;

transitionLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
        const targetUrl = link.getAttribute("href");
        const customText = link.getAttribute("data-loading-text");

        if(!targetUrl){
            return;
        }

        event.preventDefault();

        if(loaderText && customText){
            loaderText.textContent = customText;
        }

        if(pageLoader){
            pageLoader.classList.add("active");
        }

        transitionAudio.currentTime = 0;

        transitionAudio.play().catch(() => {
        console.log("O áudio da transição não pôde ser reproduzido.");
        });

        setTimeout(() => {
            window.location.href = targetUrl;
        }, 1300);
    });
});