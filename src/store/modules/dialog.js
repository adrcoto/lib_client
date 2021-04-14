const state = {
    updateDialog: false,
};

const mutations = {
    updateDialog(state, payload) {
        state.updateDialog = payload;
    },
};

const getters = {
    updateDialog: state => {
        return state.updateDialog;
    },
};

const actions = {
    updateDialog: ({commit}, payload) => {
        commit('updateDialog', payload);
    },
};

export default {
    state,
    getters,
    mutations,
    actions,
};