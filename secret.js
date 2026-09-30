/* =========================================
   AGE CHECK
========================================= */

/*
  index.html側の年齢確認を
  通っていない場合は表ページへ戻す
*/

if (
  sessionStorage.getItem(
    "rnnrAgeVerified"
  ) !== "yes"
) {

  window.location.replace(
    "./index.html"
  );

}



/* =========================================
   PRIVATE RECORD POPUP
========================================= */

const recordModal =
  document.getElementById(
    "record-modal"
  );

const recordDialog =
  recordModal?.querySelector(
    ".record-dialog"
  );

const recordClose =
  document.getElementById(
    "record-close"
  );

const recordMeta =
  document.getElementById(
    "record-meta"
  );

const recordTitle =
  document.getElementById(
    "record-title"
  );

const recordBody =
  document.getElementById(
    "record-body"
  );

const recordButtons =
  document.querySelectorAll(
    ".secret-record-button"
  );


let lastRecordButton = null;



/* OPEN */

function openRecord(button) {

  const recordName =
    button.dataset.record;

  const template =
    document.getElementById(
      `record-${recordName}`
    );


  if (!template) return;


  lastRecordButton = button;


  recordMeta.textContent =
    button.dataset.meta || "";


  recordTitle.textContent =
    button.dataset.title || "";


  recordBody.innerHTML = "";

  recordBody.appendChild(
    template.content.cloneNode(true)
  );


  recordModal.classList.add(
    "is-open"
  );


  recordModal.setAttribute(
    "aria-hidden",
    "false"
  );


  document.body.style.overflow =
    "hidden";


  setTimeout(() => {

    recordClose?.focus();

  }, 50);

}



/* CLOSE */

function closeRecord() {

  recordModal.classList.remove(
    "is-open"
  );


  recordModal.setAttribute(
    "aria-hidden",
    "true"
  );


  document.body.style.overflow =
    "";


  recordBody.innerHTML = "";


  lastRecordButton?.focus();

}



/* BUTTONS */

recordButtons.forEach(
  (button) => {

    button.addEventListener(
      "click",
      () => {

        openRecord(button);

      }
    );

  }
);



/* CLOSE BUTTON */

recordClose?.addEventListener(
  "click",
  closeRecord
);



/* BACKDROP CLICK */

recordModal?.addEventListener(
  "click",
  (event) => {

    if (
      event.target === recordModal
    ) {

      closeRecord();

    }

  }
);



/* ESC */

document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Escape" &&
      recordModal?.classList.contains(
        "is-open"
      )
    ) {

      closeRecord();

    }

  }
);
