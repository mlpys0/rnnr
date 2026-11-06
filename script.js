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


/* =========================================
   OUR STORIES / TWO TIMELINES
   Independent of the image lightbox and secret gate.
========================================= */
(() => {
  const root = document.querySelector('.story-shell');
  if (!root) return;

  const tabs = Array.from(root.querySelectorAll('[data-story-tab]'));
  const worlds = Array.from(root.querySelectorAll('[data-story-world]'));
  const modal = document.getElementById('story-record-modal');
  const modalClose = document.getElementById('story-record-close');
  const modalMeta = document.getElementById('story-record-meta');
  const modalTitle = document.getElementById('story-record-title');
  const modalContent = document.getElementById('story-record-content');
  const veil = document.getElementById('story-time-veil');
  const veilText = document.getElementById('story-time-label');
  let lastButton = null;
  let previousOverflow = '';
  let futureBusy = false;

  function closeFuture(world) {
    const panel = document.getElementById(`story-future-${world}`);
    const trigger = root.querySelector(`[data-story-future="${world}"]`);
    if (!panel || !trigger) return;
    panel.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-label', `${world === 'original' ? '本編' : 'フリーターIF'}の未来の記録を開く`);
  }

  function switchWorld(name, focusTab = false) {
    if (futureBusy) return;
    for (const panel of worlds) {
      const active = panel.dataset.storyWorld === name;
      panel.hidden = !active;
      if (!active) closeFuture(panel.dataset.storyWorld);
    }
    for (const tab of tabs) {
      const active = tab.dataset.storyTab === name;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active && focusTab) tab.focus();
    }
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => switchWorld(tab.dataset.storyTab));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 :
        (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      switchWorld(tabs[next].dataset.storyTab, true);
    });
  });

  root.querySelectorAll('[data-story-record]').forEach(button => {
    button.addEventListener('click', () => {
      const id = button.dataset.storyRecord;
      const template = document.getElementById(`story-text-${id}`);
      if (!modal || !template) return;
      const currentWorld = button.closest('[data-story-world]');
      const worldName = currentWorld?.dataset.storyWorld === 'freeter' ? 'FREETER IF' : 'ORIGINAL';
      const title = button.querySelector('span')?.textContent?.trim() || 'RECORD';
      modalMeta.textContent = `${worldName} / ${button.classList.contains('story-future-record-button') ? 'FUTURE RECORD' : 'PRESENT RECORD'}`;
      modalTitle.textContent = title;
      modalContent.replaceChildren(template.content.cloneNode(true));
      lastButton = button;
      previousOverflow = document.body.style.overflow;
      if (typeof modal.showModal === 'function') modal.showModal();
      else modal.setAttribute('open', '');
      document.body.style.overflow = 'hidden';
      modalClose?.focus();
    });
  });

  const closeModal = () => {
    if (!modal?.open) return;
    if (typeof modal.close === 'function') modal.close();
    else modal.removeAttribute('open');
  };
  modalClose?.addEventListener('click', closeModal);
  modal?.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });
  modal?.addEventListener('close', () => {
    document.body.style.overflow = previousOverflow;
    lastButton?.focus();
  });

  root.querySelectorAll('[data-story-future]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      if (futureBusy) return;
      const world = trigger.dataset.storyFuture;
      const panel = document.getElementById(`story-future-${world}`);
      if (!panel) return;
      if (!panel.hidden) {
        closeFuture(world);
        trigger.focus();
        return;
      }
      futureBusy = true;
      const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      if (veil && !reducedMotion) {
        veilText.textContent = 'PRESENT RECORD CLOSED';
        veil.classList.add('is-active');
      }
      const reveal = () => {
        panel.hidden = false;
        trigger.setAttribute('aria-expanded', 'true');
        trigger.setAttribute('aria-label', '未来の記録を閉じる');
        if (veil && !reducedMotion) veilText.textContent = 'FUTURE RECORD UNLOCKED';
        setTimeout(() => {
          veil?.classList.remove('is-active');
          panel.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
          futureBusy = false;
        }, reducedMotion ? 0 : 420);
      };
      setTimeout(reveal, reducedMotion ? 0 : 670);
    });
  });
  root.querySelectorAll('[data-story-return]').forEach(button => {
    button.addEventListener('click', () => {
      const world = button.dataset.storyReturn;
      closeFuture(world);
      root.querySelector(`[data-story-future="${world}"]`)?.focus();
    });
  });
})();
