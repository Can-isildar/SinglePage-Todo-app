<template>
  <v-app class="user">
    <!-- <Navbar :user="user" @showTodoItemsList="showTodoItems=!showTodoItems">
    </Navbar> -->
    <v-main>
      <v-container class="container">
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";

export default {
  name: "app",
  data() {
    return {
      showTodoItems: false,
      showTodo: false,
    };
  },
  components: {},
  setup() {
    const user = ref(sessionStorage.getItem("user"));

    const updateUserFromSessionStorage = () => {
      user.value = sessionStorage.getItem("user");
    };

    // Component mount olduğunda başlat
    onMounted(() => {
      // Her saniye updateUserFromSessionStorage fonksiyonunu çağır
      const intervalId = setInterval(updateUserFromSessionStorage, 1000);

      // Component unmount olduğunda interval'i temizle
      onUnmounted(() => {
        clearInterval(intervalId);
      });
    });

    return {
      user,
    };
  },
  methods: {
    showTodoItemsList() {
      this.showTodoItems = true;
    },
    showTodoList() {
      this.showTodo = true;
    },
  },
};
</script>

<style scoped></style>
