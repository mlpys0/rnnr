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

/* =========================================
   SECRET ACCESS
========================================= */

const secretTrigger =
  document.querySelector(".ending-ornament");

const secretGate =
  document.getElementById("secret-gate");

const secretAccess =
  document.getElementById("secret-access");

const secretAge =
  document.getElementById("secret-age");

const secretForm =
  document.getElementById("secret-form");

const secretAnswer =
  document.getElementById("secret-answer");

const secretMessage =
  document.getElementById("secret-message");


let secretTapCount = 0;
let secretTapTimer = null;


/* ◇を5回タップ */

secretTrigger?.addEventListener("click", () => {

  secretTapCount++;

  clearTimeout(secretTapTimer);

  secretTapTimer = setTimeout(() => {
    secretTapCount = 0;
  }, 2500);


  if (secretTapCount >= 5) {

    secretTapCount = 0;

    secretGate.classList.add("is-open");

    secretGate.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.style.overflow = "hidden";


    /* 最初はACCESS GRANTEDだけ表示 */

    secretAccess.hidden = false;
    secretAge.hidden = true;


    /* 少し待って年齢確認へ */

    setTimeout(() => {

      secretAccess.hidden = true;
      secretAge.hidden = false;

      setTimeout(() => {
        secretAnswer?.focus();
      }, 100);

    }, 1400);

  }

});


/* 年齢確認 */

secretForm?.addEventListener(
  "submit",
  (event) => {

    event.preventDefault();


    const answer =
      secretAnswer.value
        .trim()
        .toLowerCase();


    /* YES */

    if (
  answer === "y" ||
  answer === "yes"
) {

  secretMessage.textContent =
    "ACCESS CONFIRMED";

  secretAnswer.disabled = true;


  sessionStorage.setItem(
    "rnnrAgeVerified",
    "yes"
  );


  setTimeout(() => {

    window.location.href =
      "./secret.html";

  }, 900);

  return;
}


    /* NO */

    if (
      answer === "n" ||
      answer === "no"
    ) {

      secretMessage.textContent =
        "ACCESS DENIED";


      setTimeout(() => {

        secretGate.classList.remove(
          "is-open"
        );

        secretGate.setAttribute(
          "aria-hidden",
          "true"
        );

        document.body.style.overflow = "";

        secretAnswer.value = "";
        secretMessage.textContent = "";

      }, 1200);

      return;
    }


    /* その他の入力 */

    secretMessage.textContent =
      "TYPE Y OR N";

  }
);

/* =========================================
   ENTRY WARNING
========================================= */

const entryWarning =
  document.getElementById(
    "entry-warning"
  );

const entryWarningButton =
  document.getElementById(
    "entry-warning-button"
  );


/*
  同じタブで一度ENTERしていれば、
  リロード時はもう一度出さない
*/

const entryAccepted =
  sessionStorage.getItem(
    "rnnrEntryAccepted"
  );


if (entryAccepted === "yes") {

  entryWarning?.remove();

} else {

  document.body.style.overflow =
    "hidden";

}


/* ENTER */

entryWarningButton?.addEventListener(
  "click",
  () => {

    sessionStorage.setItem(
      "rnnrEntryAccepted",
      "yes"
    );


    entryWarning.classList.add(
      "is-closing"
    );


    document.body.style.overflow =
      "";


    setTimeout(() => {

      entryWarning.remove();

    }, 1700);

  }
);
