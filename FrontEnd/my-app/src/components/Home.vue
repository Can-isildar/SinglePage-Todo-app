<template>
  <v-app-bar id="inspire">
    <v-toolbar
      dark
      prominent
      image="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg"
    >
      <v-app-bar-nav-icon @click="toggleLeftMenu"></v-app-bar-nav-icon>
      <v-toolbar-title class="headline">
        <v-toolbar-items><v-btn @click="goHome">TodoApp</v-btn></v-toolbar-items>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn v-if="!userStore.user[0]" text>
        <router-link to="/register" class="brn">
          <v-icon left>mdi-account-circle</v-icon>
          Sign Up
        </router-link>
      </v-btn>
      <v-btn v-if="!userStore.user[0]" text>
        <router-link to="/login" class="brn">
          <v-icon left>mdi-account-circle</v-icon>
          Log In
        </router-link>
      </v-btn>
      <div v-if="userStore.user[0]">
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn icon="mdi-account-circle" v-bind="props"></v-btn>
          </template>
          <v-card min-width="200px" style="background: darkblue">
            <v-list>
              <v-list-item
                prepend-avatar="https://cdn.vuetifyjs.com/images/john.jpg"
                :title="userStore.user[0].username"
                subtitle="user"
              >
              </v-list-item>
              <v-list-item style="display: flex; justify-content: space-between">
                <v-btn
                  v-if="userStore.user[0]"
                  @click="handleClick"
                  style="left: 1%; color: white; background-color: blue"
                  size="small"
                >
                  <v-icon>mdi-logout</v-icon>
                  log out</v-btn
                >
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
      </div>
    </v-toolbar>
  </v-app-bar>
  <v-navigation-drawer style="z-index: 2" dark clipped stateless v-model="leftMenu">
    <v-list>
      <v-list-item @click="handleTodo">Todos</v-list-item>
      <v-list-item @click="handleNote">Notes</v-list-item>
    </v-list>
  </v-navigation-drawer>
  <v-navigation-drawer
    id="nav2"
    style="z-index: 1"
    dark
    clipped
    v-model="rightMenu"
    stateless
  >
    <v-list class="list-group" v-if="showTodo">
      <div
        v-for="(todo, index) in todoList"
        :key="index"
        class="list-group-item todo-list-item"
      >
        <div style="display: flex; justify-content: space-between">
          <v-dialog v-model="todo.editing" persistent width="800px">
            <template v-slot:activator="{ on }">
              <v-list-item
                v-if="!todo.editing"
                @click="showTodoItemsList(todo.id)"
                class="todo-text-bold"
                style="width: 130px; max-width: auto"
                >{{ todo.names }}</v-list-item
              >
              <v-list-item
                v-else-if="todo.editing"
                @click="showTodoItemsList(todo.id)"
                class="todo-text-bold"
                style="width: 130px; max-width: auto"
                >{{ todo.names }}</v-list-item
              >
              <v-list-item v-bind="on" size="x-small" style="color: rgb(23, 242, 23)">
                <v-icon @click="startEdit(todo)">mdi-pencil</v-icon>
              </v-list-item>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">Update Todo</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="16" sm="6" md="4">
                      <input
                        v-model="updateNewTodo"
                        :placeholder="updatePlaceHolder"
                        @keydown.enter="confirmUpdate(todo)"
                        class="form-control todo-input"
                        style="width: 100%"
                        required
                      />
                      <Error :error="error" v-if="error"></Error>
                    </v-col>
                  </v-row>
                </v-container>
                <small>*indicates required field</small>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="text" @click="cancelEdit(todo)">
                  Close
                </v-btn>
                <v-btn
                  color="blue-darken-1"
                  variant="text"
                  @click="confirmUpdate(todo.id, todo)"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-list-item size="x-small" @click="removeTodo(todo.id)" style="color: red">
            <v-icon>mdi-close</v-icon>
          </v-list-item>
        </div>
      </div>
      <v-row justify="center" class="my-6" v-if="showTodo">
        <v-dialog v-model="dialog" persistent width="800px">
          <template v-slot:activator="{ props }">
            <v-btn color="primary" v-bind="props"> Add Todos </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">Add Todo</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="16" sm="6  " md="4">
                    <input
                      v-model="newTodo"
                      :placeholder="newTodoPlaceholder"
                      @keydown.enter="addTodo"
                      @keydown.esc="dialog = false"
                      class="form-control todo-input"
                      style="width: 100%"
                      required
                    />
                    <Error :error="error" v-if="error"></Error>
                  </v-col>
                </v-row>
              </v-container>
              <small>*indicates required field</small>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="dialog = false">
                Close
              </v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="addTodo"> Save </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </v-list>

    <v-list v-if="showNotes">
      <div class="list-group">
        <div
          v-for="(note, index) in noteList"
          :key="index"
          class="list-group-item todo-list-item"
        >
          <div style="display: flex; justify-content: space-between">
            <v-dialog v-model="note.editing" persistent width="800px">
              <template v-slot:activator="{ on }">
                <v-list-item
                  v-if="!note.editing"
                  @click="handleShowDashboard(note.id)"
                  class="todo-text-bold"
                  style="width: 130px; max-width: auto"
                >
                  {{ note.text }}
                </v-list-item>
                <v-list-item
                  v-else-if="note.editing"
                  @click="handleShowDashboard(note.id)"
                  class="todo-text-bold"
                  style="width: 130px; max-width: auto"
                >
                  {{ note.text }}
                </v-list-item>
                <v-list-item v-bind="on" size="x-small" style="color: rgb(23, 242, 23)">
                  <v-icon @click="startEditNote(note)">mdi-pencil</v-icon>
                </v-list-item>
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5">Update Note</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="16" sm="6" md="4">
                        <input
                          v-model="updateNewNote"
                          :placeholder="updateNotePlaceHolder"
                          @keydown.enter="confirmUpdateNote(note)"
                          class="form-control todo-input"
                          style="width: 100%"
                          required
                        />
                        <Error :error="error" v-if="error"></Error>
                      </v-col>
                    </v-row>
                  </v-container>
                  <small>*indicates required field</small>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="blue-darken-1"
                    variant="text"
                    @click="cancelEditNote(note)"
                  >
                    Close
                  </v-btn>
                  <v-btn
                    color="blue-darken-1"
                    variant="text"
                    @click="confirmUpdateNote(note.id, note)"
                  >
                    Save
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-list-item size="x-small" @click="removeNote(note.id)" style="color: red">
              <v-icon>mdi-close</v-icon>
            </v-list-item>
          </div>
        </div>
      </div>
      <v-row justify="center" class="my-6" v-if="showNotes">
        <v-dialog v-model="dialog2" persistent width="800px">
          <template v-slot:activator="{ props }">
            <v-btn color="primary" v-bind="props"> Add Notes </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">Add Note</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="16" sm="6  " md="4">
                    <input
                      v-model="newNote"
                      :placeholder="newNotePlaceholder"
                      @keydown.enter="addNewNote"
                      @keydown.esc="dialog2 = false"
                      class="form-control todo-input"
                      style="width: 100%"
                      required
                    />
                    <Error :error="error" v-if="error"></Error>
                  </v-col>
                </v-row>
              </v-container>
              <small>*indicates required field</small>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="dialog2 = false">
                Close
              </v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="addNewNote">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </v-list>
  </v-navigation-drawer>
  <div v-if="show">
    <v-icon
      style="left: 98%; display: flex; justify-content: end"
      size="x-large"
      @click="closeTodoItemsList"
      >mdi-arrow-left-circle</v-icon
    >
    <TodoItems />
  </div>
  <div v-if="showDashBoard">
    <v-icon style="left: 98%" size="x-large" @click="closeNoteList"
      >mdi-arrow-left-circle</v-icon
    >
    <DashBoard />
  </div>
  <!-- <div v-if="showPrewiew">
    <v-icon size="x-large" @click="closePrewiew">mdi-arrow-left-circle</v-icon>
    <Prewiew />
  </div> -->
