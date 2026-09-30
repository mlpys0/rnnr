const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const closeBtn = document.getElementById("lightbox-close");
const prevBtn = document.getElementById("lightbox-prev");
const nextBtn = document.getElementById("lightbox-next");

const triggers = Array.from(
  document.querySelectorAll(".lightbox-trigger")
);

const groups = {};

triggers.forEach((trigger) => {
  const name = trigger.dataset.group || "default";

  if (!groups[name]) {
    groups[name] = [];
  }

  groups[name].push(trigger);
});

let currentGroupName = "";
let currentIndex = 0;


function showImage() {
  const group = groups[currentGroupName] || [];
  const trigger = group[currentIndex];

  if (!trigger) return;

  lightboxImage.src = trigger.getAttribute("href");

  const thumbnail = trigger.querySelector("img");

  lightboxImage.alt = thumbnail
    ? thumbnail.alt
    : "";
}


function openLightbox(groupName, index) {
  currentGroupName = groupName;
  currentIndex = index;

  showImage();

  lightbox.classList.add("is-open");

  document.body.style.overflow = "hidden";
}


function closeLightbox() {
  lightbox.classList.remove("is-open");

  lightboxImage.src = "";

  document.body.style.overflow = "";
}


function showPrev() {
  const group = groups[currentGroupName] || [];

  if (!group.length) return;

  currentIndex =
    (currentIndex - 1 + group.length)
    % group.length;

  showImage();
}


function showNext() {
  const group = groups[currentGroupName] || [];

  if (!group.length) return;

  currentIndex =
    (currentIndex + 1)
    % group.length;

  showImage();
}


triggers.forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    event.preventDefault();

    const groupName =
      trigger.dataset.group || "default";

    const index =
      groups[groupName].indexOf(trigger);

    openLightbox(groupName, index);
  });
});


closeBtn?.addEventListener(
  "click",
  closeLightbox
);

prevBtn?.addEventListener(
  "click",
  showPrev
);

nextBtn?.addEventListener(
  "click",
  showNext
);


lightbox?.addEventListener(
  "click",
  (event) => {

    if (event.target === lightbox) {
      closeLightbox();
    }

  }
);


document.addEventListener(
  "keydown",
  (event) => {

    if (
      !lightbox?.classList.contains("is-open")
    ) {
      return;
    }

    if (event.key === "Escape") {
      closeLightbox();
    }

    if (event.key === "ArrowLeft") {
      showPrev();
    }

    if (event.key === "ArrowRight") {
      showNext();
    }

  }
);


/* スマホの左右スワイプ */

let touchStartX = 0;


lightbox?.addEventListener(
  "touchstart",
  (event) => {

    touchStartX =
      event.changedTouches[0].clientX;

  },
  {
    passive: true
  }
);


lightbox?.addEventListener(
  "touchend",
  (event) => {

    const touchEndX =
      event.changedTouches[0].clientX;

    const diff =
      touchEndX - touchStartX;


    if (diff > 50) {
      showPrev();
    }

    if (diff < -50) {
      showNext();
    }

  },
  {
    passive: true
  }
);

/* =========================================
   SCROLL REVEAL
========================================= */

const revealTargets = document.querySelectorAll(
  ".card, .character-preview"
);

const revealObserver = new IntersectionObserver(
  (entries, observer) => {

    entries.forEach((entry) => {

      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");

        observer.unobserve(entry.target);
      }

    });

  },
  {
    threshold: 0.12,
    rootMargin: "0px 0px -6% 0px"
  }
);

revealTargets.forEach((target) => {
  target.classList.add("reveal-ready");
  revealObserver.observe(target);
});
