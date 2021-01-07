<template>
  <div>
    <video
      ref="video"
      width="300"
      height="200"
      style="border: 1px solid gray"
    ></video>

    <br />

    <Dropdown
      v-model="selectedCamera"
      :options="cameras"
      optionLabel="label"
      placeholder="Select a camera"
      @change="cameraChanged"
    />

    <div class="result">{{ result }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

// Components
import Dropdown from "primevue/dropdown";

// Services
import { BrowserQRCodeReader, VideoInputDevice } from "@zxing/library";

const codeReader = new BrowserQRCodeReader();

export default defineComponent({
  name: "QrScanner",
  components: {
    Dropdown
  },
  data() {
    return {
      cameras: [] as VideoInputDevice[],
      selectedCamera: null as VideoInputDevice | null,
      result: ""
    };
  },
  computed: {
    cameraSelection() {
      return "";
    }
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
        this.selectedCamera = this.cameras[0];
        this.scan();
      }
    },

    async scan() {
      if (!this.selectedCamera) {
        this.result = "No camera selected.";
        return;
      }

      const videoElement = this.$refs.video as HTMLVideoElement;
      try {
        const result = await codeReader.decodeFromInputVideoDevice(
          this.selectedCamera.deviceId,
          videoElement
        );
        this.result = result.getText();
      } catch (err) {
        // ignore
      }
    },

    cameraChanged() {
      codeReader.reset();
      this.scan();
    }
  }
});
</script>

<style scoped></style>
