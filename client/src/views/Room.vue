<template>
  <div class="p-inputgroup">
    <InputText placeholder="Send" v-model="message" />
    <Button icon="pi pi-caret-right" class="p-button-success" @click="send" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

// Compoenents
import Button from "primevue/button";
import InputText from "primevue/inputtext";

// Services
import webRTCService from "../services/WebRTCService";

export default defineComponent({
  name: "Room",
  components: {
    Button,
    InputText
  },
  data() {
    return {
      message: ""
    };
  },
  mounted() {
    webRTCService.addMessageCallback(event => {
      console.log("Got Message", event.data);
    });
  },
  methods: {
    send() {
      webRTCService.sendMessage(this.message);
    }
  }
});
</script>

<style scoped></style>
