<template>
    <div class="mines" ref="mines">
      <div class="center-block" :style="{ width: centerBlockWidth + 'px', height: centerBlockHeight + 'px' }">
        <div class="minefield">
          <table :class="status" oncontextmenu="return false">
            <tr v-for="(row, rowIndex) in minefield" :key="`row-${rowIndex}`">
              <td
                v-for="(col, colIndex) in row"
                :key="`col-${colIndex}`"
                :class="[`mine-${col.mine}`, `status-${col.status}`]"
                @click="leftKeyHandler(col.row, col.col)"
                @contextmenu.prevent="flagCell(col.row, col.col)"
              ></td>
            </tr>
          </table>
        </div>
        <div class="menu">
          <div class="menu-top">
            <div><img src="../assets/images/flag32.png" alt=""></div>
            <div class="info-value"><span>{{ flagsNum }}</span>/<span>{{ minesNum }}</span></div>
            <div><img src="../assets/images/clock32.png" alt=""></div>
            <div class="info-value"><timer :status="timerStatus" :get-time="getTime"/></div>
          </div>
          <div class="menu-bottom">
            <button id="menu-btn0" @click="btnHandler(0)" :disabled="status === 'ready'">{{ btnLabel[0] }}</button>
            <button id="menu-btn1" @click="btnHandler(1)">{{ btnLabel[1] }}</button>
            <button id="menu-btn2" @click="btnHandler(2)" :disabled="status === 'ready'">{{ btnLabel[2] }}</button>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import Timer from '@/components/Timer'

