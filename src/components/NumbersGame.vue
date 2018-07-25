<template>
    <div class="main">
        <el-button-group>
          <el-button type="primary" @click="generatePlayground" icon="el-icon-circle-plus">Generate</el-button>
          <el-button type="warning" @click="generatePlayground" icon="el-icon-question">Help</el-button>
        </el-button-group>
        <el-card class="box-card">
            <el-row v-for="(row, rowIndex) in field.rows" :key="'row_' + rowIndex" :span="2">
                <el-col
                    :span="1"
                    v-for="(cell, cellIndex) in row"
                    :key="'cell_' + cellIndex + '_' + rowIndex"
                    class="cell"
                >
                    <div
                        @click="setChecked(cell)"
                        :class="cellClass(cell)"
                        class="center"
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
    Game.onSelectFail((pair) => {
      console.log(pair)
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
    .cell {
      width: 40px !important;
      height: 40px;
      margin: 2px;
    }
    .tail {
        border-radius: 15%;
        text-align: center;
        font-size: 14px;
        display: block;
        background: #409EFF;
        color: #fff;
        width: 100%;
        height: 100%;
        line-height: 3;

        &.selected {
            background: #E6A23C;
        }

        &.bg_black {
            background: #909399;
            color: #909399;
        }
    }
</style>
