const skip = document.getElementById('skip');
const save = document.getElementById('save');
const fileInput = document.getElementById("fileInput");
const profileImage = document.getElementById("profileImage");
const uploadForm = document.getElementById("uploadForm");

skip.addEventListener('click', ()=>{
    window.location.href = "/user/home";
})

save.disabled = true;
let selectedFile = null;

fileInput.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (file) {
        selectedFile = file;
        save.disabled = false;
        // Show preview
        const reader = new FileReader();
        reader.onload = (e) => { profileImage.src = e.target.result; };
        reader.readAsDataURL(file);
    } else{
        alert('Error uploading the profile!');
    }
});

save.addEventListener('click', async ()=>{
    if (!selectedFile) {
        alert("Please choose a profile picture first!");
        return;
    }

    const formData = new FormData();
    formData.append("profilePic", selectedFile);

    try {
        const res = await fetch("/user/uploadProfile", {
            method: "POST",
            body: formData
        });

        const data = await res.json();

        if (data.success) {
            // alert("Profile picture updated!");
            window.location.href = "/user/home"; // redirect if you want
        } else {
            alert(data.error);
            // alert("Upload failed. Try again.");
        }
    } catch (err) {
        console.error(err);
        alert("Something went wrong while saving.");
    }
})
