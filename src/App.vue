<template>
  <div id="app">
    <!--   Toolbar -->
    <Toolbar class="p-mb-4">
      <template #left>
        <Button label="New book" icon="pi pi-plus" class="p-button-success p-mr-2" @click="openCreateBookForm"/>
      </template>

      <template #right>
        <span class="p-input-icon-left">
          <i class="pi pi-search"/>
          <InputText v-model="qFilter"
                     @input="setQFilter"
                     @keyup.enter="sendRequest"
                     @blur="sendQRequest" placeholder="Search..."/>
        </span>
        <Dropdown id="searchIn" v-model="searchOption" :options="searchOptions"
                  optionLabel="searchOption" optionValue="value"
                  placeholder="Search by">
        </Dropdown>
      </template>
    </Toolbar>

    <!--    Books-->
    <div class="p-d-flex p-flex-column">
      <div v-for="book in books" :key="book._id" class="p-mb-2">
        <div class="p-d-flex" style="height: 18rem;">
          <Card class="p-col-2">
            <template #header>
              <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrKYr979Ad5PogdhhEIUfWmT1fx-rjJxsdEETbqPnUJb8_Yk38f4WDqzLd2H8beWst2p86dBKh&usqp=CAc"
                  style="height: 12rem;"/>
            </template>

            <template #title>
              <div class="p-d-inline text">
                <Rating @change="setStars(book)" v-model="book.stars" :stars="5" :cancel="false"></Rating>
                <i @click.stop="likeBook(book)" class="pi pi-thumbs-up p-mr-2 rate-button"
                   :class="{'rate': book.rate === 'like'}"></i>
                <i @click.stop="dislikeBook(book)" class="pi pi-thumbs-down rate-button"
                   :class="{'rate': book.rate === 'dislike'}"></i>
              </div>
            </template>
          </Card>

          <Card class="p-col-8">
            <template #title>
              {{ book.title }}
            </template>

            <template #subtitle>
              {{ book.author }}
            </template>

            <template #content>
              {{ book.description }}
            </template>

          </Card>
          <Card class="p-col-2" style="height: 18rem;">

            <template #subtitle>
              <div style="height: 10rem">
                <Chip :label="'#' + book.category"/>
              </div>
            </template>
            <template #footer>
              <Button icon="pi pi-trash" class="p-button-danger" @click="confirmRemoveBook(book)"/>
              <Button icon="pi pi-pencil" class="p-button-success" @click="prepareBookToUpdate(book)"/>
            </template>
          </Card>
        </div>
      </div>
    </div>

    <!--  Delete pop=up  -->
    <Dialog v-model:visible="deleteBookDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem"/>
        <span v-if="tBook">Are you sure you want to delete <b>{{ tBook.title }}</b>?</span>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteBookDialog = false"/>
        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteBook"/>
      </template>
    </Dialog>

    <!--    Update pop-up-->
    <Dialog v-model:visible="updateDialog" :closeOnEscape="true" :dismissableMask="true" :style="{width: '450px'}"
            header="Book Details" :modal="true"
            class="p-fluid">
      <img src="https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png" alt="yes" class="product-image"/>
      <!-- title -->
      <div class="p-field">
        <label for="title">Title</label>
        <InputText id="title" v-model="tBook.title" required="true" autofocus
                   :class="{'p-invalid': submitted && !tBook.title}"/>
        <small class="p-error" v-if="submitted && !tBook.title">Title is required.</small>
      </div>

      <!-- author -->
      <div class="p-field">
        <label for="author">Author</label>
        <InputText id="author" v-model="tBook.author" required="true" autofocus
                   :class="{'p-invalid': submitted && !tBook.author}"/>
        <small class="p-error" v-if="submitted && !tBook.author">Author is required.</small>
      </div>

      <div class="p-field">
        <label for="bookCategory" class="p-mb-3">Category</label>
        <Dropdown id="bookCategory" v-model="tBook.category" :showClear="true" :editable="true" :options="categories"
                  optionLabel="category" optionValue="value"
                  placeholder="Select a category">
        </Dropdown>
      </div>

      <div class="p-field">
        <label for="description">Description</label>
        <Textarea id="description" v-model="tBook.description" required="true" rows="7" cols="20"/>
      </div>

      <template #footer>
        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog('update')"/>
        <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveBook"/>
      </template>
    </Dialog>

    <!--    Add pop-up-->
    <Dialog v-model:visible="createDialog" :closeOnEscape="true" :dismissableMask="true" :style="{width: '450px'}"
            header="Add new book" :modal="true"
            class="p-fluid">
      <img src="https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png" alt="yes" class="product-image"/>
      <!-- title -->
      <div class="p-field">
        <label for="title">Title</label>
        <InputText id="cTitle" v-model="tBook.title" required="true" autofocus
                   :class="{'p-invalid': submitted && !tBook.title}"/>
        <small class="p-error" v-if="submitted && !tBook.title">Title is required.</small>
      </div>

      <!-- author -->
      <div class="p-field">
        <label for="author">Author</label>
        <InputText id="cAuthor" v-model="tBook.author" required="true" autofocus
                   :class="{'p-invalid': submitted && !tBook.author}"/>
        <small class="p-error" v-if="submitted && !tBook.author">Author is required.</small>
      </div>

      <div class="p-field">
        <label for="bookCategory" class="p-mb-3">Category</label>
        <Dropdown id="cBookCategory" v-model="tBook.category" :showClear="true" :editable="true" :options="categories"
                  optionLabel="category" optionValue="value"
                  placeholder="Select a category">
        </Dropdown>
      </div>

      <div class="p-field">
        <label for="description">Description</label>
        <Textarea id="cDescription" v-model="tBook.description" required="true" rows="7" cols="20"/>
      </div>

      <template #footer>
        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog('create')"/>
        <Button label="Save" icon="pi pi-check" class="p-button-text" @click="createBook"/>
      </template>
    </Dialog>

    <toast/>

  </div>
