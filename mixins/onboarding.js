import { get } from "axios";
import { countries } from "./countries";

export default {
  methods: {
    countryByCode(code) {
      if (this.countries.length < 1) return {};
      const country = this.countries.find(
        (country) => country.alpha2Code == code
      );
      return country || {};
    },
    async getCountries(callBack = () => { }) {
      this.countries = this.$store.state.onboarding.countries;
      if (this.countries.length > 0) {
        callBack();
        return true;
      }

      try {
        // const countries = (await get("https://restcountries.eu/rest/v2/all"))
        //   .data;
        this.$store.commit("onboarding/setCountries", countries);
        this.countries = this.$store.state.onboarding.countries;
        callBack();
      } catch (error) {
        console.log(error);
      }
    },
    async getIndustries(callBack = () => { }) {
      this.industries = this.$store.state.onboarding.industries;
      if (this.industries.length > 0) {
        callBack();
        return true;
      }
      try {
        const industries = (await this.$axios.get("industries")).data.data;
        this.$store.commit("onboarding/setIndustries", industries);
        this.industries = this.$store.state.onboarding.industries;
        callBack();
      } catch (error) {
        console.log(error);
      }
    },
    async getOrganizationTypes(callBack = () => { }) {
      this.organizationTypes = this.$store.state.onboarding.organizationTypes;
      if (this.organizationTypes.length > 0) {
        callBack();
        return true;
      }
      try {
        const organizationTypes = (await this.$axios.get("organization-types"))
          .data.data;
        this.$store.commit(
          "onboarding/setOrganizationTypes",
          organizationTypes
        );
        this.organizationTypes = this.$store.state.onboarding.organizationTypes;
      } catch (error) {
        console.log(error);
      }
    },
    async getRoles({ byOrganizationIds = [] }) {
      this.rolesLoading = true;
      this.roles = this.$store.state.onboarding.roles;
      if (this.roles.length > 0) {
        this.rolesLoading = false;
        return this.roles;
      }

      try {
        const roles = (
          await this.$axios.get("roles", {
            params: { associationCounts: ["users"], byOrganizationIds }
          })
        ).data.data;

        const filteredRoles = [];
        const uniqueNames = new Map();


        for (const obj of roles) {
          const userCount = obj.__meta__.users_count;
          const name = obj.name.trim();

          if (uniqueNames.has(name)) {
            uniqueNames.get(name).__meta__.users_count += userCount;
          } else {
            uniqueNames.set(name, obj);
            filteredRoles.push(obj);
          }
        }
        // arr1.map(obj => arr2.find(o => o.id === obj.id) || obj);
        // for (const obj of roles) {
        //   const userCount = obj.__meta__.users_count;
        //   const name = obj.name.trim();

        //   if (uniqueNames.has(name)) {
        //     const existingRole = uniqueNames.
        //     existingRole.__meta__.users_count += userCount;
        //   } else {
        //     uniqueNames.add(name);
        //     filteredRoles.push(obj);
        //   }
        //   // if (uniqueNames.has(name) && userCount > 0) {
        //   //   obj.name, "OBJ");
        //   // }
        // }

        this.$store.commit("onboarding/setRoles", filteredRoles);
        this.roles = this.$store.state.onboarding.roles;

        this.rolesLoading = false;
        return this.roles;
      } catch (error) {
        console.log(error);
      }
    },
    async getStates() {
      const countries = (await get("/countries.json")).data;
      const states = (await get("/states.json")).data;

      this.states = states.map((state) => {
        const country =
          countries.find((country) => country.country_id == state.country_id) ||
          {};
        state.country_code = country.iso_code;
        return state;
      });
    }
  }
};
