<template>
    <div class="main">
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
                        <span v-if="cell.getValue() === 0">0</span>
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
import Cell from '../model/Cell'

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
    let session = sessionStorage.getItem('GAME_SESS_ID')
    if (session) {
      let rows = JSON.parse(session)
      rows.forEach((row, rowIndex) => {
        row.forEach((cell, cellIndex) => {
          rows[rowIndex][cellIndex] = new Cell(cell.value)
        })
      })
      Game.restoreGame(rows)
    }
    Game.onModelUpdate((model) => {
      this.field = model
      sessionStorage.setItem('GAME_SESS_ID', JSON.stringify(model.getRows()))
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

      if (cell.getValue() === 0) {
        result += ' bg_black'
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

        &.bg_black {
            background: cadetblue;
            color: cadetblue;
        }
    }
</style>
