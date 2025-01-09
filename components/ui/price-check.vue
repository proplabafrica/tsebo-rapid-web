<template>
  <div class="container">
    <div class="wrapper">
      <div class="img-container" v-if="!showPriceBox" @click.prevent="openPriceBox">
        <div class="image-cover" />
        <div class="image-cover-center" />
      </div>
      <span class="close" @click.prevent="openPriceBox" v-if="showPriceBox">x</span>
      <form class="price-box-container" v-if="showPriceBox" @submit.prevent="getSuggestedMaterials">
        <img src="/img/hagul.jpg" class="h-logo" />

        <div class="price-box">
          <div :style="{ display: 'flex' }" v-if="item == null">
            <div class="chat-logo">H</div>
            <div class="chat-box">
              <p>
                Hello! <br />
                Ask hagul for material price
              </p>
            </div>
          </div>

          <div v-if="showItemPrice">
            <div :style="{ display: 'flex' }">
              <div class="chat-logo">H</div>
              <div class="chat-box" v-if="item">
                <p>
                  <span>The average price for <span style="font-weight: 700;">{{ item.name }}</span> is
                    {{ { value: item.price } | toMoney }} naira as at:
                    {{ formatDate(item.created_at) }}
                  </span>
                </p>
              </div>
            </div>
            <div>
              <div class="chat-box" v-if="item" style="margin-left: 30px; margin-top: 10px;">
                <p style="margin-bottom: 10px;">
                  <span>Suggested Vendor: {{ item.vendor_name }}
                  </span>
                </p>
                <p>
                  <span style="text-decoration: underline; font-weight: 500;">Contact:
                  </span>
                  <span v-if="item.vendor_email" style="display: block;">
                    Email: {{ item.vendor_email }}
                  </span>
                  <span style="display: block;">
                    Phone: {{ item.vendor_phone }}
                  </span>
                </p>
              </div>
            </div>

          </div>
        </div>
        <div class="input-container">

          <input type="text" autocomplete="hello" placeholder="type here" v-model="search" />

          <div class="loader" v-if="searching">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <button v-else class="send-icon-btn">
            <img src="/img/hagul-send.png" class="send-icon" />
          </button>

        </div>
        <!-- <input v-if="loading" type="text" autocomplete="hello" placeholder="loading, please wait..." disabled
          v-model="search" /> -->
      </form>


      <div class="suggestions" v-if="materials.length > 0 && showPriceBox">
        <div class="suggestion" v-for="item in materials" :key="item.id" v-on:click="showPrice(item)">
          {{ ellipse(item.name, 50) }}
        </div>
      </div>

      <div class="suggestions" v-else-if="!materials.length && !searching && searched && showPriceBox">
        <div class="suggestion" style="border-bottom-width: 0px;">
          <span>No Record Found</span>

        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data: () => ({
    showPriceBox: false,
    searching: false,
    item: null,
    materials: [],
    search: "",
    showItemPrice: false,
    loading: false,
    searched: false,
  }),


  methods: {
    formatDate(value) {
      const dateArr = value?.replace('T', ' ')?.split(' ')[0]?.split('-')
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];

      if (dateArr?.length) {
        return `${months[parseInt(dateArr[1]) - 1]} ${dateArr[2]}, ${dateArr[0]}`

      }

    },
    openPriceBox() {
      this.showPriceBox = !this.showPriceBox;

      if (this.showPriceBox == false) {
        this.search = "";
      }
    },
    showPrice(item) {
      this.showItemPrice = true;
      this.item = item;
      this.search = "";
      this.materials = []
      this.searching = false
      // console.log(item.name, item.cost);
    },
    async getSuggestedMaterials(e) {
      e.preventDefault();

      if (this.search) {
        this.searched = true

        this.searching = true

        try {
          const response = await this.$axios.get(`https://apiv1.vampfi.com/hagul-bot/items?search=${this.search}`)
          const data = response.data.data

          const materials = data;


          console.log(data, "DAAATTTTAAA")
          console.log(materials, "MATERIALS")


          const transformedData = [];

          materials.forEach((group) => {
            transformedData.push({
              name: group.name,
              price: group.price,
              vendor_name: group.vendor_name,
              vendor_phone: group.vendor_phone,
              vendor_email: group.vendor_email,
              created_at: group.created_at
            });
          });


          transformedData.sort((a, b) => a.name.localeCompare(b.name));



          this.materials = transformedData.filter((value, index, self) =>
            index === self.findIndex((t) => (
              t.name.toLowerCase() === value.name.toLowerCase() && t.vendor_name.toLowerCase() === value.vendor_name.toLowerCase()
            ))
          );


          console.log(
            this.materials, "MATERIALSSSSS"
          )

          if (this.materials.length) {
            this.searched = false
          }

          this.searching = false
        } catch (error) {
          console.log(error)
          this.searching = false
        }

      } else {
        this.searching = false
      }

    },

  },

  watch: {
    // search(search) {
    //   if (search) {
    //     this.searching = true

    //   }
    //   this.debounce(() => {
    //     this.getSuggestedMaterials()
    //   }, 300);
    // }
  },
};
</script>

