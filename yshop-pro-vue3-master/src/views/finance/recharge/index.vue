<!--
    @name: index
    @author: kahu4
    @date: 2024-01-29 11:30
    @description：index
    @update: 2024-01-29 11:30
-->
<script
  setup
  lang="ts">
import { ref } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import TableTab from "@/views/finance/recharge/component/TableTab.vue";
import RuleForm from "@/views/finance/recharge/component/RuleForm.vue";

const activeName = ref('RuleForm')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
</script>

<template>
  <el-tabs
    v-model="activeName"
    type="card"
    @tab-click="handleClick"
  >
    <el-tab-pane label="充值记录" name="TableList">
      <TableTab />
    </el-tab-pane>
    <el-tab-pane label="充值规则" name="RuleForm">
      <RuleForm />
    </el-tab-pane>
  </el-tabs>


</template>

<style
  scoped
  lang="scss">

</style>
