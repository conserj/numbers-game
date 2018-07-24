<template>
    <div>
        <table id="playground" border="1">
        </table>

        <el-card class="box-card">
            <el-row v-for="(row, rowIndex) in field" :key="'row_' + rowIndex">
                <el-col
                    :span="2"
                    v-for="(cell, cellIndex) in row"
                    :key="'cell_' + cellIndex + '_' + rowIndex"
                >
                    <div
                        @click="setChecked(rowIndex, cellIndex)"
                        :class="cellClass(rowIndex, cellIndex)"
                    >
                        <span v-if="cell === 0"><i class="el-icon-close"></i></span>
                        <span v-else>{{ cell }}</span>
                    </div>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script>
/* eslint-disable */
import $ from 'jquery'
import Field from '../model/Field'
import PlayGround from '../model/Game'
import Playground from '../model/Playground'
import EventBus from '../model/EventBus'
import * as Events from '../model/Events'
import _ from 'lodash'

/*

EventBus.$emit(Events.MODEL_UPDATED, eventValue);
EventBus.$on('eventName', (eventValue) => {

});


 */

  $(function () {
    window.values = [
      [1, 2, 3, 4, 5, 6, 7, 8, 9],
      [1, 1, 1, 2, 1, 3, 1, 4, 0],
      [0, 0, 6, 1, 7, 1, 8, 1, 2],
      [0, 4, 5, 6, 7, 8, 9, 1, 1],
      [1, 2, 1, 3, 1, 4, 1, 5, 1],
      [6, 1, 7, 1, 8]
    ];
    //
    // let field = new Field();
    // field.setRows(window.values);

    $.each(window.values, function (rowIndex, rowValues) {
      let $tr = $('<tr />');
      $.each(rowValues, function (index, value) {
        let $td = $('<td />');
        $td.html(value);
        $td.addClass('selectable');
        $td.attr('data-idx', rowIndex + "|" + index);
        $tr.append($td);
      });
      $('#playground').append($tr).css("font-size", "50px");
    });

    function getVal(row, col)
    {
      if (!window.values[row]) {
        return 0;
      }
      if (!window.values[row][col]) {
        return 0;
      }

      return window.values[row][col];
    };

    function Val(row, col)
    {
      this.row = row;
      this.col = col;
      this.val = getVal(row, col);
    }
    Val.prototype.getRow = function() { return parseInt(this.row); };
    Val.prototype.getCol = function() { return parseInt(this.col); };
    Val.prototype.getVal = function() { return parseInt(this.val); };

    function canNullify(a, b)
    {
      let min = a.getRow() < b.getRow() ? a : b;
      let max = a.getRow() < b.getRow() ? b : a;

      let elements = [];
      for (let i = min.getRow(); i <= max.getRow(); i++) {
        let columnMin = i === min.getRow() ? min.getCol() : 0;
        let columnMax = i === max.getRow() ? max.getCol() : 8;

        if (min.getCol() === max.getCol()) {
          columnMin = min.getCol();
          columnMax = max.getCol();
        }

        for (let j = columnMin; j <= columnMax; j++) {
          elements.push(window.values[i][j]);
        }
      }

      let first = elements.shift();
      let last  = elements.pop();
      let onlyZeroValuesLeft = elements.length > 0
        ? elements.reduce((accumulator, currentValue) => accumulator + currentValue) === 0
        : true;

      return (first === last || (10 === first + last)) && onlyZeroValuesLeft;
    }

    $(document).on("click", ".selectable", function (e) {
      let $closestRow = $(e.target).closest("tr");
      let $currentColumn = $(e.target);
      let curr = new Val($closestRow.index(), $currentColumn.index());
      if (curr.getVal() === 0) {
        return false;
      }

      let $prevSel = $('#playground').find('td.selected:not([data-idx="' + curr.getRow() + "|" + curr.getCol() + '"])');
      if (!$currentColumn.hasClass("selected")) {
        $currentColumn.addClass("selected");
        $currentColumn.css("color", "red");
        let prev = new Val($prevSel.closest('tr').index(), $prevSel.index());
        if ($prevSel.length && canNullify(curr, prev)) {
          window.values[prev.getRow()][prev.getCol()] = 0;
          window.values[curr.getRow()][curr.getCol()] = 0;
          $currentColumn.html(0);
          $prevSel.html(0);
        }
      } else {
        $currentColumn.removeClass("selected");
        // unhighlight();
      }

      if ($('#playground').find('td.selected').length == 2) {
        $prevSel.removeClass("selected");
        $currentColumn.removeClass("selected");
        $prevSel.css("color", "black");
        $currentColumn.css("color", "black");
      }
    })
  });

export default {
  name: 'NumbersGame',
  data () {
    return {
        field: PlayGround,
        selectedCells: []
    }
  },
  mounted() {
    EventBus.$on(Events.TAILS_CLICKED, (pair) => {
      console.log(pair);
    });
  },
  methods: {
    cellClass(rowIndex, cellIndex) {
        let result = "tail"

        let key = this.getCellKey(rowIndex, cellIndex);

        if (_.find(this.selectedCells, (item) => {
          return item.key === key;
        })) {
          result += " selected"
        }

        return result;
    },
    setChecked(rowIndex, cellIndex) {
        this.addSelectedPoint(rowIndex, cellIndex);
        if (_.keys(this.selectedCells).length === 2) {
            this.notifySelectedPair(_.clone(this.selectedCells));
            this.selectedCells = [];
        }
    },
    notifySelectedPair(pair) {
      EventBus.$emit(Events.TAILS_CLICKED, pair);
    },
    addSelectedPoint(rowIndex, cellIndex) {
      let result = _.clone(this.selectedCells);

      result.push({
        row: rowIndex,
        coll: cellIndex,
        key: this.getCellKey(rowIndex, cellIndex)
      });
      this.selectedCells = [];
      this.selectedCells = result;
    },
    getCellKey(rowIndex, cellIndex) {
      return `row${rowIndex}cell${cellIndex}`;
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
