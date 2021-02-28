<template>
  <v-app>
    <v-app-bar app dark color="blue">
      <v-toolbar-title
        ><span class="font-weight-bold">Todo App</span></v-toolbar-title
      >
      <v-spacer></v-spacer>
      <v-btn text v-show="isLogin" @click="signout">logout</v-btn>
    </v-app-bar>
    <v-main class="bg">
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({}),
  computed: {
    isLogin() {
      return this.$store.state.userToken;
    },
  },
  methods: {
    signout() {
      localStorage.removeItem("user-token");
      this.$store.commit("user-token", null);
      this.$router.push("/");
    },
  },
};
</script>