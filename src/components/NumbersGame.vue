<template>
    <el-container>
        <el-header>
            <div class="buttons">
                <el-button-group>
                    <el-tooltip class="item" effect="dark" :content="$t('buttons.generate')" placement="top-start">
                        <el-button @click="generatePlayground" icon="el-icon-circle-plus"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="$t('buttons.undo')" placement="top-start">
                        <el-button @click="undo" icon="el-icon-back"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="$t('buttons.help')" placement="top-start">
                        <el-button @click="help" icon="el-icon-question"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="$t('buttons.clear')" placement="top-start">
                        <el-button @click="clear" icon="el-icon-delete"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="$t('buttons.restart')" placement="top-start">
                        <el-button @click="restart" icon="el-icon-refresh"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="$t('buttons.language')" placement="top-start">
                        <el-button>
                            <el-dropdown @command="setLocale" trigger="click">
                            <span class="el-dropdown-link">
                                <flag :iso="getFlagIso()"/>&nbsp;<i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="ua">
                                        <flag iso="ua"/>&nbsp;Українська
                                    </el-dropdown-item>
                                    <el-dropdown-item command="gb">
                                        <flag iso="gb"/>&nbsp;English
                                    </el-dropdown-item>
                                    <el-dropdown-item command="ru">
                                        <flag iso="ru"/>&nbsp;Русский
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </el-button>
                    </el-tooltip>
                </el-button-group>
            </div>
        </el-header>
        <el-main>
            <el-card class="box-card">
                <el-collapse accordion class="statistic">
                    <el-collapse-item>
                        <template slot="title" class="header">
                            {{ $t('statistic.label') }} <i class="header-icon el-icon-info"></i>
                        </template>
                        <el-row v-for="(stat, statIdx) in statistics" :key="'stat_' + statIdx">
                            <el-col :span="6">
                                {{ $t('statistic.titles.' + stat.getStatName()) }}
                            </el-col>
                            <el-col :span="6">
                                {{ stat.getValue() || 0 }}
                            </el-col>
                        </el-row>
                    </el-collapse-item>
                </el-collapse>
                <div class="playground">
                    <el-row v-for="(row, rowIndex) in playground.rows" :key="'row_' + rowIndex">
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
        </el-main>
    </el-container>
</template>

<script>
import _ from 'lodash'
import Game from '../runner'
import PlaygroundCellCombo from '../model/PlaygroundCellCombo'

export default {
  name: 'NumbersGame',
  data () {
    return {
      playground: [],
      selectedCells: [],
      statistics: []
    }
  },
  watch: {
    playground: (playground) => {
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
    this.playground = Game.getPlayground()
    Game.run()
    Game.onModelUpdate((model) => {
      this.playground = []
      this.playground = model
      this.statistics = []
      this.statistics = Game.getStatistics().getAll()

      if (this.playground.isCompleted()) {
        this.$alert(
          this._i18n.t('endGame.message', {count: Game.gameState.getComboCount()}),
          this._i18n.t('endGame.title'),
          {
            confirmButtonText: this._i18n.t('endGame.button'),
            type: 'success',
            dangerouslyUseHTMLString: true,
            callback: action => {
              Game.restart()
            }
          }
        )
      }
    })

    this._i18n.locale = Game.getLocale()
    this.statistics = Game.getStatistics().getAll()
  },
  methods: {
    cellClass (cell) {
      let result = 'tail'

      if (_.find(this.selectedCells, (item) => {
        return item === cell
      })) {
        if (cell.getState() !== 0) {
          cell.setState(0)
        }
        result += ' selected'
      }

      if (cell.getState() === -1) {
        result += ' error'
      }

      if (cell.getValue() === 0) {
        result += ' bg_black'
      }

      if (cell.getState() === 1) {
        result += ' highlighted'
      }

      return result
    },
    setLocale (locale) {
      this._i18n.locale = locale
      Game.setLocale(locale)
    },
    getFlagIso () {
      return Game.getLocale()
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
      if (Game.hasCombinations()) {
        this.$confirm(this._i18n.t('messages.generatePlaygroundWarning'), '', {
          confirmButtonText: this._i18n.t('buttons.OK'),
          cancelButtonText: this._i18n.t('buttons.cancel'),
          type: 'warning'
        }).then(() => {
          Game.generatePlayground()
        })
      } else {
        Game.generatePlayground()
      }
    },
    help () {
      if (!Game.highlightAvailableCombo()) {
        this.$message({
          title: this._i18n.t('messages.noMoreComboTitle'),
          message: this._i18n.t('messages.noMoreComboMessage'),
          type: 'warning'
        })
      }
    },
    restart () {
      this.$confirm(this._i18n.t('messages.restartMessage'), '', {
        confirmButtonText: this._i18n.t('buttons.OK'),
        cancelButtonText: this._i18n.t('buttons.cancel'),
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
    .el-header, .el-footer {
        background-color: #B3C0D1;
        color: #333;
        text-align: center;
        line-height: 60px;
    }

    .el-main {
        background-color: #E9EEF3;
        color: #333;
        text-align: center;
        line-height: 160px;
    }

    body > .el-container {
        margin-bottom: 40px;
    }

    .buttons {
        margin-bottom: 20px;
    }

    .statistic {
        text-align: left;
    }

    .playground {
        overflow-y: auto;
        max-height: 800px;
        margin-top: 20px;
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

        &.highlighted {
            color: #b78c07;
            border-color: #fddf1fba;
            background-color: #ffe35029;
        }
    }
</style>
