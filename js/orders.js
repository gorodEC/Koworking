(()=>{
const { getSpaceById, formatPrice, formatDate } = window.FORMA_DATA;
const { readOrders, cancelOrder } = window.FORMA_STORAGE;

const container = document.querySelector("#orders-list");
const count = document.querySelector("#orders-count");

function render() {
  const result = readOrders();
  container.replaceChildren();
  if (!result.ok) {
    const error = document.createElement("p");
    error.className = "no-results";
    error.textContent = result.error;
    container.append(error);
    count.textContent = "Ошибка";
    return;
  }
  const orders = result.orders;
  count.textContent = `${orders.length} ${orders.length === 1 ? "запись" : orders.length >= 2 && orders.length <= 4 ? "записи" : "записей"}`;
  if (!orders.length) {
    const empty = document.createElement("div");
    empty.className = "orders-empty";
    empty.innerHTML = `<h3>Пока нет записей.</h3><p>Выберите стол или комнату в каталоге, чтобы оформить визит.</p><a class="button button-dark" href="catalog.html">Открыть каталог ↗</a>`;
    container.append(empty);
    return;
  }
  orders.forEach((order, index) => {
    const space = getSpaceById(order.objectId);
    const card = document.createElement("article");
    card.className = "order-card";
    const indexEl = document.createElement("div");
    indexEl.className = "order-index";
    indexEl.textContent = String(index + 1).padStart(2, "0");
    const info = document.createElement("div");
    info.className = "order-info";
    const title = document.createElement("h3");
    title.textContent = space?.name ?? "Неизвестное пространство";
    const details = document.createElement("p");
    details.textContent = `${formatDate(order.parameters.date)} · ${order.parameters.time} · ${order.parameters.duration} ч.`;
    const customer = document.createElement("p");
    customer.textContent = `${order.parameters.name} · ${order.parameters.email}`;
    info.append(title, details, customer);
    const actions = document.createElement("div");
    actions.className = "order-actions";
    const amount = document.createElement("strong");
    amount.className = "order-total";
    amount.textContent = formatPrice(order.amount);
    const cancel = document.createElement("button");
    cancel.type = "button";
    cancel.className = "order-delete";
    cancel.textContent = "Отменить запись";
    cancel.addEventListener("click", () => {
      if (!confirm("Отменить это бронирование?")) return;
      const cancelled = cancelOrder(order.id);
      if (!cancelled.ok) {
        alert(cancelled.error);
        return;
      }
      render();
    });
    actions.append(amount, cancel);
    card.append(indexEl, info, actions);
    container.append(card);
  });
}
render();
})();
