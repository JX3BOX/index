// import dayjs from "dayjs";
const getters = {
    // ai
    loading: (state) => {
        return state.ai.loading;
    },
    isDeepChecked: (state) => {
        return state.ai.isDeepChecked;
    },
    isPlaying: (state) => {
        return state.ai.isPlaying;
    },
    isStreamLoad: (state) => {
        return state.ai.isStreamLoad;
    },
    isRecording: (state) => {
        return state.ai.isRecording;
    },
    pageLoading: (state) => {
        return state.ai.pageLoading;
    },
    inputValue: (state) => {
        return state.ai.inputValue;
    },
    db: (state) => {
        return state.ai.db;
    },
};

export default getters;
