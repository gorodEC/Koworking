(()=>{
// Единственный источник объектов для всех страниц.
const spaces = [
  {id:"desk-01",number:"01",name:"The Atelier",type:"desk",typeLabel:"Рабочий стол",description:"Светлое место у окна для индивидуальной работы.",capacity:1,price:350,color:"#ddd7c9",featured:true},
  {id:"desk-02",number:"02",name:"Quiet Corner",type:"desk",typeLabel:"Рабочий стол",description:"Тихая зона для сосредоточенной работы.",capacity:1,price:300,color:"#d5d9ca",featured:true},
  {id:"desk-03",number:"03",name:"The Library",type:"desk",typeLabel:"Рабочий стол",description:"Рабочий стол в окружении книг и натуральных материалов.",capacity:1,price:400,color:"#ded1c2",featured:false},
  {id:"meeting-01",number:"04",name:"Round Table",type:"meeting",typeLabel:"Переговорная",description:"Камерная переговорная для встреч и презентаций.",capacity:4,price:1200,color:"#d9d5c8",featured:true},
  {id:"meeting-02",number:"05",name:"The Cabinet",type:"meeting",typeLabel:"Переговорная",description:"Приватная комната для командной работы.",capacity:6,price:1800,color:"#d0d3c5",featured:false},
  {id:"meeting-03",number:"06",name:"The Forum",type:"meeting",typeLabel:"Переговорная",description:"Пространство для командных сессий.",capacity:10,price:2500,color:"#dfd4c6",featured:false},
  {id:"office-01",number:"07",name:"Private Studio",type:"office",typeLabel:"Кабинет",description:"Отдельный кабинет для работы и консультаций.",capacity:2,price:1500,color:"#d5cec0",featured:false},
  {id:"office-02",number:"08",name:"The Residence",type:"office",typeLabel:"Кабинет",description:"Приватный кабинет для небольшой команды.",capacity:4,price:2200,color:"#d4d8cd",featured:false}
];

function getSpaceById(id) {
  return spaces.find((space) => space.id === id) ?? null;
}

function formatPrice(value) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency", currency: "RUB", maximumFractionDigits: 0
  }).format(value);
}

function formatDate(value) {
  if (!value) return "Дата не указана";
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric", month: "long", year: "numeric"
  }).format(new Date(year, month - 1, day));
}

window.FORMA_DATA = { spaces, getSpaceById, formatPrice, formatDate };
})();
