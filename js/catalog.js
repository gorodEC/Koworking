(()=>{
const { spaces, formatPrice } = window.FORMA_DATA;

const search = document.querySelector("#search");
const typeFilter = document.querySelector("#type-filter");
const capacityFilter = document.querySelector("#capacity-filter");
const sortFilter = document.querySelector("#sort-filter");
const plan = document.querySelector("#seat-plan");
const cards = document.querySelector("#catalog-spaces");
const count = document.querySelector("#catalog-count");

function matches(space) {
  const query = search.value.trim().toLowerCase();
  const type = typeFilter.value;
  const capacity = capacityFilter.value;
  return (!query || `${space.name} ${space.description} ${space.typeLabel}`.toLowerCase().includes(query))
    && (type === "all" || space.type === type)
    && (capacity === "all" || space.capacity >= Number(capacity));
}

function cardFor(space) {
  const article = document.createElement("article");
  article.className = "space-card";
  article.innerHTML = `<div class="space-card-media" style="background:${space.color}"><span>FORMA / ${space.number}</span><span>${space.typeLabel}</span></div>
    <div class="space-card-body"><div class="space-card-topline"><span>До ${space.capacity} чел.</span><span>${space.number} / 08</span></div>
    <h3></h3><p class="space-card-description"></p><div class="space-card-footer"><span class="space-price">${formatPrice(space.price)} <small>/ час</small></span><a class="space-card-link" href="booking.html?objectId=${encodeURIComponent(space.id)}">Выбрать ↗</a></div></div>`;
  article.querySelector("h3").textContent = space.name;
  article.querySelector(".space-card-description").textContent = space.description;
  return article;
}

function render() {
  let filtered = spaces.filter(matches);
  if (sortFilter.value === "price-asc") filtered.sort((a,b) => a.price-b.price);
  else if (sortFilter.value === "price-desc") filtered.sort((a,b) => b.price-a.price);
  else filtered.sort((a,b) => a.number.localeCompare(b.number));

  plan.replaceChildren();
  filtered.forEach((space) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `seat-tile ${space.type}`;
    button.setAttribute("aria-pressed", "false");
    button.innerHTML = `<span class="tile-number">МЕСТО ${space.number}</span><strong></strong><small>${formatPrice(space.price)} / час</small>`;
    button.querySelector("strong").textContent = space.name;
    button.setAttribute("aria-label", `${space.name}, ${space.typeLabel}, ${formatPrice(space.price)} в час. Перейти к бронированию`);
    button.addEventListener("click", () => {
      plan.querySelectorAll(".seat-tile").forEach((tile) => tile.setAttribute("aria-pressed", "false"));
      button.setAttribute("aria-pressed", "true");
      location.href = `booking.html?objectId=${encodeURIComponent(space.id)}`;
    });
    plan.append(button);
  });

  cards.replaceChildren();
  if (!filtered.length) {
    const empty = document.createElement("p");
    empty.className = "no-results";
    empty.textContent = "Ничего не найдено. Измените поиск или фильтры.";
    cards.append(empty);
  } else {
    filtered.forEach((space) => cards.append(cardFor(space)));
  }
  count.textContent = `Найдено: ${filtered.length} из ${spaces.length}`;
}

[search, typeFilter, capacityFilter, sortFilter].forEach((el) => {
  el.addEventListener(el === search ? "input" : "change", render);
});
render();
})();
