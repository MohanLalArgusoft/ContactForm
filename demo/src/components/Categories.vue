<template>
  <v-app id="categories">
    <v-row justify="center">
      <!-- <v-col cols="12">
        <v-card max-width="500" class="mx-auto">
          <v-toolbar color="indigo" dark>
            <v-toolbar-title>ADD CATEGORY</v-toolbar-title>
            <div class="flex-grow-1"></div>
            <v-btn text dark @click="close()">Close</v-btn>
            <v-btn text dark v-on:click="addcategory">Create</v-btn>
          </v-toolbar>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-text-field
                    max-width="500"
                    v-model="newcategory"
                    label="Name of Category"
                    :error-messages="nameErrors"
                    @input="$v.newcategory.$touch()"
                    @blur="$v.newcategory.$touch()"
                    required
                  ></v-text-field>
                </v-form>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item> -->
          <!-- <v-list-item v-for="(item,i) in itemarray" :key="i">
            <v-list-item-content>
              <v-list-item-title>{{i+1}}. {{item}}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-tooltip right>
                <template v-slot:activator="{ on }">
                  <v-icon
                    color="red"
                    dark
                    class="mb-2"
                    v-on="on"
                    medium
                    @click="deletecategory(i)"
                  >mdi-delete</v-icon>
                </template>
                <span>Delete Category</span>
              </v-tooltip>
            </v-list-item-action>
          </v-list-item> -->
        <!-- </v-card>
      </v-col> -->
      <v-col cols="12">
        <h2 style="text-align: center; color: mediumblue;">LIST OF CATEGORIES</h2>
        <v-expansion-panels popout>
          <v-expansion-panel v-for="(item,i) in itemarray" :key="i">
            <v-row>
              <v-col cols="11">
                <v-expansion-panel-header>
                  <v-row align="center" justify="center">
                    <v-col cols="2">
                      <span id="image-container">{{item[0]}}</span>
                    </v-col>
                    <v-col cols="10">
                      <h2>{{item}}</h2>
                    </v-col>
                  </v-row>
                </v-expansion-panel-header>
              </v-col>
              <v-col cols="1" id="editdelete">
                <v-tooltip right>
                  <template v-slot:activator="{ on }">
                    <v-icon
                      color="red"
                      dark
                      class="mb-2"
                      v-on="on"
                      medium
                      @click="deletecategory(i)"
                    >mdi-delete</v-icon>
                  </template>
                  <span>Delete Category</span>
                </v-tooltip>
              </v-col>
            </v-row>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
    <!-- <v-row justify="center">
    </v-row> -->
  </v-app>
</template>

<script>
import server from "../constant";
import {
  required,
  minLength,
  between,
  email,
  helpers
} from "vuelidate/lib/validators";
export default {
  data() {
    return {
      itemarray: [],
      newcategory: "",
      valid: true,
      contacts: [],
      showp: false,
      search: "",
      username: "Welcome",
      radios: "All",
      nameRules: [v => !!v || "Name is required"]
    };
  },
  validations: {
    newcategory: { required, minLength: minLength(2) }
  },
  computed: {
    nameErrors() {
      const errors = [];
      if (!this.$v.newcategory.$dirty) return errors;
      !this.$v.newcategory.minLength &&
        errors.push("Name must be atleast 2 characters long");
      !this.$v.newcategory.required && errors.push("Name is required.");
      return errors;
    }
  },
  created() {
    console.log(localStorage.getItem("username"));
    this.username = localStorage.getItem("username");
    var body = {
      username: this.username
    };
    this.$http
      .post(`${server.path}users/getcategorylist`, body, {
        observe: "body"
      })
      .then(data => {
        console.log(data);
        this.itemarray = data.body.doc.categorylist;
      });
  },
  methods: {
    close() {
      this.$router.push("/contacts");
    },
    addcategory() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        console.log("validations not work");
      } else {
        let flag = true;
        this.itemarray.forEach(item => {
          if (item.toLowerCase() === this.newcategory.toLowerCase()) {
            flag = false;
          }
        });
        if (flag) {
          this.itemarray.push(this.newcategory);
          var body = {
            username: this.username,
            categorylist: this.itemarray
          };
          this.$http
            .post(`${server.path}users/putcategorylist`, body, {
              observe: "body"
            })
            .then(data => {
              console.log(data);
              this.newcategory = "";
              this.$router.push("/contacts");
            });
          this.dialog2 = false;
        } else {
          this.$toaster.warning("Category already exists !");
        }
      }
    },
    deletecategory(i) {
      if (confirm("Do you really want to delete?")) {
        this.itemarray.splice(i, 1);
        var body = {
          username: this.username,
          categorylist: this.itemarray
        };
        this.$http
          .post(`${server.path}users/putcategorylist`, body, {
            observe: "body"
          })
          .then(data => {
            console.log(data);
          });
      }
    }
  }
};
</script>

<style scoped>
#show-contacts {
  max-width: 800px;
  margin: 0 auto;
}
.single-contact {
  /* padding: 20px; */
  margin: 20px 0;
  box-sizing: border-box;
  /* background: #eeeeee; */
}
#h2center{
  margin: auto;
  color: mediumblue;
}
#image-container {
  width: 35px;
  height: 35px;
  border-radius: 100%;
  background-color: violet;
  text-align: center;
  display: inline-block;
  line-height: 35px;
  font-weight: 500;
  font-size: 30px;
}
#editdelete{
  margin: auto;
}
</style>