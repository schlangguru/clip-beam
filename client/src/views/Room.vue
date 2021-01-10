<template>
  <div class="wrapper">
    <div class="content">
      <Card class="background">
        <template #content>
          <ScrollPanel style="width: 100%; height: 80vh" class="custom">
            <Card class="message" v-for="i in [1, 2, 3, 4, 5]" v-bind:key="i">
              <template #title> Message {{ i }} </template>
              <template #content>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Inventore sed consequuntur error repudiandae numquam deserunt
                quisquam repellat libero asperiores earum nam nobis, culpa
                ratione quam perferendis esse, cupiditate neque quas!
              </template>
              <template #footer>
                <Button icon="pi pi-download" label="Save" />
              </template>
            </Card>
          </ScrollPanel>

          <div class="p-inputgroup">
            <InputText placeholder="Send" v-model="message" />
            <Button
              icon="pi pi-caret-right"
              class="p-button-success"
              @click="send"
            />
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

// Compoenents
import Card from "primevue/card";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import ScrollPanel from "primevue/scrollpanel";

// Services
import webRTCService from "../services/WebRTCService";

export default defineComponent({
  name: "Room",
  components: {
    Card,
    Button,
    InputText,
    ScrollPanel
  },
  data() {
    return {
      message: ""
    };
  },
  mounted() {
    webRTCService.onData.addListener(data => {
      console.log("Got Message", data);
    });
  },
  methods: {
    send() {
      webRTCService.sendMessage(this.message);
    }
  }
});
</script>

<style scoped>
.wrapper {
  width: 100vw;
  height: 100vh;

  display: grid;
  grid-template-columns: 25px auto 25px;
  grid-template-rows: 25px auto 25px;
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

.content .background {
  background-color: rgba(255, 255, 255, 0.7);
}

.content .message {
  margin-top: 15px;
}
</style>