export default {
  name: 'Mines',
  components: { Timer },
  props: {
    height: Number,
    width: Number,
    mines: Number
  },

  data () {
    return {
      status: 'ready', // 'ready', 'playing', 'die', 'win' or 'pause'
      timerStatus: 'pause',
      centerBlockWidth: 0,
      centerBlockHeight: 0,
      minefield: [],

      // 游戏难度参数
      minefieldWidth: 0,
      minefieldHeight: 0,
      minesNum: 0,

      flagsNum: 0,
      openedNum: 0,
      gameDuration: -1,
      getTimeCallback: null
    }
  },

  computed: {
    btnLabel () {
      if (this.status === 'die') {
        return ['Play Again', 'Best Times', 'Change Difficulty']
      } else {
        return ['Start Over', 'Change Difficulty', 'Pause']
      }
    }
  },

  watch: {
    openedNum (val) {
      if (val === this.minefieldHeight * this.minefieldWidth - this.minesNum && this.status === 'playing') {
        this.win()
      }
    }
  },

  mounted () {
    // 获得参数
    this.minefieldWidth = this.width ? this.width : this.$route.params.width
    this.minefieldHeight = this.height ? this.height : this.$route.params.height
    this.minesNum = this.mines ? this.mines : this.$route.params.mines

    // 创建雷区
    this.createMinefield()

    // 自适应窗口大小
    this.resizeContainer()
    window.onresize = this.resizeContainer
  },

  methods: {

    // 刷新游戏区内元素大小
    resizeContainer () {
      let height = this.$refs.mines.clientHeight - 40
      let width = this.$refs.mines.clientWidth - 40
      let shouldHeight = (width - 174) / this.minefieldWidth * this.minefieldHeight
      let shouldWidth = height / this.minefieldHeight * this.minefieldWidth + 174
      if (width < shouldWidth) {
        height = shouldHeight
      } else {
        width = shouldWidth
      }
      this.centerBlockWidth = width
      this.centerBlockHeight = height
    },

    // 创建雷区
    createMinefield () {
      for (let i = 0; i < this.minefieldHeight; i++) {
        this.$set(this.minefield, i, [])
        for (let j = 0; j < this.minefieldWidth; j++) {
          this.$set(this.minefield[i], j, {
            row: i,
            col: j,
            mine: 0,
            status: 'unknown' // 'unknown', 'opened', 'flag', 'maybe'
          })
        }
      }
    },

    // 装载地雷
    loadMines (centerRow, centerCol) {
      // 确定可选位置，开场位置和其周围 8 格都不能有雷
      let choices = []
      for (let row = 0; row < this.minefieldHeight; row++) {
        for (let col = 0; col < this.minefieldWidth; col++) {
          if (row < centerRow - 1 || row > centerRow + 1 || col < centerCol - 1 || col > centerCol + 1) {
            choices[choices.length] = [row, col]
          }
        }
      }

      // 不断从可选位置中抽取雷点
      let nears = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]
      for (let i = 0; i < this.minesNum; i++) {
        // 抽取雷点
        let targetIndex = Math.floor(Math.random() * (choices.length - i))
        let row = choices[targetIndex][0]
        let col = choices[targetIndex][1]

        this.minefield[row][col].mine = -1

        // 从可选位置中移除该位置
        choices[targetIndex] = choices[choices.length - i - 1]

        // 递增雷点周围格子的雷数
        for (let j in nears) {
          let nearRow = row + nears[j][0]
          let nearCol = col + nears[j][1]
          if (
            nearRow >= 0 && nearRow < this.minefieldHeight &&
            nearCol >= 0 && nearCol < this.minefieldWidth &&
            this.minefield[nearRow][nearCol].mine !== -1
          ) {
            this.minefield[nearRow][nearCol].mine += 1
          }
        }
      }
    },

    // 左键（开格子、开场、开周围）
    leftKeyHandler (row, col) {
      if (this.status === 'ready') {
        // 开场
        this.status = 'playing'
        this.loadMines(row, col)
        this.openCell(row, col)
        this.timerStatus = 'start'
      } else if (this.status === 'playing') {
        let cell = this.minefield[row][col]
        if (cell.status === 'unknown' || cell.status === 'maybe') {
          // 开格子
          this.openCell(row, col)
        } else if (cell.status === 'opened' && cell.mine > 0) {
          // 开周围
          this.openNearCell(row, col)
        }
      }
    },

    // 开格子
    openCell (row, col) {
      let cell = this.minefield[row][col]

      // 只能开 'unknown' 或 'maybe' 状态的格子
      if (cell.status !== 'unknown' && cell.status !== 'maybe') {
        return
      }

      cell.status = 'opened'

      if (cell.mine === -1) {
        // 开到雷
        this.status = 'die'
        this.timerStatus = 'pause'
      }
      this.openedNum += 1
      if (cell.mine === 0) {
        // 开到无雷格
        this.openNearCell(row, col)
      }
    },

    // 开周围格
    openNearCell (row, col) {
      let nears = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]
      let cell = this.minefield[row][col]

      // 统计周围旗子数目
      let nearFlagsNum = 0
      for (let i in nears) {
        let nearRow = row + nears[i][0]
        let nearCol = col + nears[i][1]
        if (
          nearRow >= 0 && nearRow < this.minefieldHeight &&
          nearCol >= 0 && nearCol < this.minefieldWidth &&
          this.minefield[nearRow][nearCol].status === 'flag'
        ) {
          nearFlagsNum += 1
        }
      }

      // 开周围
      if (nearFlagsNum === cell.mine) {
        for (let i in nears) {
          let nearRow = row + nears[i][0]
          let nearCol = col + nears[i][1]
          if (
            nearRow >= 0 && nearRow < this.minefieldHeight &&
            nearCol >= 0 && nearCol < this.minefieldWidth
          ) {
            this.openCell(nearRow, nearCol)
          }
        }
      }
    },

    // 标旗子
    flagCell (row, col) {
      // 只有在游戏中可以标棋子
      if (this.status !== 'playing') {
        return
      }

      let cell = this.minefield[row][col]
      if (cell.status === 'unknown') {
        if (this.flagsNum < this.minesNum) {
          this.flagsNum += 1
          cell.status = 'flag'
        } else {
          cell.status = 'maybe'
        }
      } else if (cell.status === 'flag') {
        this.flagsNum -= 1
        cell.status = 'maybe'
      } else if (cell.status === 'maybe') {
        cell.status = 'unknown'
      }
    },

    resetGame () {
      this.createMinefield()
      this.status = 'ready'
      this.timerStatus = 'reset'
      this.flagsNum = 0
      this.openedNum = 0
      this.gameDuration = -1
      this.getTimeCallback = null
    },
    changeDiff () {
      return this.$router.push('/difficulty')
    },
    pauseGame () {
      if (this.status === 'playing') {
        this.status = 'pause'
        this.timerStatus = 'pause'
      } else if (this.status === 'pause') {
        this.status = 'playing'
        this.timerStatus = 'start'
      }
    },
    btnHandler (btnId) {
      if (btnId === 0) {
        this.resetGame()
      } else if (btnId === 1) {
        if (this.status === 'ready' || this.status === 'playing' || this.status === 'pause') {
          this.changeDiff()
        } else if (this.status === 'die') {
          // TODO: 排行榜有待开发
        }
      } else if (btnId === 2) {
        if (this.status === 'playing' || this.status === 'pause') {
          this.pauseGame()
        } else if (this.status === 'die') {
          this.changeDiff()
        }
      }
    },

    win () {
      this.status = 'win'
      if (this.gameDuration === -1) {
        this.timerStatus = 'pause'
        this.getTimeCallback = this.win
        this.timerStatus = 'output'
        return
      }
      let minutes = Math.floor(this.gameDuration / 60)
      let seconds = this.gameDuration % 60

      // TODO: 排行榜功能有待开发
      alert('太强了，你完成了！只用了' + minutes + '分' + seconds + '秒！\n由于排行榜还在开发中，所以目前你只能自己记着啦😊...')
      this.resetGame()
    },

    getTime (val) {
      this.gameDuration = val
      if (this.getTimeCallback) {
        this.getTimeCallback()
      }
    }

  }
}
</script>

