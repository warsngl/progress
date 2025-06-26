<template>
  <h1>Круговая диаграмма</h1>
  <hr>
  <div class="table-container">
    <div class="table">
      <div class="row" v-for="(row, index) in chartData">
        <div class="col">
          {{ row.label }}
        </div>
        <div class="col value">
          {{ row.value }}
        </div>
        <div class="col">
          <div class="color-sample" :style="{ 'background-color': row.color }"></div>
        </div>
        <div class="col controls">
          <img src="/edit.png" alt="" @click="editItem(index)">
          <img src="/remove.png" alt="" @click="removeItem(index)">
        </div>
      </div>
    </div>
    <button @click="addItem()">Добавить сектор</button>
  </div>
  <!-- Модалка -->
  <div class="modal-container" v-if="isModalOpen" @click.self="closeModal()">
    <form class="modal" @submit.prevent="saveItem()">
      <p>{{ chosenIndex !== null ? "Изменение сектора" : "Добавление сектора" }}</p>
      <div class="form-field">
        <label for="label">Наименование</label>
        <input id="label" type="text" v-model="chosenLabel">
      </div>
      <div class="form-field">
        <label for="value">Значение</label>
        <input id="value" type="number" v-model="chosenValue">
      </div>
      <div class="form-field">
        <label for="color">Цвет</label>
        <input id="color" type="color" v-model="chosenColor">
      </div>
      <button>{{ chosenIndex !== null ? "Измененить сектор" : "Добавить сектор" }}</button>
    </form>
  </div>
  <!-- График -->
  <div class=" chart-container">
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { Chart, registerables } from 'chart.js';


const chosenLabel = ref(null)
const chosenValue = ref(null)
const chosenColor = ref(null)
const chosenIndex = ref(null)

const isModalOpen = ref(false)

Chart.register(...registerables);

const chartRef = ref(null);
let chartObject = ref(null);

const chartData = ref([
  { label: 'Сектор 1', value: 25, color: '#f0f0f0' },
  { label: 'Сектор 2', value: 21, color: '#a0f0f0' },
  { label: 'Сектор 3', value: 22, color: '#b0f0f0' },
  { label: 'Сектор 4', value: 2, color: '#c0f0f0' },
])

const hexToRgb = (hex) => {
  return hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
    , (m, r, g, b) => '#' + r + r + g + g + b + b)
    .substring(1).match(/.{2}/g)
    .map(x => parseInt(x, 16))
}

const initChart = () => {
  if (chartObject.value) {
    chartObject.value.destroy();
  }

  const ctx = chartRef.value.getContext('2d');
  chartObject.value = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: chartData.value.map(item => item.label),
      datasets: [{
        data: chartData.value.map(item => item.value),
        backgroundColor: chartData.value.map(item => "rgb(" + hexToRgb(item.color) + ")")
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'right'
        }
      }
    }
  });
};
const openModal = () => isModalOpen.value = true
const closeModal = () => {
  chosenIndex.value = null
  chosenLabel.value = null
  chosenValue.value = null
  chosenColor.value = null
  isModalOpen.value = false
}

const editItem = (index) => {
  // debugger
  chosenIndex.value = index
  openModal()
  let { label, value, color } = chartData.value[index]
  chosenLabel.value = label
  chosenValue.value = value
  chosenColor.value = color

}

const addItem = () => {
  openModal()
}

const removeItem = (index) => {
  chartData.value.splice(index, 1);
};
const saveItem = (index) => {
  if (chosenIndex.value === null) {
    chartData.value.push({ label: label.value, value: value.value, color: color.value })
  } else {
    index = chosenIndex.value
    chartData.value[index].label = label.value
    chartData.value[index].value = value.value
    chartData.value[index].color = color.value
  }
  closeModal()
}

watch(chartData, initChart, { deep: true });

onMounted(() => {
  initChart()
});
</script>

<style scoped>
h1 {
  font-size: 32px;
}

hr {
  color: #DBDFE9;
}

.table-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.table {
  color: #252F4A;
  display: grid;
  gap: 5px;
}

.row {
  background-color: #DBDFE933;
  display: grid;
  align-items: center;
  grid-template-columns: 25% 15% auto 15%;
  border-radius: 10px;
  padding: 20px 18px;
}

.col {
  padding: 0 25px;
}

.value {
  position: relative;
}

.value::after,
.value::before {
  content: "";
  position: absolute;
  top: 10%;
  height: 80%;
  width: 1px;
  background: #DBDFE9;
}

.value::after {
  right: 0;
}

.value::before {
  left: 0;
}

.color-sample {
  width: 20px;
  height: 20px;
  border-radius: 100%;
}

.controls {
  display: flex;
  gap: 20px;
}

.modal-container {
  position: fixed;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background-color: #00000050;
}

.modal {
  width: 400px;
  display: flex;
  gap: 20px;
  background: #fff;
  padding: 20px;
  border-radius: 15px;
  flex-direction: column;

  & p {
    font-size: 20px;
    font-weight: 500;
  }

  & .form-field {
    height: 40px;
    padding: 10px 20px;
    position: relative;
    border: 1px solid #DBDFE9;
    border-radius: 10px;


    & label {
      position: absolute;
      top: 0;
      font-size: 12px;
      color: #99A1B7;
    }

    & input {
      appearance: none;
      border: none;
      outline: none;
      margin-top: 16px;
      font-size: 16px;
    }


  }
}

button {
  background-color: #1B84FF;
  padding: 18px 36px;
  border: none;
  border-radius: 10px;
  color: white;
  cursor: pointer;
}
</style>