// bringing in my scss file so webpack can bundle all the styles together
import "./styles/index.scss";

// grabbing the dropdowns for year, make, and model
const yearSelect = document.getElementById("year");
const makeSelect = document.getElementById("make");
const modelSelect = document.getElementById("model");

// loading the car data from the json file inside my assets folder
async function getCarData() {
  const dataUrl = new URL("./assets/car-dataset.json", import.meta.url);
  const response = await fetch(dataUrl);
  const data = await response.json();
  return data;
}

// main function that sets everything up after the data loads
async function init() {
  const cars = await getCarData();

  // get all the different years and sort them from newest to oldest
  const years = [...new Set(cars.map((car) => car.year))].sort((a, b) => b - a);

  // add each year into the dropdown
  years.forEach((year) => {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
  });

  // when a year is picked, show only the makes for that year
  yearSelect.addEventListener("change", () => {
    const selectedYear = parseInt(yearSelect.value);

    const makes = [
      ...new Set(
        cars
          .filter((car) => car.year === selectedYear)
          .map((car) => car.Manufacturer)
      ),
    ];

    // reset and re-enable the next dropdowns
    makeSelect.innerHTML = '<option value="">Select make</option>';
    modelSelect.innerHTML = '<option value="">Select model</option>';
    modelSelect.disabled = true;

    // fill in the make options
    makes.forEach((make) => {
      const option = document.createElement("option");
      option.value = make;
      option.textContent = make;
      makeSelect.appendChild(option);
    });

    makeSelect.disabled = false;
  });

  // when a make is picked, show only the models for that make and year
  makeSelect.addEventListener("change", () => {
    const selectedYear = parseInt(yearSelect.value);
    const selectedMake = makeSelect.value;

    const models = cars
      .filter(
        (car) => car.year === selectedYear && car.Manufacturer === selectedMake
      )
      .map((car) => car.model);

    // reset the model dropdown
    modelSelect.innerHTML = '<option value="">Select model</option>';

    // add each model into the dropdown
    models.forEach((model) => {
      const option = document.createElement("option");
      option.value = model;
      option.textContent = model;
      modelSelect.appendChild(option);
    });

    modelSelect.disabled = false;
  });

  // when a model is chosen, log the full car details in the console
  modelSelect.addEventListener("change", () => {
    const selectedYear = parseInt(yearSelect.value);
    const selectedMake = makeSelect.value;
    const selectedModel = modelSelect.value;

    // find the exact car that matches all 3 selections
    const selectedCar = cars.find(
      (car) =>
        car.year === selectedYear &&
        car.Manufacturer === selectedMake &&
        car.model === selectedModel
    );

    // show the details in the console
    console.log("Selected Car Details:", selectedCar);
  });
}

// runs everything when the page loads
init();
