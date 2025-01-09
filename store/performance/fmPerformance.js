export const state = () => ({
    performance: null
});

export const mutations = {
    setPerformance(state, newData) {

        state.performance = newData
    },

}


export const actions = {
    async getFmPerformance({ commit, state }, $this) {
        let start, end;
        start = $this.range?.start ? new Date($this.range.start).toISOString() : null;
        end = $this.range?.end ? new Date($this.range.end).toISOString() : null;

        try {
            $this.loading = true
            const response = await $this.$axios.get(`fm-performance?from=${start}&to=${end}`, { signal: $this.signal })
            commit('setPerformance', response.data.data)
            $this.performance = response.data.data

            $this.loading = false;
        } catch (error) {
            $this.loading = false;
            console.log(error)
        }
    },
    getPerformance({ state }) {
        return state.performance
    }
}
