<template>
  <v-app-bar id="inspire">
    <v-toolbar dark prominent image="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg">
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
          <v-card min-width="200px">
            <v-list>
              <v-list-item prepend-avatar="https://cdn.vuetifyjs.com/images/john.jpg" :title="userStore.user[0].username"
                subtitle="user">
              </v-list-item>
              <v-list-item>
                <v-btn v-if="userStore.user[0]" icon="mdi-logout" @click="handleClick" style="left:70%" class="x-small">
                  <v-icon left></v-icon>
                </v-btn>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
      </div>
    </v-toolbar>
  </v-app-bar>
  <v-navigation-drawer style="z-index:2" dark clipped stateless v-model="leftMenu">
    <v-list class="">
      <v-list-item @click="showTodo = !showTodo">Todos</v-list-item>
      <v-list-item @click="showNotes">Notes</v-list-item>
    </v-list>
  </v-navigation-drawer>
  <v-navigation-drawer id="nav2" dark style="z-index:1" v-model="rightMenu" class="pb-0" stateless>
    <v-list>
      <div class="list-group" v-if="showTodo">
        <div v-for="(todo, index) in todoList" :key="index" class="list-group-item todo-list-item">
          <div>
            <template v-if="todo.editing">
              <input v-model="updateNewTodo" :placeholder="newUpdateTodoPlcaeHolder" class="form-control updateNewTodo"
                @keydown.enter="confirmUpdate(todo.id, todo)" @keydown.esc="cancelEdit(todo)">
              <v-btn @click="confirmUpdate(todo.id, todo)" icon
                class="checkButton small "><v-icon>mdi-check</v-icon></v-btn>
              <v-btn @click="cancelEdit(todo)" icon><v-icon class="closeButton">mdi-close</v-icon></v-btn>
            </template>
            <template v-else>
              <v-btn @click="showTodoItemsList(todo.id)" v-if="showTodo" class="todo-text-bold">{{ todo.names }}</v-btn>
            </template>
          </div>
        </div>
      </div>
      <v-row justify="center" class="my-6" v-if="showTodo">
        <v-dialog v-model="dialog" persistent width="800px">
          <template v-slot:activator="{ props }">
            <v-btn color="primary" v-bind="props">
              Add Todo
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">Add Todo</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="16" sm="6  " md="4">
                    <input v-model="newTodo" :placeholder="newTodoPlaceholder" @keydown.enter="addTodo"
                      class="form-control todo-input" style="width: 100%;" required>
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
              <v-btn color="blue-darken-1" variant="text" @click="addTodo">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
import { useUserStore } from '@/store/app';
import { addTodos, getTodos, deleteTodos, updateTodos } from '@/services/api';
import { onMounted, ref } from 'vue';
import router from '@/router';

export default {
  data() {
    return {
      leftMenu: false,
      rightMenu: false,
      dialog: false,
      showTodo: false,
    }
  },
  name: "Navbar",
  props: ["user"],
  setup() {
    const userStore = useUserStore();
    const todoList = ref([]);
    const newTodo = ref("");
    const updateNewTodo = ref("");
    onMounted(async () => {
      try {
        const userData = JSON.parse(sessionStorage.getItem("userData"));
        if (userData) {
          const fetchedTodos = await getTodos(userData.token);
          todoList.value = fetchedTodos;
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
      updateNewTodo
    };
  },
  computed: {
    newTodoPlaceholder() {
      return this.newTodo ? "" : "Enter a new todo";
    },
  },
  methods: {
    goHome() {
      router.push('/')
    },
    showTodoItemsList(id) {
      localStorage.setItem('todo_id', id)
      this.$emit("showTodoItemsList");
    },
    toggleLeftMenu() {
      if (this.rightMenu && this.leftMenu && this.userStore.user[0]) {
        this.rightMenu = false;
        this.leftMenu = !this.leftMenu;
      }
      else if (!this.rightMenu && !this.leftMenu && this.userStore.user[0]) {
        this.rightMenu = true;
        this.leftMenu = true;
      }
      else if (!this.rightMenu && this.leftMenu && this.userStore.user[0]) {
        this.leftMenu = false;
      }
    },
    handleClick() {
      sessionStorage.removeItem('userData');
      sessionStorage.removeItem('token');
      localStorage.removeItem('todo_id');
      localStorage.removeItem('userId');
      this.$router.push("/");
      window.location.reload()
    },
    async addTodo() {
      const todo = {
        names: this.newTodo
      }
      if (this.newTodo) {
        await addTodos(todo).then((val) => {
          this.todoList.push({ id: val.id, names: this.newTodo });
          this.newTodo = "";
        })
      }
      this.dialog = false;
    },
    async removeTodo(id) {
      await deleteTodos(id)
      this.todoList.splice(this.todoList.findIndex((item) => item.id == id), 1);
    },
    startEdit(todo) {
      // Düzenleme modunu başlatma işlemleri
      todo.editing = true;
    },
    async confirmUpdate(id, todo) {
      const updateTodo = {
        names: this.updateNewTodo
      }
      const TodoJSON = JSON.stringify(updateTodo)
      await updateTodos(id, TodoJSON)
      todo.names = updateTodo.names
      this.dialog = false
    },
    cancelEdit(todo) {
      // Düzenleme modunu iptal etme işlemleri
      todo.dialog = false;
    },
    async showTodoItems(id) {
      localStorage.setItem('todo_id', id)
    }
  },
};

</script>

<style scoped>
#appbar {
  background-color: rgb(188, 118, 21);
  display: flex;
}

.container {
  display: contents;
  justify-content: space-between;
  max-width: 1600px;

  span {
    color: black;
  }
}

.brn {
  color: black;
  text-decoration: none;
}

.sidebar2 {
  left: 15%;
}
</style>