</template>

<script>

import Card from 'primevue/card';
import Rating from 'primevue/rating';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Chip from 'primevue/components/chip/Chip';
import Textarea from 'primevue/textarea';
import Dropdown from 'primevue/components/dropdown/dropdown.common'
import Toast from 'primevue/toast';
import Toolbar from 'primevue/toolbar';


export default {
  data() {
    return {
      tBook: null,
      bookCopy: null,
      buffer: null,
      message: null,
      text: null,
      deleteBookDialog: false, //used for delete pop-up
      submitted: false,
      categories: [],

      updateDialog: false,
      createDialog: false,
      filters: {},

      searchOption: null,
      searchOptions: [
        {
          searchOption: 'Title',
          value: 'title'
        },
        {
          searchOption: 'Author',
          value: 'author'
        }
      ],
      qFilter: null,
    }
  },
  methods: {
    /**
     * Search
     */
    setQFilter() {
    },
    sendRequest() {
      this.$store.dispatch('searchBooks');
    },
    sendQRequest() {
      console.log('request sent on blur' + this.qFilter);
    },


    /**
     * Rating
     */
    setStars(book) {
      let payload = {
        _id: book._id,
        bookObject: {
          stars: book.stars
        }
      }

      this.$store.dispatch('updateBook', payload).then(() => {
        this.$store.dispatch('loadBooks');
      });
    },
    dislikeBook(book) {
      let payload = {
        _id: book._id,
        bookObject: {}
      }
      if (book.rate === 'neutral' || book.rate === 'like') {
        payload.bookObject = {
          rate: 'dislike'
        }

      } else if (book.rate === 'dislike') {
        payload.bookObject = {
          rate: 'neutral'
        }
      }

      this.$store.dispatch('updateBook', payload).then(() => {
        this.$store.dispatch('loadBooks');
      });
    },
    likeBook(book) {
      let payload = {
        _id: book._id,
        bookObject: {}
      }
      if (book.rate === 'neutral' || book.rate === 'dislike') {
        payload.bookObject = {
          rate: 'like'
        }

      } else if (book.rate === 'like') {
        payload.bookObject = {
          rate: 'neutral'
        }
      }

      this.$store.dispatch('updateBook', payload).then(() => {
        this.$store.dispatch('loadBooks');
      });
    },

    /**
     ****************** CRUD **********************
     */

    /**
     * Create
     */

    createBook() {
      const newBook = this.deleteEmptyProperties(this.tBook);
      if (newBook && Object.keys(newBook).length === 0 && newBook.constructor === Object) {
        this.$toast.add({severity: 'warn', summary: 'Empty', detail: 'Complete book data', life: 3000});
      } else {
        this.$store.dispatch('addBook', newBook).then(() => {
          this.$store.dispatch('loadBooks');
          this.$toast.add({severity: 'success', summary: 'Success', detail: 'Book added', life: 3000});
          this.createDialog = false;
        }).catch((error) => {
          console.log(error);
        })
      }
    },


    /**
     * Update
     */
    updateBook(payload) {
      this.$store.dispatch('updateBook', payload).then(() => {
        this.$store.dispatch('loadBooks');
        // this.$store.dispatch('updateDialog', false);
        this.updateDialog = false;
        this.$toast.add({severity: 'success', summary: 'Successful', detail: 'Book updated ', life: 3000});
      }).catch(() => {
        this.$toast.add({severity: 'error', summary: 'Error', detail: 'Book could not be updated ', life: 3000});
      });
    },


    /**
     * Delete
     */
    deleteBook() {
      this.$store.dispatch('deleteBook', this.tBook._id).then(() => {
        this.deleteBookDialog = false;
        this.$toast.add({severity: 'success', summary: 'Successful', detail: 'Book deleted ', life: 3000});
        this.tBook = null;
        this.$store.dispatch('loadBooks');
      }).catch(() => {
        this.$toast.add({severity: 'error', summary: 'Error', detail: 'Book could not be deleted', life: 3000});
      });
    },


    openCreateBookForm() {


      this.tBook = {
        title: null,
        author: null,
        description: null,
        category: null,
      }
      this.categories = this.buildCategories();

      this.createDialog = true;

    },
    //makes two copies of selected book and show update dialog
    prepareBookToUpdate(book) {
      this.tBook = JSON.parse(JSON.stringify(book));
      this.bookCopy = JSON.parse(JSON.stringify(book));
      this.categories = this.buildCategories();

      // this.$store.dispatch('updateDialog', true);
      this.updateDialog = true;
    },

    saveBook() {
      this.submitted = true;

      //build book object to update
      const updatedBook = {
        title: this.compareValues(this.tBook.title, this.bookCopy.title),
        author: this.compareValues(this.tBook.author, this.bookCopy.author),
        description: this.compareValues(this.tBook.description, this.bookCopy.description),
        category: this.compareValues(this.tBook.category, this.bookCopy.category),
        rate: this.compareValues(this.tBook.rate, this.bookCopy.rate),
        stars: this.compareValues(this.tBook.stars, this.bookCopy.stars),
      }

      //delete empty properties
      let bookObject = this.deleteEmptyProperties(updatedBook);

      //create payload (book object + id)

      const payload = {
        _id: this.tBook._id,
        bookObject
      }

      //check if there is something to update
      if (bookObject && Object.keys(bookObject).length === 0 && bookObject.constructor === Object) {
        this.$toast.add({severity: 'warn', summary: 'Same values', detail: 'Book not updated', life: 3000});
      } else {
        this.updateBook(payload);
      }
    },
    confirmRemoveBook(book) {
      this.tBook = book;
      this.deleteBookDialog = true;
    },
    hideDialog(dialog) {
      // this.$store.dispatch('updateDialog', false);
      if (dialog === 'update')
        this.updateDialog = false;
      else if (dialog === 'create')
        this.createDialog = false;

      this.submitted = false;
    },
    buildCategories() {
      let buffer = [];
      let categories = [];
      let category = null;

      this.books.forEach((book) => {
        category = book.category.toLowerCase();
        if (!buffer.includes(category)) {
          buffer.push(category);

          categories.push({
            category: category,
            value: category
          });


        }
      });
      return categories;
    },
    compareValues(first, second) {
      if (first !== second)
        if (first !== ', ')
          return first;
      return null;
    },
    deleteEmptyProperties(object) {
      for (let property in object) {
        if (object[property] === null || object[property] === undefined || object[property] === '') {
          delete object[property];
        }
      }
      return object;
    },
  },
  computed: {
    books() {
      return this.$store.getters.books;
    },

    /* updateDialog() {
       return this.$store.getters.updateDialog;
     },*/

  },
  components: {
    Toolbar,
    Card,
    Rating,
    Button,
    Dialog,
    Chip,
    Textarea,
    Dropdown,
    Toast
  },
  mounted() {
    this.$store.dispatch('loadBooks');
  }
}
</script>

<style scoped>
.product-image {
  width: 50px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}

.p-dialog .product-image {
  width: 125px;
  margin: 0 auto 2rem auto;
  display: block;
}


.rate {
  color: #2196F3;
}

.rate-button:hover {
  color: #FFE082;
  cursor: pointer;
  font-size: 22px;
}

.confirmation-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 60%;
  margin: 0 auto;
}

.text {
  font-size: 18px;
}

.app-container {
  text-align: center;
}

body #app .p-button {
  margin-left: .2em;
}

form {
  margin-top: 2em;
}

p {
  line-height: 1.5;
  margin: 0;
}
</style>