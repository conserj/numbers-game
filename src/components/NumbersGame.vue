<template>
    <el-card class="box-card">
        <div class="buttons">
            <el-button-group>
                <el-tooltip class="item" effect="dark" content="Generate" placement="top-start">
                    <el-button @click="generatePlayground" icon="el-icon-circle-plus"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="Undo" placement="top-start">
                    <el-button @click="undo" icon="el-icon-back"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="Help" placement="top-start">
                    <el-button @click="help" icon="el-icon-question"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="Clear" placement="top-start">
                    <el-button @click="clear" icon="el-icon-delete"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="Restart" placement="top-start">
                    <el-button @click="restart" icon="el-icon-refresh"></el-button>
                </el-tooltip>
            </el-button-group>
        </div>
        <div class="playground">
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
        </div>
    </el-card>
</template>

<script>
import _ from 'lodash'
import Game from '../runner'
import PlaygroundCellCombo from '../model/PlaygroundCellCombo'

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
          if (cell.getState() !== 0) {
            setTimeout(() => {
              cell.setState(0)
            }, 350)
          }
        })
      })
    }
  },
  mounted () {
    this.field = Game.getModel()
    Game.run()
    Game.onModelUpdate((model) => {
      this.field = []
      this.field = model
      Game.save()
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

      if (cell.getState() === -1) {
        result += ' error'
      }

      if (cell.getValue() === 0) {
        result += ' bg_black'
      }

      if (cell.getState() === 1) {
        result += ' selected'
      }

      return result
    },
    setChecked (cell) {
      if (cell.getValue() === 0) {
        return
      }
      this.addSelectedPoint(cell)
      if (_.keys(this.selectedCells).length === 2) {
        this.notifySelectedPair(_.clone(this.selectedCells))
        this.selectedCells = []
      }
    },
    notifySelectedPair (pair) {
      let combo = new PlaygroundCellCombo(pair.shift(), pair.pop())
      Game.comboSelected(combo)
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
      if (!Game.help()) {
        this.$message({
          title: 'Halt!',
          message: 'No more combinations left. Press "Generate"',
          type: 'warning'
        })
      }
    },
    restart () {
      this.$confirm('Are you sure you want to start a new game? All progress will be lost. Continue?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        Game.restart()
      })
    },
    clear () {
      Game.clear()
    },
    undo () {
      Game.undo()
    }
  }
}
</script>

<style scoped lang="scss">
    .buttons {
        margin-bottom: 20px;
    }

    .playground {
        overflow-y: auto;
        max-height: 800px;
    }

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
            color: #409EFF;
            border-color: #c6e2ff;
            background-color: #ecf5ff;
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
            color: #ff404094;
            border-color: rgba(222, 86, 86, 0.53);
            background-color: #f7282814;
        }
    }
</style>
