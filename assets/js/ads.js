/* ==========================================================================
   ads.js – Ad creation, editing, and management
   ========================================================================== */
(function () {
  "use strict";

  const currentUser = Session.getCurrentUser();
  if (!currentUser) {
    alert("You must be logged in to post an ad.");
    window.location.href = "login.html";
    return;
  }

  // Elements
  const adForm = document.getElementById("adForm");
  const adTitle = document.getElementById("adTitle");
  const adDescription = document.getElementById("adDescription");
  const adCategory = document.getElementById("adCategory");
  const adSubcategory = document.getElementById("adSubcategory");
  const adImages = document.getElementById("adImages");
  const imagePreview = document.getElementById("imagePreview");
  const logoutBtn = document.getElementById("logoutBtn");
  const adminLink = document.getElementById("adminLink");

  let selectedImages = [];
  let editingAdId = null;

  if (currentUser.role === "admin") {
    adminLink.style.display = "inline-block";
  }

  // Handle image uploads (max 3)
  adImages.addEventListener("change", function () {
    const files = Array.from(adImages.files);

    if (selectedImages.length + files.length > 3) {
      alert("You can only upload up to 3 images.");
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = e => {
        selectedImages.push(e.target.result);
        renderPreview();
      };
      reader.readAsDataURL(file);
    });

    adImages.value = ""; // reset input
  });

  function renderPreview() {
    imagePreview.innerHTML = "";
    selectedImages.forEach((src, index) => {
      const imgBox = document.createElement("div");
      imgBox.className = "img-box";
      imgBox.innerHTML = `
        <img src="${src}" alt="Ad Image ${index + 1}">
        <button type="button" class="remove-img" data-index="${index}">X</button>
      `;
      imagePreview.appendChild(imgBox);
    });

    document.querySelectorAll(".remove-img").forEach(btn => {
      btn.addEventListener("click", () => {
        selectedImages.splice(btn.dataset.index, 1);
        renderPreview();
      });
    });
  }

  // Load ad if editing
  function loadEditingAd() {
    const params = new URLSearchParams(window.location.search);
    if (params.has("edit")) {
      editingAdId = params.get("edit");
      const ads = Storage.get("nb_ads_v1") || [];
      const ad = ads.find(a => a.id === editingAdId && a.owner === currentUser.username);

      if (!ad) return;

      adTitle.value = ad.title;
      adDescription.value = ad.description;
      adCategory.value = ad.category;
      adSubcategory.value = ad.subcategory || "";
      selectedImages = ad.images || [];
      renderPreview();
    }
  }

  // Save ad
  adForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const ads = Storage.get("nb_ads_v1") || [];
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);

    if (editingAdId) {
      // Update existing ad
      const index = ads.findIndex(a => a.id === editingAdId && a.owner === currentUser.username);
      if (index !== -1) {
        ads[index] = {
          ...ads[index],
          title: adTitle.value.trim(),
          description: adDescription.value.trim(),
          category: adCategory.value,
          subcategory: adSubcategory.value.trim(),
          images: selectedImages,
        };
      }
    } else {
      // Create new ad
      const newAd = {
        id: Date.now().toString(),
        title: adTitle.value.trim(),
        description: adDescription.value.trim(),
        category: adCategory.value,
        subcategory: adSubcategory.value.trim(),
        images: selectedImages,
        owner: currentUser.username,
        phone: currentUser.phone,
        createdAt: new Date().toISOString(),
        expiry: expiryDate.toISOString().split("T")[0],
      };
      ads.push(newAd);
    }

    Storage.set("nb_ads_v1", ads);
    alert("Ad saved successfully!");
    window.location.href = "profile.html";
  });

  // Logout
  logoutBtn.addEventListener("click", function () {
    if (confirm("Are you sure you want to logout?")) {
      Session.clear();
      window.location.href = "login.html";
    }
  });

  // Init
  loadEditingAd();
})();
