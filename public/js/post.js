const photoInput = document.getElementById("photo");
const previewImg = document.getElementById("preview");
const previewImgBox = document.getElementById("preview-box");
const form = document.getElementById("blogForm");
const btn = document.getElementById("submitBtn");
const text = document.getElementById("btnText");
const spinner = document.getElementById("spinner");

form.addEventListener("submit", () => {
  console.log('clicked')
  btn.disabled = true;
  console.log('clicked')
  text.style.display = "none";
  spinner.style.display = "inline-block"; // show spinner
});

photoInput.addEventListener("change", () => {
  const file = photoInput.files[0];
  if (file) {
    previewImg.src = URL.createObjectURL(file); // create preview URL
    previewImgBox.style.display = "flex";        // show the image
  } else {
    previewImg.src = "";
    previewImg.style.display = "none";         // hide if no file
  }
});