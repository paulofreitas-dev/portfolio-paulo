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
        }, 1000);
    });
});

function initSectionPager(){
    const pager = document.querySelector("[data-section-pager]");

    if(!pager)
        return;

    const desktopBreakpoint = 900;

    if(window.innerWidth <= desktopBreakpoint)
        return;

    const sections = Array.from(pager.querySelectorAll(".page-section"));
    const sectionDots = Array.from(document.querySelectorAll(".section-dot"));
    const sectionLinks = Array.from(document.querySelectorAll(".pager-link"));

    let currentIndex = sections.findIndex((section) => section.classList.contains("active"));
    let isChangingSection = false;

    const animationDuration = 650;
    const wheelThreshold = 25;

    if(currentIndex < 0){
        currentIndex = 0;
        section[currentIndex].classList.add("active");
    }

    function updateDots(){
        const currentSectionName = sections[currentIndex].dataset.sectionName;

        sectionDots.forEach((dot) => {
            const dotTarget = dot.dataset.sectionTarget;
            dot.classList.toggle("active", dotTarget == currentSectionName);
        });
    }

    function getSectionIndexByName(sectionName){
        return sections.findIndex((section) => section.dataset.sectionName == sectionName);
    }

    function goToSection(targetIndex){
        if(isChangingSection)
            return;

        if(targetIndex < 0 || targetIndex >= sections.length)
            return;

        if(targetIndex === currentIndex)
            return;

        isChangingSection = true;

        sections[currentIndex].classList.remove("active");
        currentIndex = targetIndex;
        sections[currentIndex].classList.add("active");

        updateDots();

        setTimeout(() => {
            isChangingSection = false;
        }, animationDuration);
    }
    
    function goToNextSection(){
        goToSection(currentIndex + 1);
    }

    function goToPreviousSection(){
        goToSection(currentIndex - 1);
    }

    window.addEventListener("wheel", (event) => {
        if(window.innerWidth <= desktopBreakpoint)
            return;

        const scrollAmount = event.deltaY;

        if(Math.abs(scrollAmount) < wheelThreshold)
            return;

        event.preventDefault();

        if(scrollAmount > 0)
            goToNextSection();

        else
            goToPreviousSection();

    }, { passive: false});

    window.addEventListener("keydowm", (event) => {
        if(window.innerWidth <= desktopBreakpoint)
            return;

        if(event.key === "ArrowDown" || event.key === "PageDown")
            goToNextSection();

        if(event.key === "ArrowUp" || event.key === "PageUp")
            goToPreviousSection();

        if(event.key === "Home")
            goToSection(0);

        if(event.key === "End")
            goToSection(sections.length - 1);

    });

    sectionDots.forEach((dot) => {
        dot.addEventListener("click", () => {
            const targetName = dot.dataset.sectionTarget;
            const targetIndex = getSectionIndexByName(targetName);

            goToSection(targetIndex);
        });
    });

    sectionLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();

            const targetName = link.dataset.sectionTarget;
            const targetIndex = getSectionIndexByName(targetName);

            goToSection(targetIndex);
        });
    });

    updateDots();
}

initSectionPager();