<template>
  <div class="wrapper">
    <div class="content">
      <qr-code value="blub"></qr-code>
      <qr-scanner></qr-scanner>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import QrCode from "../components/QrCode.vue";
import QrScanner from "../components/QrScanner.vue";

export default defineComponent({
  name: "Home",
  components: {
    QrCode,
    QrScanner
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
