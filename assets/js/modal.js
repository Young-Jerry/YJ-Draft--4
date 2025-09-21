/* ==========================================================================
   modal.js – Global modal manager (alert + confirm)
   ========================================================================== */
(function () {
  "use strict";

  const modalContainer = document.createElement("div");
  modalContainer.id = "modalContainer";
  document.body.appendChild(modalContainer);

  function createModal({ message, showCancel, onOk, onCancel }) {
    modalContainer.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-box">
        <p>${message}</p>
        <div class="modal-actions">
          <button class="btn-ok">OK</button>
          ${showCancel ? `<button class="btn-cancel">Cancel</button>` : ""}
        </div>
      </div>
    `;

    modalContainer.style.display = "flex";

    const okBtn = modalContainer.querySelector(".btn-ok");
    const cancelBtn = modalContainer.querySelector(".btn-cancel");

    okBtn.addEventListener("click", () => {
      closeModal();
      if (onOk) onOk();
    });

    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => {
        closeModal();
        if (onCancel) onCancel();
      });
    }
  }

  function closeModal() {
    modalContainer.style.display = "none";
    modalContainer.innerHTML = "";
  }

  // Expose globally
  window.Modal = {
    alert(message, onOk) {
      createModal({ message, showCancel: false, onOk });
    },
    confirm(message, onOk, onCancel) {
      createModal({ message, showCancel: true, onOk, onCancel });
    },
  };
})();
