<template>
    <el-row>
        <numbers-game></numbers-game>
    </el-row>
</template>

<script>

import NumbersGame from './NumbersGame'

export default {
  name: 'IndexPage',
  components: {
    NumbersGame
  },
  data () {
    return {

    }
  }
}
</script>

<style scoped>

</style>
