(()=>{
const { spaces, getSpaceById, formatPrice } = window.FORMA_DATA;
const { addOrder } = window.FORMA_STORAGE;

const form = document.querySelector("#booking-form");
const objectSelect = document.querySelector("#object-id");
const dateInput = document.querySelector("#booking-date");
const timeInput = document.querySelector("#booking-time");
const durationInput = document.querySelector("#duration");
const nameInput = document.querySelector("#customer-name");
const emailInput = document.querySelector("#customer-email");
const message = document.querySelector("#booking-message");
const objectError = document.querySelector("#object-error");
const params = new URLSearchParams(location.search);

function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
}
dateInput.min = localDate();

spaces.forEach((space) => {
  const option = document.createElement("option");
  option.value = space.id;
  option.textContent = `${space.name} — ${formatPrice(space.price)}/час`;
  objectSelect.append(option);
});

const requestedId = params.get("objectId");
if (requestedId && getSpaceById(requestedId)) {
  objectSelect.value = requestedId;
} else if (requestedId) {
  objectError.textContent = "Передан неизвестный ID. Выберите объект из списка или вернитесь в каталог.";
}

function updateSummary() {
  const space = getSpaceById(objectSelect.value);
  const duration = Number(durationInput.value);
  document.querySelector("#summary-name").textContent = space?.name ?? "Выберите пространство";
  document.querySelector("#summary-description").textContent = space?.description ?? "Детали бронирования появятся здесь.";
  document.querySelector("#summary-capacity").textContent = space ? `${space.capacity} чел.` : "—";
  document.querySelector("#summary-rate").textContent = space ? `${formatPrice(space.price)} / час` : "—";
  document.querySelector("#summary-duration").textContent = `${duration} ${duration === 1 ? "час" : duration < 5 ? "часа" : "часов"}`;
  document.querySelector("#summary-total").textContent = space ? formatPrice(space.price * duration) : "—";
}
objectSelect.addEventListener("change", () => { objectError.textContent = ""; updateSummary(); });
durationInput.addEventListener("change", updateSummary);
updateSummary();

form.addEventListener("submit", (event) => {
  event.preventDefault();
  message.textContent = "";
  message.className = "form-message";
  if (!form.reportValidity()) return;

  const space = getSpaceById(objectSelect.value);
  if (!space) {
    message.textContent = "Выберите существующее пространство.";
    message.classList.add("error");
    return;
  }
  if (dateInput.value < localDate()) {
    message.textContent = "Дата не может быть в прошлом.";
    message.classList.add("error");
    return;
  }
  const [hour, minute] = timeInput.value.split(":").map(Number);
  const start = hour * 60 + minute;
  const duration = Number(durationInput.value);
  if (start + duration * 60 > 19 * 60) {
    message.textContent = "Коворкинг работает до 19:00. Измените время или длительность.";
    message.classList.add("error");
    return;
  }

  const result = addOrder({
    objectId: space.id,
    parameters: { date: dateInput.value, time: timeInput.value, duration, name: nameInput.value, email: emailInput.value },
    amount: space.price * duration
  });

  if (!result.ok) {
    message.textContent = result.error;
    message.classList.add("error");
    return;
  }
  message.textContent = "Бронь сохранена. Открываем ваши записи…";
  message.classList.add("success");
  location.href = "orders.html";
});
})();
