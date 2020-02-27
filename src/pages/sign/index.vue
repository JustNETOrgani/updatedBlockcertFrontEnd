<template>
  <div id="pageContainer">
    <div id="headerSection">
      <Head :menuList="menuList"/>
    </div>
    <div id="msgArea">
      <p id="welcomeMsg">Welcome to Student Registration</p>
      <hr id="hrBar">
    </div>
    <div id="middlePage">
      <div id="formArea_left">
        <p id="instruction">
          Please, fill the form below.
        </p>
        <!--Form to be filled-->
        <b-container class="formContainer">
          <b-row>
            <b-col sm="5" offset="4">
              <b-form @submit="onSubmit" @reset="onReset" v-if="show">
                <b-form-group
                  id="input-group-1"
                  label="First name:"
                  label-for="input-1"
                >
                  <b-form-input
                    id="input-1"
                    v-model="form.fname"
                    type="text"
                    required
                    placeholder="Please, enter your first name here."
                  ></b-form-input>
                </b-form-group>

                <b-form-group
                  id="input-group-2"
                  label="Last name:"
                  label-for="input-2"
                >
                  <b-form-input
                    id="input-2"
                    v-model="form.lname"
                    type="email"
                    required
                    placeholder="Please, enter your last name."
                  ></b-form-input>
                </b-form-group>

                <b-form-group
                  id="input-group-3"
                  label="Email address:"
                  label-for="input-3"
                  description="Your e-mail address will never be shared with anyone else."
                >
                  <b-form-input
                    id="input-3"
                    v-model="form.email"
                    type="email"
                    required
                    placeholder="Please, enter your e-mail address."
                  ></b-form-input>
                </b-form-group>

                <b-form-group id="input-group-4" label="Student ID:" label-for="input-4">
                  <b-form-input
                    id="input-4"
                    v-model="form.stdID"
                    required
                    placeholder="Please, enter your student ID"
                  ></b-form-input>
                </b-form-group>
                
                <b-form-group id="chainChoiceSelection" label="Blockchain address choice:">
                <b-form-radio v-model="form.radio" name="some-radios" value="Existing address">Use existing blockchain address</b-form-radio>
                <b-form-radio v-model="form.radio" name="some-radios" value="Create new address">Create new blockchain address</b-form-radio>
                </b-form-group>
          
                <b-form-group id="input-group-5" label="Blockchain address:" label-for="input-5">
                  <b-form-input
                    id="input-5"
                    v-model="form.bAddress"
                    required
                    placeholder="Please, enter your blockchain address"
                  ></b-form-input>
                </b-form-group>

                <b-button class="myBtn" type="reset" variant="danger">Reset</b-button>
                <b-button class="myBtn" type="submit" variant="success" href="#">Register</b-button>
            </b-form>
          </b-col>
        </b-row>
      </b-container>
    </div>

    <div id="formArea_right" v-show=" form.radio === 'Create new address'">
      <p id="addressChoiceInstruction">
        Want to create a new blockchain identity?
      </p>
      <p><u>Please, select your preferred blockchain platform.</u></p>

      <div class="chainChoice">
        <img class="chainImage" src="../../assets/img/bitcoin.png"/>
        <b-link id="createBitcoinAdd" href="https://www.bitaddress.org/" target="_blank">Create new Bitcoin address</b-link>
      </div>

      <div class="chainChoice">
        <img class="chainImage" src="../../assets/img/ethereum.png"/>
        <b-link id="createEthAddress" href="https://www.myetherwallet.com/" target="_blank">Create new Ethereum address</b-link>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import Head from "@/components/header";

export default {
  name: "sign", 

  data() {
      return {
        form: {
          fname: '',
          lname: '',
          email: '',
          stdID: '',
          bAddress: '',
          radio:''
        },
        show: true,
        menuList: [
        { name: "Login", path: "/login" },
        { name: "Home", path: "/home" }
      ],
      }
    },
    components: {
      Head
  },
    methods: {
      onSubmit() {
        
      },
      onReset(evt) {
        evt.preventDefault()
        // Reset all form values
        this.form.fname = ''
        this.form.lname = ''
        this.form.email = ''
        this.form.stdID = ''
        this.form.bAddress = ''
        this.form.radio = ''
        // Reset/clear native browser form validation state.
        this.show = false
        this.$nextTick(() => {
          this.show = true
        })
      }
    }
  }

</script>

<style scoped>
#pageContainer{
  height: 100%;
  display: flex;
  flex-direction: column;
}
#msgArea{
  width: 100%;
  height: 4%;
  margin-top: -2%;
  margin-bottom: 1rem;
}
#welcomeMsg{
  color:#477ea3;
  font-size: 1.5rem;
  padding-top: 1rem;
}
#hrBar{
  border: 1.1px solid #1d98ea;
}

#instruction{
  color: #477ea3;
  font-style: italic;
}

#middlePage{
  height: 71%;
  width: 100%;
}

#formArea_left{
  height: 60%;
  width: 70%;
  float: left;
  margin-left: -10rem;
}

#chainChoiceSelection{
  color: #09375c;
}

#formArea_right{
  height: 45%;
  width: 40%;
  float: right;
  border: 1.1px dashed #1d98ea;
  margin-top: -6rem;
  margin-right: 6rem;
}

#addressChoiceInstruction{
  margin-top: 1rem;
  color: #477ea3;
  font-style: italic;
  font-weight: 100;
}
.chainChoice{
  margin:1.5rem auto;
}

.chainImage{
  width: 3rem;
  height: 3.5rem;
  margin-right: 0.5rem;
}

#createBitcoinAdd{
  font-size: 1.2rem;
  color: #4a550f;
}

#createEthAddress{
  font-size: 1.2rem;
  color: #2c546e;
}

.myBtn{
  margin-right: 1rem;
}

</style>
