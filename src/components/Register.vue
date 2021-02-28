<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="6">
        <v-card class="mt-5" elevation="8" :loading="loading">
          <v-card-title>
            <h2 class="mx-auto">Form Register</h2>
          </v-card-title>
          <v-card-text class="pl-5 pr-5">
            <v-form @submit.prevent="register">
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
                <v-btn color="info" type="submit"
                  ><v-icon left> mdi-account-circle </v-icon> Register</v-btn
                >
                <v-btn color="success" to="/"
                  ><v-icon left> mdi-login </v-icon> Login</v-btn
                >
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar">
      {{ message }}

      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
// import axios from "axios";
import { mapMutations, mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      token: "",
      showPassword: false,
      loading: false,
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
    ...mapMutations(["setToken"]),
    ...mapActions(["register2"]),
    handleClick() {
      this.showPassword = !this.showPassword;
    },
    register() {
      this.loading = true;
      this.register2(this.email, this.password).finally(() => {
        this.loading = false;
      });
    },
  },
  computed: {
    ...mapState(["snackbar", "message"]),
  },
};
</script>
