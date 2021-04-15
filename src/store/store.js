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
        // eslint-disable-next-line no-empty-pattern
        loadBooks({commit}) {
            axios.get('/books').then(res => {
                if (res.data) {
                    const books = res.data;
                    commit('setBooks', books);
                }
            });
        },

        // eslint-disable-next-line no-empty-pattern
        preLoadBooks({}) {
            return axios.get('/books');
        },
        /**
         * Add book
         * @param payload
         * @returns {Promise<AxiosResponse<any>>}
         */
        // eslint-disable-next-line no-empty-pattern
        addBook({}, payload) {
            return axios.post('/books', payload);
        },

        /**
         * Update book
         * @param payload
         * @returns {Promise<AxiosResponse<any>>}
         */
        // eslint-disable-next-line no-empty-pattern
        updateBook({}, payload) {
            return axios.patch('/books/' + payload._id, payload.bookObject);
        },

        /**
         * Delete book
         * @param id
         * @returns {Promise<AxiosResponse<any>>}
         */
        // eslint-disable-next-line no-empty-pattern
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