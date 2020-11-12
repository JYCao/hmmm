<template>
  <div class='container'>
    <!-- 卡片面板 -->
    <el-card class="box-card">
      <!-- 搜索区 -->
      <div slot="header" class="clearfix" ref="form">
          <el-form :model="form" label-width="80px" ref="myForm">
            <el-row>
              <el-col :span="6">
                <span class="title">说明：目前支持学科和关键字条件筛选</span>
              </el-col>
              <el-col :span="18">
                <el-button type="success" size="medium" class="add" @click="$router.push('new')">
                  <i class="el-icon-edit"></i>新增试题
                </el-button>
              </el-col>
            </el-row>
            <!-- 第一列 -->
            <el-row>
              <el-col :span="6">
                <el-form-item label="学科" prop="subjectID">
                  <el-select v-model="form.subjectID" placeholder="请选择" @change="hChangesbj">
                    <el-option
                    v-for="(subject,idx) in subjectsList"
                    :label="subject.label"
                    :value="subject.value"
                    :key="idx"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="二级目录" prop="catalogID">
                  <el-select v-model="form.catalogID" placeholder="请选择">
                    <el-option
                    v-for="(directory,idx) in directorysList"
                    :label="directory.directoryName"
                    :value="directory.id"
                    :key="idx">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="标签" prop="tags">
                  <el-select v-model="form.tags" placeholder="请选择">
                    <el-option
                    v-for="tag in tagsList"
                    :key="tag.value"
                    :label="tag.label"
                    :value="tag.value">
                    </el-option>
              </el-select>
            </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="关键字">
                  <el-input v-model="form.keyword" placeholder="请根据题干搜索"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- 第二列 -->
            <el-row >
              <el-col :span="6">
                <el-form-item label="试题类型">
                  <el-select v-model="form.questionType" placeholder="请选择">
                    <el-option
                    v-for="item in questionTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="难度">
                  <el-select v-model="form.difficulty" placeholder="请选择">
                    <el-option
                    v-for="item in difficultyList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="方向">
                  <el-select v-model="form.direction" placeholder="请选择">
                    <el-option
                    v-for="(item,idx) in directionList"
                    :key="idx"
                    :label="item"
                    :value="idx">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="录入人">
                  <el-select v-model="form.creatorID" placeholder="请选择">
                    <el-option label="超级管理员" :value="1"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- 第三列 -->
            <el-row>
              <el-col :span="6">
                <el-form-item label="题目备注">
                  <el-input v-model="form.remarks"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="企业简称">
                  <el-input v-model="form.shortName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                 <el-form-item label="城市" prop="province">
                   <el-row>
                     <el-col :span="12" style="padding-right:5px">
                            <el-select
                            placeholder="请选择" v-model="form.province" @change="hChoiceCity" >
                              <el-option
                              v-for="(item,idx) in citySelect.province"
                              :key="idx"
                              :value="item"
                              :label="item"></el-option>
                          </el-select>
                     </el-col>
                     <el-col :span="12" style="padding-left:5px">
                            <el-select  placeholder="请选择" v-model="form.city">
                              <el-option
                               v-for="(item,idx) in citySelect.cityData"
                              :key="idx"
                              :value="item"
                              :label="item"></el-option>
                          </el-select>
                     </el-col>
                   </el-row>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item style="float:right">
                  <el-button size="mini" @click="hEmpty">清除</el-button>
                  <el-button size="mini" type="primary" @click="hSearch">搜索</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-alert
            :title="alertText"
            type="info"
            show-icon
            :closable="false">
          </el-alert>
        </div>
      <!-- 数据列表 -->
      <div>
        <el-table
          :data="questionItem"
          style="width: 100%">
          <el-table-column label="序号" width="50" align="center">
          <template scope="scope">
            <span>{{(form.page-1)*form.pagesize+(scope.$index + 1)}} </span>
          </template>
          </el-table-column>
          <el-table-column label="试题编号" width="160" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.number}}</span>
            </template>
          </el-table-column>
          <el-table-column label="学科" width="80" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.subject}}</span>
            </template>
          </el-table-column>
          <el-table-column label="目录" width="80" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.catalog}}</span>
            </template>
          </el-table-column>
          <el-table-column label="题型" width="80" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.questionType==='1'">单选</span>
              <span v-else-if="scope.row.questionType==='2'">多选</span>
              <span v-else-if="scope.row.questionType==='3'">简单</span>
              <span v-else> </span>
            </template>
          </el-table-column>
          <el-table-column label="题干" width="200" align="center">
             <template slot-scope="scope">
              <span v-html="scope.row.question"></span>
            </template>
          </el-table-column>
          <el-table-column label="录入时间" width="200" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.addDate | formatDate}}</span>
            </template>
          </el-table-column>
          <el-table-column label="难度" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.difficulty==='1'">简单</span>
              <span v-else-if="scope.row.difficulty==='2'">一般</span>
              <span v-else-if="scope.row.difficulty==='3'">困难</span>
              <span v-else> </span>
            </template>
          </el-table-column>
          <el-table-column label="录入人" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.creator}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
              <el-button size="mini"
                title="预览"
                icon="el-icon-view" plain circle
                @click="hPreview(scope.row.id)">
              </el-button>
              <el-button size="mini"
                title="编辑"
                type="success" icon="el-icon-edit" plain circle
                @click="hEdit(scope.row.id)">
              </el-button>
              <el-button size="mini"
                ref="dangerBtn"
                title="删除"
                type="danger" icon="el-icon-delete" plain circle
                @click="hDel(scope.row.id)">
              </el-button>
              <el-button size="mini"
                title="加入精选"
                type="warning" icon="el-icon-check" plain circle
                @click="hChoice(scope.row.id)">
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页功能 -->
        <el-pagination
          background
          layout="prev, pager, next, sizes, jumper"
          :disabled = isLoadding
          :page-sizes="[10,2,3,5]"
          :page-size="form.pagesize"
          @current-change=hPageChange
          @size-change=hPagesizeChange
          :hide-on-single-page='false'
          :total="counts">
        </el-pagination>
      </div>
      <el-dialog
      :destroy-on-close="true"
      :visible.sync="dialogVisible"
      title="题目预览"
      width="60%"
      center>
        <my-preview v-bind:result="results"> </my-preview>
          <span slot="footer">
            <el-button type="primary" @click="dialogVisible = false">关 闭</el-button>
          </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
