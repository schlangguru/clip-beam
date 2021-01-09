<template>
  <div class="wrapper">
    <div class="content">
      <div class="card">
        <div v-if="showScanner">
          <qr-scanner></qr-scanner>
          <div class="p-inputgroup">
            <InputText placeholder="Enter ID manually" v-model="peerUuid" />
            <Button
              icon="pi pi-caret-right"
              class="p-button-success"
              @click="connectToDevice"
            />
          </div>
        </div>
        <div v-else>
          <qr-code :value="myUuid"></qr-code>
          <Button
            class="p-button-secondary"
            icon="pi pi-copy"
            label="Copy ID to clipboard"
            @click="copyUuidToClipboard"
          ></Button>
        </div>
      </div>

      <div class="card">
        <Button
          v-if="showScanner"
          icon="pi pi-th-large"
          label="Show my connection info"
          @click="showScanner = false"
        ></Button>

        <Button
          v-else
          icon="pi pi-cloud-upload"
          label="Connect to a device"
          @click="showScanner = true"
        ></Button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

// Compoenents
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import QrCode from "../components/QrCode.vue";
import QrScanner from "../components/QrScanner.vue";

// Services
import { v4 as uuidv4 } from "uuid";
import { WebRTCService } from "../services/WebRTCService";

const webRTCService = new WebRTCService();

export default defineComponent({
  name: "Home",
  components: {
    Button,
    InputText,
    QrCode,
    QrScanner
  },
  data() {
    return {
      myUuid: uuidv4(),
      peerUuid: null as string | null,
      showScanner: false
    };
  },
  mounted() {
    webRTCService.registerClient(this.myUuid);
  },
  methods: {
    copyUuidToClipboard() {
      const textArea = document.createElement("textarea");
      textArea.value = this.myUuid;

      // Avoid scrolling to bottom
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    },

    connectToDevice() {
      if (this.peerUuid) {
        webRTCService.connectToDevice(this.peerUuid);
      }
    }
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
}

.card {
  background-color: #fff;
  border-radius: 10px;
  margin: 10px;
  padding: 10px;
  text-align: center;
}
</style>
