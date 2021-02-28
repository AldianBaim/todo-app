<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="6">
        <v-card class="mt-5" elevation="8" :loading="loading">
          <v-card-title>
            <h2 class="mx-auto">Form Login</h2>
          </v-card-title>
          <v-card-text class="pl-5 pr-5">
            <v-form @submit.prevent="login">
              <v-text-field
                label="Email"
                prepend-icon="mdi-email"
                v-model="email"
                :rules="emailRules"
              ></v-text-field>
              <v-text-field
                :type="showPassword ? 'text' : 'password'"
                label="Password"
                prepend-icon="mdi-lock"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="handleClick"
                v-model="password"
                :rules="passwordRules"
              ></v-text-field>

              <v-divider></v-divider>

              <v-card-actions>
                <v-btn color="success" type="submit">
                  <v-icon left> mdi-login </v-icon>Login</v-btn
                >
                <v-btn color="info" to="/register"
                  ><v-icon left> mdi-account-circle </v-icon> Register</v-btn
                >
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <div class="text-center ma-2">
      <v-snackbar v-model="snackbar">
        Wrong email or password!

        <template v-slot:action="{ attrs }">
          <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </v-container>
</template>

<script>
import axios from "axios";
import { mapMutations, mapActions } from "vuex";

export default {
  data() {
    return {
      snackbar: false,
      loading: false,
      token: "",
      showPassword: false,
      account: {
        email: "aldi@gmail.com",
        password: "12345",
      },
      email: "",
      password: "",

      emailRules: [
        (v) => !!v || "E-mail is required!",
        (v) =>
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          "E-mail must be valid",
      ],
      passwordRules: [
        (v) => !!v || "Password is required!",
        (v) => v.length < 10 || "Password max is 10 character!",
      ],
    };
  },
  methods: {
    ...mapActions(["checkMenu"]),
    ...mapMutations(["setToken"]),
    handleClick() {
      this.showPassword = !this.showPassword;
    },
    async login() {
      this.loading = true;

      try {
        const response = await axios.post(
          "https://morning-reef-94255.herokuapp.com/login",
          {
            email: this.email,
            password: this.password,
          }
        );
        const token = await response.data.token;
        localStorage.setItem("user-token", token);
        this.setToken(token);
        this.$router.push("/todo");
      } catch (error) {
        console.log(error.response.status);
        this.snackbar = true;
      } finally {
        this.loading = false;
      }
    },
  },
  created() {},
};
</script>
