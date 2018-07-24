<template>
    <el-row>
        <el-row :gutter="20">
            <router-link :to="{ name: 'NumbersGame'}" tag="el-button">Play</router-link>
        </el-row>
        <el-row :gutter="20">
            <router-link :to="{ name: 'Settings'}" tag="el-button">Settings</router-link>
        </el-row>
    </el-row>
</template>

<script>
export default {
  name: 'MainMenu'
}
</script>

<style scoped>

</style>
