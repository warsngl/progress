<template>
  <div class="progress-container">
    <input id="dashboard" type="checkbox" v-model="dashboard">
    <label for="dashboard">dashboard</label>
    <div>
      <button @click="startProgress">start</button>
      <button @click="setStatus('success')">success</button>
      <button @click="setStatus('warning')">warning</button>
      <button @click="setStatus('error')">error</button>
      <div style="margin-top: 30px;">
        <CircularProgress :progress :status :dashboard />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import CircularProgress from "../components/CircularProgress.vue";

const progress = ref(30);
const status = ref(null)
const interval = ref(null)
const dashboard = ref(false)

const setStatus = (val) => {
  clearInterval(interval.value)
  status.value = val
}
const startProgress = () => {
  clearInterval(interval.value)
  status.value = "in progress"
  progress.value = 0
  interval.value = setInterval(() => {
    if (progress.value === 100) {
      status.value = "success"
      clearInterval(interval.value)
    } else {
      progress.value++
    }
  }, 100)
}
onMounted(() => {
  startProgress()
})
onUnmounted(() => {
  clearInterval(interval.value)
})
</script>

<style scoped>
button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  margin: 0.2em;
  box-shadow: #c9c7c7 5px 5px 5px;
  font-size: 1em;
  font-weight: 500;
  background-color: #f9f9f9;
  cursor: pointer;
}

button:hover {
  border-color: #646cff;
}


.progress-container {
  display: flex;
  flex-direction: column;
  place-items: center;
}
</style>