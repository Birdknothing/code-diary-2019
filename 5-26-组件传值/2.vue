<template>
  <div>
    this is component 1,with value {{z}}
    {{$attrs}}
    <C2 v-bind="$attrs" @f3=f3></C2>
  </div>
</template>
<script>
export default {
  components: {
    C2(){return import('./3.vue') }
  },
  props: ['x'],
  data () {
    return {
      z:'myZ'
    }
  },
  methods: {
    f3(){}
  },
  inheritAtrrs:true,
  created () {
    // this.$attrs.y = 'C2'
       console.log(this.components)
    this.$listeners.f1.bind(this.$components)()
  }
}
</script>
<style>

</style>