// 导入试题列表模块
import { list, remove, choiceAdd, detail } from '@/api/hmmm/questions'
// 导入学科列表模块
import { simple } from '@/api/hmmm/subjects'
// 导入目录列表模块
import { list as directorysList } from '@/api/hmmm/directorys'
// 导入标签列表模块
import { simple as tagsList } from '@/api/hmmm/tags'
// 导入城市模块
import { provinces, citys } from '@/api/hmmm/citys'
// 导入基础变量模块
import { direction, questionType, difficulty } from '@/api/hmmm/constants'
// 导入preview组件
import MyPreview from '@/module-hmmm/components/questions-preview'
export default {
  name: 'question',
  // 注册子组件
  components: {
    MyPreview
  },
  data () {
    return {
      isLoadding: false, // isLoadding状态默认为false
      results: {}, // 给子组件试题详情的数据
      dialogVisible: false, // 弹出框
      alertText: '', // 列表提示信息
      counts: 0, // 总记录数
      questionTypeList: questionType, // 题型
      difficultyList: difficulty, // 难度
      directionList: direction, // 方向
      subjectsList: [], // 学科列表
      directorysList: [], // 目录列表
      tagsList: [], // 标签列表
      // 城市下拉框
      citySelect: {
        province: [], // 省份
        cityData: [] // 县区
      },
      questionItem: [], // 表格数据
      form: {
        catalogID: null, // 二级目录
        tags: null, // 标签
        questionType: null, // 题型
        difficulty: null, // 难度
        subjectID: null, // 学科ID
        keyword: null, // 关键字
        creatorID: null, // 录入人
        remarks: null, // 题目备注
        shortName: null, // 企业简称
        province: null, // 省份
        city: null, // 城市
        direction: null, // 方向
        page: 1, // 当前页
        pagesize: 10 // 页大小
      }
    }
  },
  created () {
    this.loadQuestionList() // 获取表格数据
    this.loadSubjects() // 获取学科数据
    this.getProvince() // 获取城市数据
  },
  methods: {
    // 请求试题列表数据渲染页面
    async loadQuestionList () {
      const res = await list(this.form)
      this.questionItem = res.data.items // 把请求回来的列表赋值给表格数据
      this.alertText = `这里共有${res.data.counts}道题` // 提示消息
      this.counts = res.data.counts // 总数据条数
      this.isLoadding = false
    },
    // 请求学科列表数据渲染下拉框
    async loadSubjects () {
      const res = await simple()
      this.subjectsList = res.data
    },
    // 选择学科
    async hChangesbj (subjectID) {
      // 当下拉学科值改变的时候先清空数据项
      this.form.catalogID = null
      this.form.tags = null
      // 1. 发送ajax 请求二级目录列表
      const result = await directorysList({ subjectID })
      // 1.1 把请求回来的数据渲染到目录列表数据项
      this.directorysList = result.data.items
      // 2. 发送ajax 请求标签列表
      const tagsResult = await tagsList({ subjectID })
      // 1.1 把请求回来的数据渲染到标签列表数据项
      this.tagsList = tagsResult.data
    },
    // 清空筛选框的数据
    hEmpty () {
      this.form.city = null
      this.$refs.myForm.resetFields()
      this.directorysList = []
      this.tagsList = []
    },
    // 点击搜索筛选列表
    async hSearch () {
      // 1.每次搜索都设置为首页
      this.form.page = 1
      // 2.把关键字中空格去除
      if (this.form.keyword) {
        this.form.keyword = this.form.keyword.replaceAll(' ', '')
      }
      // 3. 发送ajax请求(请求基础试题列表)
      const res = await list(this.form)
      this.questionItem = res.data.items
      this.alertText = `这里共有${res.data.counts}道题`
      this.counts = res.data.counts
    },
    // 点击预览框
    async hPreview (id) {
      // 1.弹出预览框
      this.dialogVisible = true
      // 2.发送ajax请求(请求试题详情)
      const res = await detail({ id })
      // 3.把传回来的值赋值给results,为的是给子组件传过去
      this.results = res.data
    },
    // 点击编辑跳转到对应的试题录入
    hEdit (id) {
      this.$router.push({
        path: '/questions/new?',
        query: { id }
      })
    },
    // 删除对应列表功能
    hDel (id) {
      this.$confirm('此操作将永久删除该试题, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        remove({ id }) // 发送ajax删除请求
        this.loadQuestionList() // 重新渲染页面
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 加入精选
    hChoice (id) {
      this.$confirm('此操作要将试题加入精选, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        choiceAdd({ id, choiceState: 1 })// 发送ajax删除请求
        this.$router.push('choice') // 跳转到精选试题
        this.$message({
          type: 'success',
          message: '加入成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消加入'
        })
      })
    },
    // 点击切换页码
    hPageChange (page) {
      this.isLoadding = true // isLoadding状态变为true
      this.form.page = page // 把当前点击的页码传入
      this.loadQuestionList()
    },
    // 点击切换每页条数
    hPagesizeChange (page) {
      this.isLoadding = true // isLoadding状态变为true
      this.form.pagesize = page // 把当前点击的每页条数传入
      this.loadQuestionList()
    },
    // 获取省份
    getProvince () {
      this.citySelect.province = provinces()
    },
    // 获取市区
    hChoiceCity: function (e) {
      this.citySelect.cityData = citys(e)
      this.form.city = this.citySelect.cityData[0]
    }

  },
  // 时间戳过滤器
  filters: {
    formatDate: function (value) {
      const date = new Date(value)
      const y = date.getFullYear()
      let MM = date.getMonth() + 1
      MM = MM < 10 ? ('0' + MM) : MM
      let d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      let h = date.getHours()
      h = h < 10 ? ('0' + h) : h
      let m = date.getMinutes()
      m = m < 10 ? ('0' + m) : m
      let s = date.getSeconds()
      s = s < 10 ? ('0' + s) : s
      return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s
    }
  }
}
</script>

<style scoped lang='less'>
.box-card {
  font-size: 12px;
  margin: 15px ;
}
.title {
  height: 50px;
  margin-left: 10px;
  margin-top: 10px;
  color: pink;
}
.el-select {
  width: 100%;
}
.add {
  float:right;
  margin-right: 10px;
  margin-bottom: 20px;
  font-size: 12px;
}
.el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
</style>