<style scoped>
.h-logo {
  width: 80px;
  height: auto;
  cursor: pointer;

  margin-bottom: 5px;
}

.img-container {
  width: 61px;
  height: 61px;
  display: flex;
  cursor: pointer;
  border-top-left-radius: 34px;
  border-top-right-radius: 7px;
  border-bottom-left-radius: 34px;
  border-bottom-right-radius: 34px;
  position: relative;
  justify-content: center;
  align-items: center;
  box-shadow: -9px 10px 5px -5px rgba(95, 91, 91, 0.75);
  -webkit-box-shadow: -9px 10px 5px -5px rgba(95, 91, 91, 0.75);
  -moz-box-shadow: -9px 10px 5px -5px rgba(95, 91, 91, 0.75);
}


.image-cover-center {
  position: absolute;
  height: 23px;
  width: 27px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  background-color: #a1a1a1;
}

.image-cover {
  position: absolute;
  width: 65px;
  height: 65px;
  border-top-left-radius: 30px;
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
  border-top-right-radius: 3px;
  background-color: #c00000;
}

.close {
  color: #c00000;
  position: absolute;
  right: 25px;
  top: 10px;
  z-index: 150;
  position: absolute;
}

.close:hover {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background-color: #c000005b;
  display: flex;
  align-items: center;
  justify-content: center;
}


.price-box-container {
  height: 470px;
  width: 400px;
  background-color: rgb(228, 224, 224);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 30px;

  border-radius: 10px;

  box-shadow: -9px 10px 5px -5px rgba(187, 187, 187, 0.75);
  -webkit-box-shadow: -9px 10px 5px -5px rgba(187, 187, 187, 0.75);
  -moz-box-shadow: -9px 10px 5px -5px rgba(187, 187, 187, 0.75);
}

.price-box {
  min-height: 330px;
  border-radius: 10px;
  width: 96%;
  background-color: white;
  padding: 10px;
  position: relative;
  z-index: 20;
  /* display: flex; */
}


@media (max-width: 640px) {
  .price-box-container {
    width: 90vw;
  }

  .suggestions {
    width: 90vw;
  }
}

.chat-logo {
  height: 20px;
  width: 20px;
  border-radius: 10px;
  background-color: #c00000;
  color: #c6c6c9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 800;
  margin-right: 5px;
}

.chat-box {
  min-height: 60px;
  background-color: rgb(230, 230, 230);
  width: 80%;
  padding: 8px;
  padding-top: 10px;
  /* border-top-left-radius: 10px; */
  border-top-right-radius: 15px;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
}

.input-container {
  margin-top: 20px;
  display: flex;
  align-items: center;
  width: 96%;
  padding: 3px 10px;
  background-color: #fff;
  overflow: hidden;
  border-radius: 5px;
  margin-bottom: 5px;
}

input {
  width: 96%;
  border: none;
  padding: 3px;
  border-bottom-right-radius: 2px;
  border-bottom-left-radius: 2px;
  height: 40px;

}

.send-icon {
  cursor: pointer;
  max-height: 30px;
  object-fit: contain;
}

.send-icon-btn {
  background-color: transparent;
  border: none
}

.send-icon-btn:focus {
  outline: none;
}

input:focus {
  outline: none;
}


.suggestions {
  /* margin-top: 10px; */
  /* width: 100%; */
  width: 400px;
  min-height: 50px;
  max-height: 100px;
  border-radius: 5px;
  padding-top: 20px;
  z-index: 2;
  margin-left: 5px;
  overflow-y: scroll;
  background-color: rgb(240, 240, 240);

  box-shadow: -9px 10px 5px -5px rgba(187, 187, 187, 0.75);
  -webkit-box-shadow: -9px 10px 5px -5px rgba(187, 187, 187, 0.75);
  -moz-box-shadow: -9px 10px 5px -5px rgba(187, 187, 187, 0.75);
}

.suggestion {
  cursor: pointer;
  padding-bottom: 10px;
  border-bottom: 2px solid rgb(209, 209, 209);
  background-color: rgb(240, 240, 240);
  height: 25px;
  padding: 5px;
  width: 98%;
}



/* LOADER */
.loader {
  display: inline-block;
  position: relative;
  width: 50px;
  height: 40px;
}


.loader div {
  position: absolute;
  top: 45%;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #c00000;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}

.loader div:nth-child(1) {
  left: 6px;
  animation: loader1 0.6s infinite;
}

.loader div:nth-child(2) {
  left: 6px;
  animation: loader2 0.6s infinite;
}

.loader div:nth-child(3) {
  left: 20px;
  animation: loader2 0.6s infinite;
}

.loader div:nth-child(4) {
  left: 40px;
  animation: loader3 0.6s infinite;
}

@keyframes loader1 {
  0% {
    transform: scale(0);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes loader3 {
  0% {
    transform: scale(1);
  }

  100% {
    transform: scale(0);
  }
}

@keyframes loader2 {
  0% {
    transform: translate(0, 0);
  }

  100% {
    transform: translate(19px, 0);
  }
}
</style>
