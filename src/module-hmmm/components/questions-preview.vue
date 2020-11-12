<template>
  <div class="container">
  <div style="padding: 0">
    <el-form ref="items" label-width="80px">
      <el-row :gutter="20">
        <el-col v-if="result.questionType==1" style="margin-top: 10px" :span="6">
          <span class="grid-content bg-purple">【题型】：单选题</span>
        </el-col>
        <el-col v-else-if="result.questionType==2" style="margin-top: 10px" :span="6">
          <span class="grid-content bg-purple">【题型】：多选题</span>
        </el-col>
        <el-col v-else-if="result.questionType==3" style="margin-top: 10px" :span="6">
          <span class="grid-content bg-purple">【题型】：简答题</span>
        </el-col>
        <el-col style="margin-top: 10px" :span="6">
          <span class="grid-content bg-purple">【编号】：{{result.id}}</span>
        </el-col>
        <el-col v-if="result.difficulty==1" style="margin-top: 10px" :span="6">
          <span class="grid-content bg-purple">【难度】：简单</span>
        </el-col>
        <el-col v-else-if="result.difficulty==2" style="margin-top: 10px" :span="6">
          <span class="grid-content bg-purple">【难度】：一般</span>
        </el-col>
        <el-col v-else-if="result.difficulty==3" style="margin-top: 10px" :span="6">
          <span class="grid-content bg-purple">【难度】：困难</span>
        </el-col>
        <el-col style="margin-top: 10px" :span="6">
          <span class="grid-content bg-purple">【标签】：{{result.tags}}</span>
        </el-col>
        <el-col style="margin-top: 20px" :span="6">
          <span class="grid-content bg-purple">【学科】：{{result.subjectName}}</span>
        </el-col>
        <el-col style="margin-top: 20px" :span="6">
          <span class="grid-content bg-purple">【目录】：{{result.directoryName}}</span>
        </el-col>
        <el-col style="margin: 20px 0" :span="6">
          <span class="grid-content bg-purple">【方向】：{{result.direction}}</span>
        </el-col>
      </el-row>
      <hr>
      <div>【题干】：<span style="color: blue" v-html="result.question"></span></div>
      <div v-if="result.questionType==1">
        <div style="margin-bottom: 15px">单选题 选项：（以下选中的选项为正确答案）</div>
        <el-radio-group v-model="is_Right" class="noCilck">
          <div v-for="(item, index) in result.options" :key="index">
            <el-radio style="margin: 10px 0"  :label="item.isRight">{{item.title}}</el-radio>
          </div>
        </el-radio-group>
      </div>
      <span v-if="result.questionType==2">
        <div>多选题 选项：（以下选中的选项为正确答案）</div>
        <el-checkbox-group v-model="checkList" class="noCilck">
          <div v-for="(item, index) in result.options" :key="index" style="margin-top: 15px">
            <el-checkbox text-color="blue"  :label="item.isRight">{{item.title}}</el-checkbox>
          </div>
        </el-checkbox-group>
      </span>
      <hr>
      <div>
        <el-row style="display: inline-block">
          <p style="display: inline-block">【参考答案】：</p>
          <el-button @click="video" type="danger" size="small">视频答案预览</el-button>
          <el-col v-if="isShow" style="margin-top: 30px">
            <video width="400px" autoplay controls :src="result.videoURL"></video>
          </el-col>
        </el-row>
      </div>
      <hr>
      <div><span v-html="'【答案解析】：' + result.answer"></span></div>
      <hr>
      <div><span v-html="'【题目备注】：' + result.remarks"></span></div>
    </el-form>
  </div>
</div>
</template>

<script>
export default {
  name: 'questionDetails', // 试题详情
  props: ['result'], // 接受父组件传来的数据详情
  data () {
    return {
      checkList: [1], // 复选是否选中(数组中每项为1的话表示选中)
      is_Right: 1, // 单选是否选中(0-->未选 1-->选中)
      isShow: false // 视频播放器默认不显示
    }
  },
  methods: {
    // 点击答案按钮，显示视频框
    video () {
      this.isShow = true
    }
  }
}
</script>

<style>
p {
  display: inline-block;
}
.container /deep/ .noCilck {
  pointer-events: none;
}

</style>
