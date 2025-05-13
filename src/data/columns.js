export const columns = {
  devices: [
    { title: "ID", field: "id" },
    { title: "Имя", field: "name" },
    { title: "Тип", field: "type" },
    { title: "Статус", field: "status" },
    { title: "Грядка", field: "bedId" },
  ],
  beds: [
    { title: "ID", field: "id" },
    { title: "Название", field: "name" },
    { title: "Культура", field: "cropId" },
    { title: "Устройства", field: "deviceIds" },
  ],
  crops: [
    { title: "ID", field: "id" },
    { title: "Название", field: "name" },
    { title: "t° мин", field: "tempMin" },
    { title: "t° макс", field: "tempMax" },
    { title: "Вода, л/день", field: "waterRequirementLiters" },
  ],
  irrigation: [
    { title: "ID", field: "id" },
    { title: "Грядка", field: "bedId" },
    { title: "Дни", field: "daysOfWeek" },
    { title: "Объём, л", field: "requiredVolumeLiters" },
    { title: "Время", field: "startTime.hour" },
  ],
  settings: [
    { title: "ID", field: "id" },
    { title: "t° мин", field: "tempMin" },
    { title: "t° макс", field: "tempMax" },
    { title: "Влажн. мин", field: "humidityMin" },
    { title: "Влажн. макс", field: "humidityMax" },
  ],
};