<template>
  <div>
    <v-row justify="center">
      <v-btn color="indigo" dark @click="gotocontact">Add Contact</v-btn>
    </v-row>
    <v-row justify="center">
      <v-radio-group v-model="radios" row>
        <div @click="getcontacts">
          <v-radio label="All" value="All"></v-radio>
        </div>
        <div @click="getcontacts" v-for="(item,i) in itemarray" :key="i">
          <v-radio v-bind:label="item" v-bind:value="item"></v-radio>
        </div>
      </v-radio-group>
    </v-row>
    <v-row>
      <v-col id="searchbar">
        <v-text-field v-model="search" label="Search Contact"></v-text-field>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-expansion-panels popout>
        <v-expansion-panel v-for="contact in filterContacts" :key="contact._id">
          <v-row>
            <v-col cols="11">
              <v-expansion-panel-header>
                <v-row align="center" justify="center">
                  <v-col cols="2">
                    <!-- <span id="image-container">{{contact.name[0]}}</span> -->
                    <v-img :src="getImgUrl(contact.contactImage)" alt="Image" width="50px"></v-img>
                  </v-col>
                  <v-col cols="10">
                    <h2>{{contact.name}} - {{contact.primarynumber}}</h2>
                  </v-col>
                </v-row>
              </v-expansion-panel-header>
              <v-expansion-panel-content class>
                <v-row>
                  <v-col>
                    <v-icon color="indigo" dark class="mb-2" medium>mdi-cellphone</v-icon>
                    Secondary Number : {{contact.secondarynumber}}
                  </v-col>
                  <v-col>
                    <v-icon color="indigo" dark class="mb-2" medium>mdi-email</v-icon>
                    Email ID : {{contact.email}}
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-icon color="indigo" dark class="mb-2" medium>mdi-adjust</v-icon>
                    Address : {{contact.address}}
                  </v-col>
                  <v-col>
                    <v-icon color="indigo" dark class="mb-2" medium>mdi-menu</v-icon>
                    Category : {{contact.category}}
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
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
                    @click="editcontact(contact)"
                  >mdi-account-edit</v-icon>
                </template>
                <span>Edit Contact</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon
                    color="red"
                    dark
                    class="mb-2"
                    v-on="on"
                    medium
                    @click="deletecontact(contact)"
                  >mdi-delete</v-icon>
                </template>
                <span>Delete Contact</span>
              </v-tooltip>
            </v-col>
          </v-row>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>
  </div>
</template>

<script>
import { Bus } from "../main";
import server from "../constant";

export default {
  data() {
    return {
      valid: true,
      itemarray: [],
      newcategory: "",
      valid: true,
      contacts: [],
      showp: false,
      search: "",
      dialog: false,
      dialog2: false,
      contact: {
        name: "",
        primarynumber: "",
        secondarynumber: "",
        email: "",
        address: "",
        category: ""
      },
      defaultItem: {
        name: "",
        primarynumber: "",
        secondarynumber: "",
        email: "",
        address: "",
        category: ""
      },
      editedIndex: -1,
      username: "Welcome",
      nameRules: [
        v => !!v || "Category is required",
        v => v.length >= 3 || "Category must be greater than 2 characters"
      ],
      radios: "All",
      currentstring: "",
      checkstring: ""
    };
  },
  created() {
    console.log(localStorage.getItem("username"));
    this.username = localStorage.getItem("username");
    var body = {
      username: this.username
    };
    this.$http
      .post(`${server.path}contacts/readcontacts`, body, {
        observe: "body"
      })
      .then(data => {
        console.log(data);
        this.contacts = data.body;
      });
    this.$http
      .post(`${server.path}users/getcategorylist`, body, {
        observe: "body"
      })
      .then(data => {
        console.log(data);
        this.itemarray = data.body.doc.categorylist;
      });
  },
  computed: {
    filterContacts: function() {
      return this.contacts.filter(contact => {
        this.currentstring = contact.name.toLowerCase();
        this.checkstring = this.search.toLowerCase();
        return (
          this.currentstring.match(this.checkstring) ||
          contact.primarynumber.match(this.checkstring) ||
          contact.secondarynumber.match(this.checkstring) ||
          contact.email.match(this.checkstring)
        );
      });
    }
  },
  methods: {
    getImgUrl(url) {
      if (url) {
        return "http://localhost:3000/" + url;
      }
    },
    close() {
      this.dialog = false;
    },
    addcategory() {
      if (this.$refs.form.validate()) {
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
    },
    gotocontact() {
      this.$router.push("/addcontact");
    },
    gotocategory() {
      this.$router.push("/categories");
    },
    deletecontact: function(contact) {
      if (confirm("Do you really want to delete?")) {
        console.log(contact._id);
        var body = {
          id: contact._id,
          username: this.username,
          contactImage: contact.contactImage
        };
        this.$http
          .post(`${server.path}contacts/delete/`, body, {
            withCredentials: true
          })
          .then(() => {
            this.$http
              .post(`${server.path}contacts/readcontacts`, body, {
                observe: "body"
              })
              .then(data => {
                console.log(data);
                this.contacts = data.body;
                this.$toaster.warning("Your Contact is Successfully Deleted");
              });
          });
      }
    },
    editcontact: function(contact) {
      this.editedIndex = this.contacts.indexOf(contact);
      this.contact = Object.assign({}, contact);
      localStorage.setItem("id", this.contact._id);
      localStorage.setItem("name", this.contact.name);
      localStorage.setItem("num1", this.contact.primarynumber);
      localStorage.setItem("num2", this.contact.secondarynumber);
      localStorage.setItem("email", this.contact.email);
      localStorage.setItem("add", this.contact.address);
      localStorage.setItem("category", this.contact.category);
      localStorage.setItem("currentImagePath", this.contact.contactImage);
      if (this.contact.contactImage) {
        localStorage.setItem(
          "contactImage",
          "http://localhost:3000/" + this.contact.contactImage
        );
      }
      this.$router.push("/addcontact");
    },
    showusername() {
      console.log(this.username);
    },
    getcontacts() {
      console.log(this.radios);
      if (this.radios === "All") {
        var body = {
          username: this.username
        };
        this.$http
          .post(`${server.path}contacts/readcontacts`, body, {
            observe: "body"
          })
          .then(data => {
            console.log(data);
            this.contacts = data.body;
          });
      } else {
        var body = {
          username: this.username,
          category: this.radios
        };
        this.$http
          .post(`${server.path}contacts/getcontacts`, body, {
            observe: "body"
          })
          .then(data => {
            console.log(data);
            this.contacts = data.body;
          });
      }
    }
  },
};
</script>
<style scoped>
#lefticon {
  align-self: auto;
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
#searchbar {
  width: 80%;
  text-align: center;
}
#radio {
  text-align: center;
  margin: auto;
}
#editdelete {
  margin: auto;
}
</style>



