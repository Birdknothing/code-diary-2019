<template>
    <div>
        <span>{{p1}}</span>
        <ul>
            <li @click='del'>{{p1}}</li>
            <li>{{p2}}</li>
        </ul>
    </div>
</template>
<script>
export default {
    props:['p1','p2'],
    methods:{
        del(){
            this.$emit('fdel')
        }
    }
}
</script>
<style>

</style>


