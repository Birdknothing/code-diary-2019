<template>
  <div id='test' :data-theme='theme'>
    <ul v-if='arr.length'>
        <li  v-for='(ele,indx) in arr' :key='indx'>{{content[indx]}}</li>
    </ul>  
    <button @click='cgColor'>change color</button>  
  </div>  
</template>
<script>
export default {
  data(){
      return {
          arr:[0,0,1],
          content:['a','b','c'],
          theme:'theme-red'
      }
  },
  methods:{
      cgColor(){
          this.theme='theme-green'
      }
  }
}
</script>
<style lang='scss'>
    *{padding:0;margin:0;box-sizing: border-box}
    $theme:(
        theme-red:(
            background: red,
            color: red
        ),
        theme-green:(
            background: green,
            color: green
        ),
        theme-blue:(
            background: blue,
            color: white
        )

    );
    @mixin themify{
        @each $theme-name,$theme-content in $theme{
            $theme-content:$theme-content !global;
            #test[data-theme=#{$theme-name}]{
                color:gt('color');
            }
        }
    }
    @function gt($key){
        @return map-get($theme-content,$key)
    }
    @include themify;
</style>

