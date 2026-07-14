console.log("Navbar loaded");
async function loadComments() {
  const feed = document.getElementById("comment-scroll");
  if (feed) {
    feed.innerHTML = "<p>Comments feature coming soon</p>";
  }
}

loadComments();
document.addEventListener("DOMContentLoaded", () => {
  // 1. Create the container element
  const navContainer = document.createElement("nav");
  navContainer.className = "navbar";

  // 2. Define your site structure and page links
  const menuItems = [
    { text: "Front of Haus", link: "index.html" },
    { text: "Studio Curio", link: "gallery.html" },
    { text: "Thotty Thoughts b/vlog", link: "blog.html" },
    { text: "Spoil Me", link: "wishes.html" },
    { text: "Treat Yourself", link: "shop.html" },
    { text: "Find Us", link: "contact.html" },
    { text: "Privacy Policy", link: "privacy.html" },
  ];

  // 3. Build out the links inside the container
  let menuHTML = `<div class="logo"><img src="images/foxxxlogo2-50x50.png"/></div>`;
  menuHTML += `<ul class="nav-links">`;

  // Detect the current file name to highlight it later
  const currentPath = window.location.pathname.split("/").pop() || "index.html";

  menuItems.forEach((item) => {
    const isActive = currentPath === item.link ? "active" : "";
    menuHTML += `<li><a href="${item.link}" class="${isActive}">${item.text}</a></li>`;
  });

  menuHTML += `</ul>`;
  navContainer.innerHTML = menuHTML;

  // 4. Inject the menu right below the page's h1 header, falling back to
  // the top of the body on pages without a .header block.
  const header = document.querySelector(".header");
  if (header) {
    header.after(navContainer);
  } else {
    document.body.prepend(navContainer);
  }
});
