/* ============================================================================
   ads.js – Ad posting, editing, deleting
   ============================================================================ */
(function () {
  "use strict";

  // ------------------ POST AD ------------------
  function postAd(data) {
    const user = SessionAPI.currentUser();
    if (!user) {
      alert("You must be logged in to post an ad.");
      return;
    }

    const ads = StorageAPI.ads();

    const ad = {
      id: NB.uid("ad"),
      userId: user.id,
      username: user.username,
      title: data.title,
      description: data.description,
      category: data.category,
      subcategory: data.subcategory,
      images: data.images,
      createdAt: Date.now(),
      expiry: Date.now() + data.expiryDays * 24 * 60 * 60 * 1000,
    };

    ads.push(ad);
    StorageAPI.saveAds(ads);
    alert("Ad posted successfully!");
    window.location.href = "index.html";
  }

  // ------------------ INIT FORM ------------------
  function initForm() {
    const form = document.getElementById("adForm");
    if (!form) return;

    AuthAPI.requireAuth(); // ensure logged in

    const imageInput = document.getElementById("imageInput");
    const preview = document.getElementById("imagePreview");
    let images = [];

    // Image preview + limit to 3
    imageInput.addEventListener("change", () => {
      const files = Array.from(imageInput.files).slice(0, 3);
      images = [];

      preview.innerHTML = "";
      files.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          images.push(e.target.result);
          const imgEl = document.createElement("div");
          imgEl.className = "preview-item";
          imgEl.innerHTML = `
            <img src="${e.target.result}" alt="Ad image ${index+1}" />
            <button type="button" data-index="${index}">Delete</button>
          `;
          preview.appendChild(imgEl);
        };
        reader.readAsDataURL(file);
      });
    });

    // Delete preview image
    preview.addEventListener("click", (e) => {
      if (e.target.tagName === "BUTTON") {
        const index = parseInt(e.target.dataset.index, 10);
        images.splice(index, 1);
        e.target.parentElement.remove();
      }
    });

    // Handle form submit
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = document.getElementById("title").value.trim();
      const description = document.getElementById("description").value.trim();
      const category = document.getElementById("category").value;
      const subcategory = document.getElementById("subcategory").value;
      const expiryDays = parseInt(document.getElementById("expiry").value, 10);

      if (!title || !description || !category || !subcategory) {
        alert("Please fill all fields.");
        return;
      }

      postAd({ title, description, category, subcategory, images, expiryDays });
    });
  }

  // ------------------ EXPORT ------------------
  window.AdsAPI = { postAd };

  // ------------------ INIT ------------------
  document.addEventListener("DOMContentLoaded", () => {
    initForm();
  });
})();
