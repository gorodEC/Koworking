(()=>{
const { getSpaceById } = window.FORMA_DATA;

// Весь сайт читает и изменяет заказы только через этот модуль.
const STORAGE_KEY = "forma-orders";

function fail(error) {
  return { ok: false, error };
}

function readRawOrders() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return { ok: true, orders: [] };
    const orders = JSON.parse(raw);
    if (!Array.isArray(orders)) return fail("Данные заказов повреждены: ожидался массив.");
    return { ok: true, orders };
  } catch {
    return fail("Не удалось прочитать localStorage. Проверьте доступность хранилища и формат данных.");
  }
}

function writeOrders(orders) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    return { ok: true };
  } catch (error) {
    return fail(error?.name === "QuotaExceededError"
      ? "В localStorage закончилось место."
      : "Не удалось сохранить заказы в localStorage.");
  }
}

function makeId() {
  return globalThis.crypto?.randomUUID?.()
    ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function readOrders() {
  return readRawOrders();
}

// orderData: { objectId, parameters: { date, time, duration, name, email }, amount }
function addOrder(orderData) {
  if (!orderData || typeof orderData !== "object") return fail("Не переданы данные заказа.");
  const { objectId, parameters, amount } = orderData;

  if (typeof objectId !== "string" || !getSpaceById(objectId)) {
    return fail("Объект не найден. Вернитесь в каталог и выберите доступное пространство.");
  }
  if (!parameters || typeof parameters !== "object" || Array.isArray(parameters)) {
    return fail("Параметры заказа должны быть объектом.");
  }
  if (!Number.isFinite(amount) || amount < 0) return fail("Сумма должна быть неотрицательным числом.");
  if (typeof parameters.date !== "string" || !parameters.date ||
      typeof parameters.time !== "string" || !parameters.time ||
      !Number.isFinite(Number(parameters.duration)) || Number(parameters.duration) <= 0 ||
      typeof parameters.name !== "string" || parameters.name.trim().length < 2 ||
      typeof parameters.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parameters.email)) {
    return fail("Проверьте дату, время, длительность, имя и электронную почту.");
  }

  const current = readRawOrders();
  if (!current.ok) return current;

  const order = {
    id: makeId(),
    objectId,
    parameters: {
      date: parameters.date,
      time: parameters.time,
      duration: Number(parameters.duration),
      name: parameters.name.trim(),
      email: parameters.email.trim()
    },
    amount,
    createdAt: new Date().toISOString()
  };

  const orders = [order, ...current.orders];
  const saved = writeOrders(orders);
  if (!saved.ok) return saved;
  return { ok: true, order, orders };
}

function cancelOrder(id) {
  if (typeof id !== "string" || !id.trim()) return fail("Не указан ID заказа.");
  const current = readRawOrders();
  if (!current.ok) return current;

  if (!current.orders.some((order) => order.id === id)) {
    return fail("Заказ не найден. Возможно, он уже отменён.");
  }

  const orders = current.orders.filter((order) => order.id !== id);
  const saved = writeOrders(orders);
  if (!saved.ok) return saved;
  return { ok: true, orders };
}

function getOrderById(id) {
  const result = readRawOrders();
  if (!result.ok) return result;
  const order = result.orders.find((item) => item.id === id);
  return order ? { ok: true, order } : fail("Заказ не найден.");
}

window.FORMA_STORAGE = { STORAGE_KEY, readOrders, addOrder, cancelOrder, getOrderById };
})();
