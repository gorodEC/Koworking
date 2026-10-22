(()=>{
const currentPage = location.pathname.split("/").pop().replace(".html", "") || "index";
document.querySelectorAll("[data-page]").forEach((link) => {
  if (link.dataset.page === currentPage) link.setAttribute("aria-current", "page");
});
document.querySelectorAll("[data-year]").forEach((el) => el.textContent = new Date().getFullYear());

const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");
function closeMenu() {
  if (!toggle || !nav) return;
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", "Открыть меню");
  nav.classList.remove("is-open");
}
if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    toggle.setAttribute("aria-label", open ? "Открыть меню" : "Закрыть меню");
    nav.classList.toggle("is-open", !open);
  });
  nav.addEventListener("click", (event) => { if (event.target.closest("a")) closeMenu(); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeMenu(); });
}
})();
