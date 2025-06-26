<template>
  <div class="progress-container">
    <svg :width="size" :height="size" viewBox="0 0 100 100">
      <g v-if="!props.dashboard">
        <!-- обводка -->
        <circle :cx="center" :cy="center" :r="radius" fill="none" stroke="#f5f5f5" :stroke-width="strokeWidth" />
        <!-- прогресс -->
        <circle :cx="center" :cy="center" :r="radius" fill="none" :stroke="progressColor" :stroke-width="strokeWidth"
          stroke-linecap="round" :stroke-dasharray="circumference" :stroke-dashoffset="offset"
          transform="rotate(-90 50 50)" />
      </g>
      <g v-else>
        <!-- dashboard обводка-->
        <path :d="backgroundPath" fill="none" stroke="#eee" :stroke-width="strokeWidth" />

        <!-- dashboard прогресс -->
        <path :d="backgroundPath" fill="none" :stroke="progressColor" :stroke-width="strokeWidth" stroke-linecap="round"
          :stroke-dasharray="dashArray" :stroke-dashoffset="offset" :transform="`rotate(-90 ${centerX} ${centerY})`" />
      </g>
      <g>
        <!-- иконка -->
        <svg v-if="props.status !== 'in progress'" :stroke="statusColor" :fill="statusColor" x="38" y="38" width="40"
          height="40" viewBox="0 0 100 100">
          <use :href="statusIcon" />
        </svg>
        <!-- текст -->
        <text v-else :x="center + 2" :y="center + 5" text-anchor="middle" fill="#939393" font-size="16">
          {{ progress }}%
        </text>
      </g>
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  progress: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    default: ""
  },
  dashboard: {
    type: Boolean,
    default: false
  }
});

const size = 100;
const strokeWidth = 10;
const radius = 40;
const circumference = 2 * Math.PI * radius;
const center = 50

const arcRatio = computed(() => props.dashboard ? 0.75 : 1) // 3/4 круга
const dashArray = computed(() => circumference * arcRatio.value);
const backgroundPath = computed(() => {
  const startAngle = 135;
  const endAngle = -135;
  const start = polarToCartesian(center, center, radius, endAngle);
  const end = polarToCartesian(center, center, radius, startAngle);

  return `
    M ${start.x} ${start.y}
    A ${radius} ${radius} 0 1 1 ${end.x} ${end.y}
  `;
});



function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

// прогресс
const offset = computed(() => {
  const progressRatio = (100 - props.progress) / 100;
  return progressRatio * dashArray.value;
});

const progressColor = computed(() => {
  const hue = (props.progress * 1.2);
  return `hsl(${hue}, 100%, 50%)`;
});

const statusIcon = computed(() => {
  if (props.status !== "in progress") return statusIcons[props.status]
  else return ""
})
const statusIcons = { "success": "/s.svg", "error": "/e.svg", "warning": "/w.svg" }

const statusColor = computed(() => {
  if (props.status) {
    switch (props.status) {
      case "success": return "#4CAF50";
      case "warning": return "#d7a106";
      case "error": return "#F44336";
    }
  }
})
</script>

<style scoped>
.progress-container {
  display: inline-block;
}

circle {
  transition: stroke-dashoffset 0.5s ease, stroke 0.3s ease;
}
</style>