</template>
<script>
import { useUserStore } from "@/store/app";
import {
  addTodos,
  getTodos,
  deleteTodos,
  updateTodos,
  getNotes,
  addNote,
  deleteNote,
  updateNote,
} from "@/services/api";
import Error from "@/components/error.vue";
import { onMounted, ref } from "vue";
import TodoItems from "@/components/todoItems.vue";
import DashBoard from "@/components/dashboard.vue";
import Prewiew from "@/components/prewiewNote.vue";
import router from "@/router";
export default {
  data() {
    return {
      leftMenu: false,
      rightMenu: false,
      dialog: false,
      dialog2: false,
      showTodo: false,
      show: false,
      showNotes: false,
      showDashBoard: false,
      dialog3: false,
      dialog4: false,
      showPrewiew: false,
      error: false,
    };
  },
  name: "Home",
  props: ["user"],
  setup() {
    const userStore = useUserStore();
    const todoList = ref([]);
    const noteList = ref([]);
    const newTodo = ref("");
    const newNote = ref("");
    const updateNewTodo = ref("");
    const updateNewNote = ref("");
    onMounted(async () => {
      try {
        const userData = JSON.parse(sessionStorage.getItem("userData"));
        if (userData) {
          const fetchedTodos = await getTodos(userData.token);
          todoList.value = fetchedTodos;
        } else {
          // Kullanıcı verisi bulunamadı, yönlendirme veya hata işlemleri yapılabilir.
        }
        if (userData) {
          noteList.value = await getNotes(userData.token);
        } else {
          // Kullanıcı verisi bulunamadı, yönlendirme veya hata işlemleri yapılabilir.
        }
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    });
    return {
      userStore,
      todoList,
      newTodo,
      updateNewTodo,
      newNote,
      noteList,
      updateNewNote,
    };
  },
  components: {
    TodoItems,
    DashBoard,
    // Prewiew,
    Error,
  },
  computed: {
    newTodoPlaceholder() {
      return this.newTodo ? "" : "Enter a new todo";
    },
    newNotePlaceholder() {
      return this.newNote ? "" : "Enter a new Note";
    },
    updatePlaceHolder() {
      return this.updateNewTodo ? "" : "Update Todo";
    },
    updateNotePlaceHolder() {
      return this.updateNewNote ? "" : "Update Note";
    },
  },
  methods: {
    async confirmUpdate(id, todo) {
      const updateTodo = {
        names: this.updateNewTodo,
      };
      if (this.updateNewTodo.trim() === "") {
        this.error = "Please do not empty the field blank";
        setTimeout(() => {
          this.error = false;
        }, 2000);
      } else {
        const TodoJSON = JSON.stringify(updateTodo);
        await updateTodos(id, TodoJSON);
        todo.names = updateTodo.names;
        this.updateNewTodo = "";
        todo.editing = false;
      }
    },
    startEdit(todo) {
      this.updateNewTodo = todo.names;
      todo.editing = true;
    },
    cancelEdit(todo) {
      this.updateNewTodo = "";

      todo.editing = false;
    },
    closePrewiew() {
      this.showPrewiew = false;
    },
    cancelEditNote(note) {
      note.editing = false;
    },
    startEditNote(note) {
      this.updateNewNote = note.text;
      note.editing = true;
    },
    async confirmUpdateNote(id, note) {
      const updateNotes = {
        text: this.updateNewNote,
      };
      if (this.updateNewNote.trim() === "") {
        this.error = "Please do not empty the field blank";
        setTimeout(() => {
          this.error = false;
        }, 2000);
      } else {
        const NoteJSON = JSON.stringify(updateNotes);
        await updateNote(id, NoteJSON);
        note.text = updateNotes.text;
        note.editing = false;
        this.updateNewNote = "";
      }
    },
    closeNoteList() {
      this.showDashBoard = false;
    },
    handleShowDashboard(id) {
      localStorage.setItem("note_id", id);
      this.show = false;
      this.showDashBoard = false;
      setTimeout(() => {
        this.showDashBoard = true;
      }, 200);
    },
    handleTodo() {
      this.showTodo = true;
      this.showNotes = false;
    },
    handleNote() {
      this.showTodo = false;
      this.showNotes = true;
    },
    async addNewNote() {
      const note = {
        text: this.newNote,
      };
      if (this.newNote.trim() === "") {
        this.error = "Please do not empty the field blank";
        setTimeout(() => {
          this.error = false;
        }, 2000);
      } else {
        await addNote(note).then((val) => {
          this.noteList.push({
            id: val.note.id,
            text: this.newNote,
            user_id: val.note.user_id,
          });
        });
        this.dialog2 = false;
      }
    },
    async removeNote(id) {
      await deleteNote(id);
      this.noteList.splice(
        this.noteList.findIndex((item) => item.id == id),
        1
      );
    },
    goHome() {
      router.push("/");
    },
    closeTodoItemsList() {
      this.show = false;
    },
    async showTodoItemsList(id) {
      localStorage.setItem("todo_id", id);
      this.show = false;
      setTimeout(() => {
        this.show = true;
      }, 200);
      this.showDashBoard = false;
    },
    toggleLeftMenu() {
      if (this.rightMenu && this.leftMenu && this.userStore.user[0]) {
        this.rightMenu = false;
        this.leftMenu = !this.leftMenu;
        this.showDashBoard = false;
        this.show = false;
      } else if (!this.rightMenu && !this.leftMenu && this.userStore.user[0]) {
        this.rightMenu = true;
        this.leftMenu = true;
        this.showDashBoard = false;
        this.show = false;
      } else if (!this.rightMenu && this.leftMenu && this.userStore.user[0]) {
        this.leftMenu = false;
      }
    },
    handleClick() {
      sessionStorage.removeItem("userData");
      sessionStorage.removeItem("token");
      localStorage.removeItem("todo_id");
      localStorage.removeItem("userId");
      sessionStorage.removeItem("userId");
      this.$router.push("/");
      window.location.reload();
    },
    async addTodo() {
      const todo = {
        names: this.newTodo,
      };
      if (this.newTodo.trim() === "") {
        this.error = "Please do not empty the field blank";
        setTimeout(() => {
          this.error = false;
        }, 2000);
      } else {
        await addTodos(todo).then((val) => {
          this.todoList.push({ id: val.id, names: this.newTodo });
          this.newTodo = "";
        });
        this.dialog = false;
      }
    },
    async removeTodo(id) {
      await deleteTodos(id);
      this.todoList.splice(
        this.todoList.findIndex((item) => item.id == id),
        1
      );
    },
  },
};
</script>

<style scoped>
.v-list {
  padding: 0;
}

#appbar {
  background-color: rgb(188, 118, 21);
  display: flex;
}

.brn {
  color: black;
  text-decoration: none;
}
</style>