<style lang="less" scoped>
  @import '../assets/theme/default.less';

  .mines {
    display: flex;
    width: 100%;
    height: 100%;
    padding: 20px;
    justify-content: center;
    align-items: center;
  }
  .center-block {
    display: flex;
  }
  .minefield {
    height: 100%;
    flex-grow: 1;

    table {
      width: 100%;
      height: 100%;
      border-collapse: collapse;
      background-position: center;
      background-repeat: no-repeat;

      td {
        border-radius: 9px;
        border: 4px solid @main-bg-color;
        background-color: @cell-color;
        background-position: center;
        background-repeat: no-repeat;
        background-size: 75%;

        &:hover {
          background-color: @cell-hover-color;
        }
        &:active {
          background-color: mix(@cell-hover-color, @cell-color);
        }

        &.status-opened {
          background-color: @cell-opened-color;

          &.mine-1 { background-image: @cell-1mines-bg; }
          &.mine-2 { background-image: @cell-2mines-bg; }
          &.mine-3 { background-image: @cell-3mines-bg; }
          &.mine-4 { background-image: @cell-4mines-bg; }
          &.mine-5 { background-image: @cell-5mines-bg; }
          &.mine-6 { background-image: @cell-6mines-bg; }
          &.mine-7 { background-image: @cell-7mines-bg; }
          &.mine-8 { background-image: @cell-8mines-bg; }
          &.mine--1 { background-image: @cell-mine-bg; }
        }
        &.status-flag { background-image: @cell-flag-bg; }
        &.status-maybe { background-image: @cell-maybe-bg; }
        &.status-unknown { background-image: none; }
      }

      &.pause {
        border-radius: 4px;
        background-color: @cell-color;
        background-image: @minefield-pause-bg;

        td, tr {
          display: none;
        }
      }

      &.die {
        td {
          background-color: @cell-die-color;
          &.status-opened {
            background-color: @cell-opened-color;
          }
          &.mine--1 {
            background-image: @cell-mine-bg;
            &.status-opened {
              background-image: @cell-exploded-bg;
            }
            &.status-flag {
              background-image: @cell-flag-bg;
            }
          }
          &.status-flag {
            background-image: @cell-incorrect-bg;
          }
        }
      }
    }
  }
  .menu {
    display: flex;
    width: 174px;
    height: 100%;
    padding-left: 24px;
    flex-direction: column;
    justify-content: space-between;

    .menu-top {
      div {
        text-align: center;
      }
      .info-value {
        margin: 3px 0 14px;
      }
    }
    .menu-bottom button {
      height: 58px;
      width: 100%;
      margin-top: 6px;
      .default-btn
    }
  }
</style>
