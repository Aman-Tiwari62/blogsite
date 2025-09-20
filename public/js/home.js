const homePage = document.getElementById("homepage");
const profilePage = document.getElementById("profilepage");
const createBlogPage = document.getElementById("createblogpage");
const container = document.querySelector('.container');
const postContainer = document.querySelector('.create-post-container');
const profileContainer = document.querySelector('.profile-container');
const myBlogs = document.querySelector('.profile-container>.user-blogs');
const blogCount = document.querySelector('.profile-container>.hero0>#blogs-list>.count');

const logoutBtn = document.getElementById('logout');



// function to load blogs
async function loadBlogs() {
    try {
      const res = await fetch("/blogs/loadBlogs"); // adjust if needed
      const blogs = await res.json();

      container.innerHTML = blogs.map(blog => `
        <div class="blog-container">
          <div class="user">
                <img class="user-img" src="${blog.author.profilePic || '../images/empty-profile.jpg'}" alt="Profile">
                <span class="user-name">${blog.author.firstname+" "+blog.author.lastname}</span>
          </div>
          <div class="blog">
                <p>${blog.content}</p>
                
                ${blog.photo ? `<div class="box1"><img class="blog-img" src="${blog.photo || '../images/icon.png'}" alt="image"></div>` : ""}
            </div>
            <div class="blog-footer">
                <p class="posted-on">Posted on ${new Date(blog.createdAt).toLocaleDateString()}</p>
            </div>
          
        </div>
      `).join("");
    } catch (err) {
      console.error("Error loading blogs:", err);
      container.innerHTML= "No Blogs !!"
    }
}

async function loadMyBlogs() {
  try {
    const res = await fetch("/blogs/loadMyBlogs");
    const blogs = await res.json();


    if (blogs.length === 0) {
      myBlogs.innerHTML = "<p>No posts yet!</p>";
      return;
    }
    blogCount.textContent = blogs.length;
    myBlogs.innerHTML = blogs.map(blog => `
      <div class="blog-container">
        <div class="user">
                <img class="user-img" src="${blog.author.profilePic || '../images/empty-profile.jpg'}" alt="Profile">
                <span class="user-name">${blog.author.firstname+" "+blog.author.lastname}</span>
        </div>
        <div class="blog">
          <p>${blog.content}</p>
          ${blog.photo ? `<div class="box1"><img class="blog-img" src="${blog.photo}" alt="image"></div>` : ""}
        </div>
        <div class="blog-footer">
          <p class="posted-on">Posted on ${new Date(blog.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    `).join("");
  } catch (err) {
    console.error("Error loading user blogs:", err);
  }
}


loadBlogs();
loadMyBlogs();
createBlogPage.addEventListener('click', ()=>{
    postContainer.style.display = "flex";
    container.style.display = "none";
    profileContainer.style.display = "none";
})
homePage.addEventListener('click', ()=>{
    container.style.display = "flex";
    postContainer.style.display = "none";
    profileContainer.style.display = "none";
})
profilePage.addEventListener('click', ()=>{
    container.style.display = "none";
    postContainer.style.display = "none";
    profileContainer.style.display = "flex";
})



logoutBtn.addEventListener('click', async ()=>{
  await fetch("/logout", {
    method: "POST",
    credentials: "include" // 🔑 include cookies in the request
  });

  // Redirect to login page
  window.location.href = "/";
})

const aside = document.querySelector('aside');
aside.addEventListener('click', ()=>{
  console.log('aside clicked');
})