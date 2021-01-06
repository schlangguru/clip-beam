<template>
  <div>
    <div id="sourceSelectPanel">
      <label for="sourceSelect">Select Camera:</label>
      <select id="sourceSelect" @change="cameraChanged">
        <option
          v-for="camera in cameras"
          v-bind:key="camera.deviceId"
          :value="camera.deviceId"
        >
          {{ camera.label }}
        </option>
      </select>
    </div>

    <video
      ref="video"
      width="300"
      height="200"
      style="border: 1px solid gray"
    ></video>

    <div class="result">{{ result }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { BrowserQRCodeReader, VideoInputDevice } from "@zxing/library";

const codeReader = new BrowserQRCodeReader();

export default defineComponent({
  name: "QrScanner",
  data() {
    return {
      cameras: [] as VideoInputDevice[],
      selectedCamera: "",
      result: ""
    };
  },
  mounted() {
    this.initCameras();
  },
  methods: {
    async initCameras() {
      const videoInputDevices = await codeReader.getVideoInputDevices();
      if (videoInputDevices.length == 0) {
        this.result = "No camera found.";
      } else {
        this.cameras = videoInputDevices;
        this.selectedCamera = this.cameras[0].deviceId;
        this.scan();
      }
    },

    cameraChanged(event: Event) {
      const target = event.target as HTMLSelectElement;
      this.selectedCamera = target.value;
      this.scan();
    },

    async scan() {
      const videoElement = this.$refs.video as HTMLVideoElement;
      const result = await codeReader.decodeFromInputVideoDevice(
        this.selectedCamera,
        videoElement
      );
      this.result = result.getText();
    }
  }
});
</script>

<style scoped></style>
