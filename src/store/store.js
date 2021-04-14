import {createStore} from 'vuex';

import axios from '../axios';

import updateDialog from './modules/dialog';

export default createStore({
    state: {
        books: [],
    },
    mutations: {
        setBooks(state, payload) {
            state.books = payload;
        },
    },
    getters: {
        books: state => {
            return state.books;
        },
    },
    actions: {

        /**
         * Load books
         * @param commit
         */
        loadBooks({commit}) {
            let books = [];
            axios.get('/books', {}).then(res => {
                books = res.data;
                commit('setBooks', books);
            });
        },

        /**
         * Add book
         * @param payload
         * @returns {Promise<AxiosResponse<any>>}
         */
        addBook({}, payload) {
            return axios.post('/books', payload);
        },

        /**
         * Update book
         * @param payload
         * @returns {Promise<AxiosResponse<any>>}
         */
        updateBook({}, payload) {
            return axios.patch('/books/' + payload._id, payload.bookObject);
        },

        /**
         * Delete book
         * @param id
         * @returns {Promise<AxiosResponse<any>>}
         */
        deleteBook({}, id) {
            return axios.delete('/books/' + id);
        }

    },
    mounted() {
      this.$store.dispatch('loadBooks');
    },
    modules: {
        updateDialog
    }
});