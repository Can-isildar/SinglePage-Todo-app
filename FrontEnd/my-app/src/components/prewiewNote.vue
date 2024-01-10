<template>
  <v-btn color="primary" @click="editNote">edit note</v-btn>
  <div>
    <h3 style="display: flex; justify-content: center">{{ userStore.note }}</h3>
  </div>
</template>

<script>
import router from "@/router";
import { getNotes } from "@/services/api";
import { useUserStore } from "@/store/app";
export default {
  setup() {
    const userStore = useUserStore();

    return {
      userStore,
    };
  },
  methods: {
    async showNote() {
      const note = await getNotes();
      console.log(note);
    },
    editNote() {
      router.push("/");
    },
  },
};
</script>
