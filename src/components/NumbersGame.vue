<template>
    <div>
        <el-button @click="generatePlayground">Generate</el-button>
        <el-card class="box-card">
            <el-row v-for="(row, rowIndex) in field.rows" :key="'row_' + rowIndex">
                <el-col
                    :span="2"
                    v-for="(cell, cellIndex) in row"
                    :key="'cell_' + cellIndex + '_' + rowIndex"
                >
                    <div
                        @click="setChecked(cell)"
                        :class="cellClass(cell)"
                    >
                        <span v-if="cell.getValue() === 0"><i class="el-icon-close"></i></span>
                        <span v-else>{{ cell.getValue() }}</span>
                    </div>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script>
import _ from 'lodash'
import Game from '../runner'

export default {
  name: 'NumbersGame',
  data () {
    return {
      field: [],
      selectedCells: []
    }
  },
  mounted () {
    this.field = Game.getModel()
    Game.onModelUpdate((model) => {
      this.field = model
    })
  },
  methods: {
    cellClass (cell) {
      let result = 'tail'

      if (_.find(this.selectedCells, (item) => {
        return item === cell
      })) {
        result += ' selected'
      }

      return result
    },
    setChecked (cell) {
      this.addSelectedPoint(cell)
      if (_.keys(this.selectedCells).length === 2) {
        this.notifySelectedPair(_.clone(this.selectedCells))
        this.selectedCells = []
      }
    },
    notifySelectedPair (pair) {
      Game.pairSelected(pair)
    },
    addSelectedPoint (cell) {
      let result = _.clone(this.selectedCells)

      result.push(cell)
      this.selectedCells = result
    },
    generatePlayground () {
      Game.generatePlayground()
    }
  }
}
</script>

<style scoped lang="scss">
    .tail {
        border: 1px solid black;
        text-align: center;
        font-size: 40px;
        width: 100%;
        height: 100%;
        display: block;

        &.selected {
            background: lime;
        }
    }
</style>
