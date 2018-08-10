<template>
    <el-row>
        <el-card class="box-card">
            <el-form ref="form" :model="form" label-width="120px">
                <el-form-item :label="$t('menu.languageLabel')">
                    <el-select v-model="form.language" placeholder="Select" @change="changeLocale">
                        <el-option
                            v-for="item in form.languages"
                            :key="item.value"
                            :value="item.value"
                            :label="item.label"
                        >
                            <flag :iso="item.flag" /> {{ item.label }}
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('menu.modeLabel')">
                    <el-radio-group v-model="form.mode">
                        <el-radio border label="0">1-18</el-radio>
                        <el-radio border label="1">1-19</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">
                        {{ $t('menu.saveAndPlayText') }}
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </el-row>
</template>

<script>

import ConfigStorage from '../service/ConfigStorage'

export default {
  name: 'MainMenu',
  data () {
    return {
      form: {
        mode: '0',
        languages: [
          {
            value: 'ua',
            label: 'Українська',
            flag: 'ua'
          },
          {
            value: 'en',
            label: 'English',
            flag: 'gb'
          },
          {
            value: 'ru',
            label: 'Русский',
            flag: 'ru'
          }
        ],
        language: 'en'
      }
    }
  },
  mounted () {
    this.configStorage = new ConfigStorage('GAME_CFG')
    const config = this.configStorage.get()
    this.form.language = config.lang
    this.form.mode = config.mode
    this._i18n.locale = config.lang
  },
  methods: {
    changeLocale (locale) {
      this._i18n.locale = locale
    },
    onSubmit () {
      this.configStorage.save({
        lang: this.form.language,
        mode: this.form.mode
      })
      this._routerRoot._router.push({name: 'NumbersGame'})
    }
  }
}
</script>

<style scoped>

</style>
