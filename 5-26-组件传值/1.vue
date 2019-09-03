<template>
  <div>
    <!-- <C1 :x="x" :y="y" @f1='f1'></C1> -->
    this.x = {{x}}
    <C2 :y="y" @h='cX'></C2>
  </div>
</template>
<script>
import C1 from './2.vue'
import C2 from './3.vue'
export default {
  components: {
    C1,
    C2
  },
  methods: {
    f1:function(){console.log('11');console.log(this.z)},
    f2(){console.log('22');console.log(this.z)},
    cX(nv){this.x=nv}
  },
  data () {
    return {
      x:1,
      y:2,
      z:3
    }
  },
  mounted () {
    this.y = 3
    console.log(this.y)
    const f2 = function(){console.log(this.z)}
    f2.call({z:'hha'})
    // setTimeout(()=>this.y = 4,1000)
  }
}
</script>
<style>

</style>
