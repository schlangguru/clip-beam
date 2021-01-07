<template>
  <div class="wrapper">
    <div class="content">
      <div v-if="connectToDevice">
        <qr-scanner></qr-scanner>
        <Button
          icon="pi pi-th-large"
          label="Show my connection info"
          @click="connectToDevice = false"
        >
        </Button>
      </div>
      <div v-else>
        <qr-code :value="uuid"></qr-code>
        <Button
          icon="pi pi-cloud-upload"
          label="Connect to a device"
          @click="connectToDevice = true"
        ></Button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

// Compoenents
import Button from "primevue/button";
import QrCode from "../components/QrCode.vue";
import QrScanner from "../components/QrScanner.vue";

// Services
import { v4 as uuidv4 } from "uuid";

export default defineComponent({
  name: "Home",
  components: {
    Button,
    QrCode,
    QrScanner
  },
  data() {
    return {
      uuid: uuidv4(),
      connectToDevice: false
    };
  }
});
</script>

<style scoped>
.wrapper {
  width: 100vw;
  height: 100vh;

  display: grid;
  grid-template-columns: auto max-content auto;
  grid-template-rows: 35px max-content auto;
  grid-template-areas:
    ". . ."
    ". content ."
    ". . .";

  background-image: url("/img/background.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

.wrapper .content {
  grid-area: content;
  background-color: #fff;
  border-radius: 10px;
  padding: 10px;
  text-align: center;
}
</style>
