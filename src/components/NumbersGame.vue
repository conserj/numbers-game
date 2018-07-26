<template>
    <div class="main">
        <el-button-group>
          <el-button type="primary" @click="generatePlayground" icon="el-icon-circle-plus">Generate</el-button>
          <el-button type="warning" @click="help" icon="el-icon-question">Help</el-button>
        </el-button-group>
        <el-card class="box-card">
            <el-row v-for="(row, rowIndex) in field.rows" :key="'row_' + rowIndex">
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
                        <span v-if="cell.getValue() === 0"></span>
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
  watch: {
    field: (playground) => {
      playground.getRows().forEach((row) => {
        row.forEach((cell) => {
          if (cell.isInvalidSelected()) {
            setTimeout(() => {
              cell.setInvalidSelected(false)
            }, 2000)
          }
        })
      })
    }
  },
  mounted () {
    this.field = Game.getModel()
    let session = sessionStorage.getItem('GAME_SESS')
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
      this.field = []
      this.field = model
      sessionStorage.setItem('GAME_SESS', JSON.stringify(model.getRows()))
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

      if (cell.isInvalidSelected()) {
        result += ' error'
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
    },
    help () {
      Game.help()
    }
  }
}
</script>

<style scoped lang="scss">
    @keyframes pulse-green {
        0%, 100% {
            background-color: #67c23a91;
        }
        50% {
            background-color: #67c23a2b;
        }
    }
    @keyframes pulse-red {
        0%, 100% {
            background-color: #f56c6c82;
        }
        50% {
            background-color: #f56c6c47;
        }
    }
    .cell {
      width: 40px !important;
      height: 40px;
      margin: 2px;
    }
    .tail {
        border: 1px solid #DCDFE6;
        border-radius: 15%;
        text-align: center;
        font-size: 14px;
        display: block;
        background: #fff;
        color: #303133;
        width: 100%;
        height: 100%;
        line-height: 3;
        cursor: pointer;

        &.selected {
            animation:
                pulse-green 2s ease infinite alternate,
                nudge 4s linear infinite alternate;
        }

        &.bg_black {
            cursor: default;
            background: repeating-linear-gradient(
                45deg,
                rgba(255, 255, 255, 0.6),
                rgba(255, 255, 255, 0.6),
                rgba(255, 255, 255, 0.6),
                rgba(0, 0, 0, 1) 7px
            )
        }

        &.error {
            animation:
                pulse-red 2s ease infinite alternate,
                nudge 4s linear infinite alternate;
        }
    }
</style>
