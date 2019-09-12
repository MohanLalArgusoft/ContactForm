<template>
  <v-app id="categories">
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="600px">
        <template v-slot:activator="{ on }">
          <v-btn color="indigo" dark v-on="on">ADD CATEGORY</v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">{{formTitle}}</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                    <v-text-field
                      v-model="newcategory"
                      label="Category Name*"
                      @input="$v.newcategory.$touch()"
                      @blur="$v.newcategory.$touch()"
                      required
                    ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn color="blue darken-1" text @click="close()">Close</v-btn>
            <v-btn color="blue darken-1" text v-on:click="addcategory">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <v-row justify="center">
      <v-col>
        <h2 style="text-align: center; color: mediumblue;">LIST OF CATEGORIES</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col id="searchbar">
        <v-text-field v-model="search" label="Search Contact"></v-text-field>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12">
        <v-expansion-panels popout>
          <v-expansion-panel v-for="(item,i) in filterCategories" :key="i">
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
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon
                      color="orange"
                      dark
                      class="mb-2"
                      v-on="on"
                      medium
                      @click="editcategory(i,item)"
                    >mdi-account-edit</v-icon>
                  </template>
                  <span>Edit Category</span>
                </v-tooltip>
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
      dialog: false,
      itemarray: [],
      newcategory: "",
      valid: true,
      contacts: [],
      showp: false,
      search: "",
      username: "Welcome",
      radios: "All",
      currentstring: "",
      checkstring: "",
      editedIndex: -1
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
        errors.push("Category must be atleast 2 characters long");
      !this.$v.newcategory.required && errors.push("Category is required.");
      return errors;
    },
    filterCategories: function() {
      return this.itemarray.filter(item => {
        this.currentstring = item.toLowerCase();
        this.checkstring = this.search.toLowerCase();
        return this.currentstring.match(this.checkstring);
      });
    },
    formTitle() {
      return this.editedIndex === -1 ? "Add Category" : "Edit Category";
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
      this.dialog = false;
      this.editedIndex = -1;
      this.newcategory = "";
    },
    addcategory() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        console.log("validations not work");
      } else {
        if (this.editedIndex > -1) {
          // let flag = true;
          // this.itemarray.forEach(item => {
          //   if (item.toLowerCase() === this.newcategory.toLowerCase()) {
          //     flag = false;
          //   }
          // });
          // if (flag) {
            this.itemarray.splice(this.editedIndex, 1);
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
                    this.newcategory = "";
                    this.editedIndex = -1;
                  });
                this.dialog = false;
              });
          // } else {
          //   this.$toaster.warning("Category already exists !");
          // }
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
              });
            this.dialog = false;
          } else {
            this.$toaster.warning("Category already exists !");
          }
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
    },
    editcategory(i, item) {
      this.newcategory = item;
      this.editedIndex = i;
      this.dialog = true;
    },
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
#h2center {
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
#editdelete {
  margin: auto;
}
</style>