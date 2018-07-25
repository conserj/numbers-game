<template>
    <div>
        <input v-model="name">{{fullName}}
        <p>
            <img :src="image"/>
        </p>
        <p>
            <button
                @click="loadSkills"
            >Saaaaaaaaaa</button>
        </p>
        <!--<p>-->
            <!--<ul>-->
                <!--<li-->
                    <!--v-for="skill in skills"-->
                    <!--@click="showDetails(skill)"-->
                <!--&gt;-->
                    <!--{{ skill.title }}-->
                <!--</li>-->
            <!--</ul>-->
        <!--</p>-->
    </div>
</template>
<script>
/* eslint-disable */
  export default {
      props: {
        image: {
          type: String,
          default () {
            return 'https://git.slygods.com/uploads/-/system/appearance/header_logo/1/evoplay_logo.png'
          }
        }
      },
      async mounted () {
        this.loadSkills()
      },
      data () {
        return {
          name: 'Serj',
          lastName: 'Voytov',
          skills: [

          ]
        }
      },
      computed: {
        fullName () {
          return this.name + " " + this.lastName
        }
      },
      methods: {
        showMsg() {
          alert(123)
        },
        async loadSkills() {
            let response = await this.$http.get('https://jsonplaceholder.typicode.com/todos')
            this.skills = response.body;
        },
        showDetails (skill) {
          console.log(skill)
        }
      }
    }
</script>
