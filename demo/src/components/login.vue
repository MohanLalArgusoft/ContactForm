
<template>
  <v-app id="inspire">
    <v-content>
      <v-container class="fill-height" fluid id="loginpage">
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Login form</v-toolbar-title>
                <div class="flex-grow-1"></div>
              </v-toolbar>
              <v-card-text>
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-text-field
                    v-model="username"
                    label="Login"
                    name="login"
                    prepend-icon="mdi-account"
                    type="text"
                    :rules="nameRules"
                  ></v-text-field>

                  <v-text-field
                    v-model="password"
                    :rules="passwordRules"
                    id="password"
                    label="Password"
                    name="password"
                    prepend-icon="mdi-lock"
                    type="password"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <div class="flex-grow-1"></div>
                <v-btn color="primary" v-on:click="login">Login</v-btn>
                <v-btn color="primary" v-on:click="register">Register</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { Bus } from "../main";
export default {
  data: () => ({
    valid: true,
    username: "",
    password: "",
    nameRules: [
      v => !!v || "Name is required",
      v => v.length >= 3 || "Name must be greater than 2 characters"
    ],
    passwordRules: [
      v => !!v || "Password is required",
      v => v.length >= 4 || "Password must be greater than 3 characters"
    ]
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "ADD CONTACT" : "EDIT CONTACT";
    }
  },
  methods: {
    login() {
      if (this.$refs.form.validate()) {
        var body = {
          username: this.username,
          password: this.password
        };
        this.$http
          .post("http://127.0.0.1:3000/users/login", body)
          .then(function(data) {
            console.log(data);
            this.token = JSON.stringify(data);
            localStorage.setItem("token", this.token);
            localStorage.setItem("username", this.username);
            localStorage.setItem("id", "");
            localStorage.setItem("name", "");
            localStorage.setItem("num1", "");
            localStorage.setItem("num2", "");
            localStorage.setItem("email", "");
            localStorage.setItem("add", "");
            localStorage.setItem("category", "");
            this.$router.push("/contacts");
          });
      }
    },
    register() {
      this.$router.push("/register");
    }
  }
};
</script>
<style scoped>
#loginpage {
  background-color: skyblue;
}
</style>