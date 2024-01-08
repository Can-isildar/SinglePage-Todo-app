<template>
  <v-progress-linear v-if="success" indeterminate color="green"></v-progress-linear>
  <v-alert
    v-if="success"
    color="success"
    icon="$success"
    title="Save Note"
    text="Save note Successfully"
  ></v-alert>
  <v-progress-linear v-if="error" indeterminate color="error"></v-progress-linear>
  <Error :error="error" v-if="error" />
  <main id="sample">
    <Editor
      v-model="noteContent"
      api-key="3prb8g4iaeuxklwchrmbweng8y1exq25g62n90wcf0m0ymoi"
      :init="{
        plugins: 'lists link image table code help wordcount',
      }"
    />

    <v-btn color="green" @click="saveContent()">Save</v-btn>
    <v-btn color="red-darken-2" @click="seeNote"> See Note </v-btn>
    <v-snackbar v-model="snackbar" multi-line>
      {{ readNote }}

      <template v-slot:actions>
        <v-btn color="red" variant="text" @click="snackbar = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </main>
</template>

<script setup>
import Error from "@/components/Error.vue";
import Editor from "@tinymce/tinymce-vue";
import { ref } from "vue";
import { addContent, getNoteById } from "@/services/api";
const readNote = ref("");
const error = ref(false);
const noteContent = ref("");
let success = ref(false);
let snackbar = ref(false);
async function saveContent() {
  if (noteContent.value.trim() === "") {
    error.value = "Please do not empty the field blank";
    setTimeout(() => {
      error.value = false;
    }, 3000);
  } else {
    const id = localStorage.getItem("note_id");
    const Content = noteContent.value.replace(/&nbsp;/g, " ");
    const trimContent = Content.trim();
    const sliceContent = trimContent.slice(3, trimContent.length - 4).trim();
    const noteData = {
      content: sliceContent,
    };
    const jsonNote = JSON.stringify(noteData);
    await addContent(id, jsonNote);
    noteContent.value = "";
    success.value = true;
    setTimeout(() => {
      success.value = false;
    }, 3000);
  }
}
function seeNote() {
  snackbar.value = true;
  console.log(readNote.value);
  const id = localStorage.getItem("note_id");
  getNoteById(id).then((val) => {
    readNote.value = val.content;
  });
}
</script>
