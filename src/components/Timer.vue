<template>
    <div class="timer">{{ representTimer }}</div>
</template>

<script>
export default {
  name: 'Timer',
  props: {
    status: {
      type: String,
      default: 'pause' // 可取 'pause' 'start' 'reset' 'output' 四个值
    },
    getTime: {
      type: Function,
      default: (seconds) => console.log(`Timer: ${seconds}`)
    }
  },
  data () {
    return {
      representSecs: 0,
      isRunning: false,
      startTimestamp: 0,
      cacheSecs: 0
    }
  },
  computed: {
    representTimer () {
      let minutes = Math.floor(this.representSecs / 60).toString()
      let seconds = (this.representSecs % 60).toString()
      if (minutes.length < 2) {
        minutes = `0${minutes}`
      }
      if (seconds.length < 2) {
        seconds = `0${seconds}`
      }
      return `${minutes}:${seconds}`
    }
  },
  watch: {
    status (newVal, oldVal) {
      if (newVal === 'start' && !this.isRunning) {
        this.start() // 开始计时
      } else if (newVal === 'pause' && this.isRunning) {
        this.pause() // 暂停计时
      } else if (newVal === 'reset') {
        this.reset() // 重置计时器
      } else if (newVal === 'output') {
        this.output()
      }
    }
  },
  mounted () {
    this.refreshRepresent()
  },
  methods: {
    start () {
      this.startTimestamp = Math.floor((new Date()).getTime() / 1000)
      this.isRunning = true
    },
    pause () {
      this.cacheSecs += Math.floor((new Date()).getTime() / 1000) - this.startTimestamp
      this.isRunning = false
    },
    reset () {
      this.isRunning = false
      this.cacheSecs = 0
      this.representSecs = 0
    },
    output () {
      if (this.isRunning) {
        this.getTime(this.cacheSecs + Math.floor((new Date()).getTime() / 1000) - this.startTimestamp)
      } else {
        this.getTime(this.cacheSecs)
      }
    },
    refreshRepresent () {
      if (this.isRunning) {
        this.representSecs = this.cacheSecs + Math.floor((new Date()).getTime() / 1000) - this.startTimestamp
      } else {
        this.representSecs = this.cacheSecs
      }
      setTimeout(this.refreshRepresent, 200)
    }
  }
}
</script>

<style scoped>
  .timer {
    display: inline;
  }
</style>
