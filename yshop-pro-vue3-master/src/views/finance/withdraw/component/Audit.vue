<!--
    @name: Detail
    @author: kahu4
    @date: 2024-01-29 12:00
    @description：Detail
    @update: 2024-01-29 12:00
-->
<script
  setup
  lang="ts">
import { Ref, ref } from 'vue'
import { WithdrawAuditModel } from "@/api/finance/withdraw/index.model";
import { ElMessage } from "element-plus";
import { audit } from "@/api/finance/withdraw";
const showDialog = ref(false)
const emits = defineEmits(['confirm'])
function open(id:any){
  form.value.id = id
  showDialog.value = true
}

function close(){
  form.value = {
    id: undefined, content: "", type: 4
  }
  showDialog.value = false
}
defineExpose({open,close})

const formRef = ref()

const form:Ref<WithdrawAuditModel> = ref({
  id: undefined, content: "", type: 4
})

const formRule = {
  type:[
    {required:true,message:'请选择审核结果',trigger:'blur'}
  ]
}

async function handleConfirm(){
  try {
    await formRef.value.validate()
    await audit(form.value)
    ElMessage.success('审核成功')
    emits('confirm')
    close()
  } catch (e) {
    console.log(e)
    return ElMessage.error('请完善表单')
  }
}

</script>

<template>
  <el-dialog v-model="showDialog" title="审核" width="50%">
    <el-form ref="formRef" :rules="formRule" :mode="form" label-width="120">
      <el-form-item label="提现审核" prop="status">
        <el-radio-group v-model="form.type">
          <el-radio :label="4">审核通过</el-radio>
          <el-radio :label="5">审核拒绝</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="说明">
        <el-input v-model="form.content" type="textarea" :autosize="{maxRows:5,minRows:3}" placeholder="请输入内容" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<style
  scoped
  lang="scss">

</style>
