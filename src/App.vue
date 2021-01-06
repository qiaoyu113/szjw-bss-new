<template>
  <div id="app">
    <router-view />
    <service-worker-update-popup />
    <freight-config-popup />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ServiceWorkerUpdatePopup from '@/pwa/components/ServiceWorkerUpdatePopup.vue'
import FreightConfigPopup from '@/views/freightConfigPopup/index.vue'

@Component({
  name: 'App',
  components: {
    ServiceWorkerUpdatePopup,
    FreightConfigPopup
  }
})
export default class extends Vue {}
</script>
