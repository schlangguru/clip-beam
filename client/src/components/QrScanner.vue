<template>
  <div>
    <Message v-if="error" severity="error" :closable="false">{{
      error
    }}</Message>

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
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

// Components
import Dropdown from "primevue/dropdown";
import Message from "primevue/message";

// Services
import { BrowserQRCodeReader, VideoInputDevice } from "@zxing/library";

const codeReader = new BrowserQRCodeReader();

export default defineComponent({
  name: "QrScanner",
  components: {
    Dropdown,
    Message
  },
  emits: ["scan"],
  data() {
    return {
      cameras: [] as VideoInputDevice[],
      selectedCamera: null as VideoInputDevice | null,
      error: ""
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
        this.error = "No camera found.";
      } else {
        this.cameras = videoInputDevices;
        this.selectedCamera = this.cameras[0];
        this.scan();
      }
    },

    async scan() {
      if (!this.selectedCamera) {
        this.error = "No camera selected.";
        return;
      }

      const videoElement = this.$refs.video as HTMLVideoElement;
      try {
        const result = await codeReader.decodeFromInputVideoDevice(
          this.selectedCamera.deviceId,
          videoElement
        );
        this.$emit("scan", result.getText());
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
