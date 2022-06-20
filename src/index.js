import FetchWrapper from "./fetch-wrapper.js";
import { displayEntry } from "./helpers.js";
import snackbar from "snackbar";
import AppData from "./app-data.js";
import "snackbar/dist/snackbar.min.css";
import Chart from "chart.js/auto";

const API = new FetchWrapper(
  "https://firestore.googleapis.com/v1/projects/jsdemo-3f387/databases/(default)/documents/abcdefghik12345678"
);

const appData = new AppData();

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDPKx71NN-1oGTYtFN_GCdgcDqoKCSnO1M",
  authDomain: "learn-js-jad-final-project.firebaseapp.com",
  projectId: "learn-js-jad-final-project",
  storageBucket: "learn-js-jad-final-project.appspot.com",
  messagingSenderId: "1037185231663",
  appId: "1:1037185231663:web:cdeef7a22bb37babbf0fda",
  measurementId: "G-204EGZRTZL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const list = document.querySelector("#food-list");
const form = document.querySelector("#create-form");
const name = document.querySelector("#create-name");
const carbs = document.querySelector("#create-carbs");
const protein = document.querySelector("#create-protein");
const fat = document.querySelector("#create-fat");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  API.post("/", {
    fields: {
      name: { stringValue: name.value },
      carbs: { integerValue: carbs.value },
      protein: { integerValue: protein.value },
      fat: { integerValue: fat.value },
    },
  }).then((data) => {
    console.log(data);
    if (data.error) {
      snackbar.show("Some data is missing.");
      return;
    }

    snackbar.show("Food added successfully.");

    displayEntry(list, name.value, carbs.value, protein.value, fat.value);
    render();

    name.value = "";
    carbs.value = "";
    protein.value = "";
    fat.value = "";
  });
});

const init = () => {
  API.get("/?pageSize=15").then((data) => {
    data.documents?.forEach((doc) => {
      const fields = doc.fields;

      displayEntry(list,
        fields.name.stringValue,
        fields.carbs.integerValue,
        fields.protein.integerValue,
        fields.fat.integerValue
      );
    });
    render();
  });
};

let chartInstance = null;
const renderChart = () => {
  chartInstance?.destroy();
  const context = document.querySelector("#app-chart").getContext("2d");

  chartInstance = new Chart(context, {
    type: "bar",
    data: {
      labels: ["Carbs", "Protein", "Fat"],
      datasets: [
        {
          label: "Macronutrients",
          data: [
            appData.getTotalCarbs(),
            appData.getTotalProtein(),
            appData.getTotalFat(),
          ],
          backgroundColor: ["#25AEEE", "#FECD52", "#57D269"],
          borderWidth: 5,
        },
      ],
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },
  });
};

const totalCalories = document.querySelector("#total-calories");

const updateTotalCalories = () => {
  totalCalories.textContent = appData.getTotalCalories();
};

const render = () => {
  renderChart();
  updateTotalCalories();
};

init();
