<template>
  <div>
    this is component 3 with attrs {{$attrs}}
    <button @click="$listeners.h(44)">click me</button>
  </div>
</template>
<script>
export default {
  data () {
    return {
      
    }
  },
  created () {
    
    this.$attrs.y = 'C3'
  },
  mounted () {
    this.$listeners.h(33)
    console.log('hh')
    console.log(this.$attrs)
    console.log(this.$listeners)
  }
}
</script>
<style>

</style>
