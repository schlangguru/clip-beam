<template>
  <div class="wrapper">
    <div class="content">
      <div v-if="connectToDevice">
        <qr-scanner></qr-scanner>
        <button type="button" @click="connectToDevice = false">
          Show my connection info
        </button>
      </div>
      <div v-else>
        <qr-code :value="uuid"></qr-code>
        <button type="button" @click="connectToDevice = true">
          Connect to a device
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

// Compoenents
import QrCode from "../components/QrCode.vue";
import QrScanner from "../components/QrScanner.vue";

// Services
import { v4 as uuidv4 } from "uuid";

export default defineComponent({
  name: "Home",
  components: {
    QrCode,
    QrScanner
  },
  data() {
    return {
      uuid: uuidv4(),
      connectToDevice: false
    };
  },
  mounted() {

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
