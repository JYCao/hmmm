<template>
  <div class="container">
    <!-- 数据记录 -->
    <el-alert
        v-if="counts"
        type="info"
        class="alert"
        :closable="false"
        :title="alertText"
        show-icon>
      </el-alert>
      <el-table
      :data="dataList"
      style="width: 100%"
      max-height="100%"
      v-loading="isLoading"
      align="center">
       <el-table-column label="序号" width="50" align="center">
        <template scope="scope">
          <span>{{(requestParameters.page-1)*requestParameters.pagesize+(scope.$index + 1)}} </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="number"
        label="试题编号"
        width="120"
        align="center">
      </el-table-column>
      <el-table-column
        prop="subject"
        label="学科"
        width="80">
      </el-table-column>
      <el-table-column
        prop="catalog"
        align="center"
        label="目录"
        width="80">
      </el-table-column>
      <el-table-column
        label="题型"
        align="center"
        width="80">
        <template slot-scope="scope">
          <!-- 过滤器实现转换 -->
          <span>{{ scope.row.questionType | fFormatQuestionType }}</span>
          <!-- <span v-if="scope.row.questionType==1">单选</span>
          <span v-else-if="scope.row.questionType==2">多选</span>
          <span v-else>简答</span> -->
        </template>
      </el-table-column>
      <el-table-column
        label="题干"
        width="120"
        align="center">
        <template slot-scope="scope">
          <span v-html="scope.row.question"></span>
        </template>
      </el-table-column>
      <el-table-column
        label="录入时间"
        width="400"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.addDate | fFormatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="难度"
        align="center"
        width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.difficulty | fFormatDifficulty }}</span>
          <!-- <span v-if="scope.row.difficulty==1">简单</span>
          <span v-else-if="scope.row.difficulty==2">一般</span>
          <span v-else>困难</span> -->
        </template>
      </el-table-column>
      <el-table-column
        prop="creator"
        label="录入人"
        align="center"
        width="120">
      </el-table-column>
      <el-table-column
        label="审核状态"
        align="center"
        width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.chkState | fFormatCheck }}</span>
          <!-- <span v-if="scope.row.chkState===0">待审核</span>
          <span v-else-if="scope.row.chkState===1">已审核</span>
          <span v-else>已拒绝</span> -->
        </template>
      </el-table-column>
      <el-table-column
        prop="chkRemarks"
        label="审核意见"
        align="center"
        width="120">
      </el-table-column>
      <el-table-column
        prop="chkUser"
        label="审核人"
        align="center"
        width="120">
      </el-table-column>
      <el-table-column
        label="发布状态"
        align="center"
        width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.chkState===0||scope.row.chkState===2">待发布</span>
          <span v-else-if="scope.row.publishState===0">已下架</span>
          <span v-else>已发布</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        fixed="right"
        label="操作"
        width="230">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="hPreview(scope.row.id)"
            type="text"
            size="small">
            预览
          </el-button>
          <el-button
            size="small"
            type="text"
            @click="hCheckBox(scope.row.id)"
            :disabled="scope.row.chkState===1||scope.row.chkState===2">
            审核
          </el-button>
          <el-button
            @click.native.prevent="hEdit(scope.row.id)"
            type="text"
            size="small"
            :disabled="scope.row.publishState===1">
            修改
          </el-button>
          <el-button
            @click.native.prevent="hUpDown(scope.row.id, scope.row.publishState)"
            type="text"
            size="small">
          <span>{{ scope.row.publishState | fFormatPublishState}}</span>
          <!-- <span v-if="scope.row.publishState===0" >上架</span>
          <span v-else >下架</span> -->
          </el-button>
          <el-button
            @click.native.prevent="hDelete(scope.row.id)"
            type="text"
            :disabled="scope.row.publishState===1"
            size="small">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- @current-change 代表页面改变执行的函数 -->
    <div class="pagination">
      <el-pagination
        @size-change="hChangeSize"
        @current-change="hChangePage"
        style="float: right"
        background
        :current-page.sync="requestParameters.page"
        layout="prev, pager, next, sizes, jumper"
        :page-sizes="[1, 2, 3, 4, 5, 10]"
        :page-size="requestParameters.pagesize"
        :disabled="isLoading"
        :total="counts">
      </el-pagination>
    </div>
    <!-- 审核弹层标签 -->
    <el-dialog title="题目审核" :visible.sync="dialogFormVisible" width="30%" :center="false">
      <el-form>
        <el-form-item>
          <el-radio-group v-model="checkQuestions.chkState">
            <el-radio :label="1">通过</el-radio>
            <el-radio :label="2">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-input type="textarea" v-model="checkQuestions.chkRemarks" placeholder="请输入审核意见"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="hCheck">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 预览弹层标签 -->
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
  </div>
</template>

<script>
// 引入精选题库列表,基础题库删除,精选题库上下架,试题审核,基础图库详情ajax请求
import { choice, remove, choicePublish, choiceCheck, detail } from '@/api/hmmm/questions.js'
// 引入预览弹框组件
import MyPreview from '@/module-hmmm/components/questions-preview.vue'
// import func from '../../../../vue-temp/vue-editor-bridge'
export default {
  name: 'MyTable',
  components: {
    MyPreview
  },
  props: ['chkState', 'subjectID', 'keyword', 'isSearch'],
  data () {
    return {
      results: {}, // 父组件传给预览弹框的数据,为什么不能为null
      upDown: '', // 上下架文字提示信息
      dataList: [], // 精选题库列表
      counts: null, // 数据总条数
      // alertText: '', // 提示显示数据条数
      isLoading: false, // 切换页面,页码切换禁用
      // 精选题库列表,请求参数
      requestParameters: {
        page: 1, // 当前所在的分页页面
        pagesize: 10, // 每页的数据条数
        chkState: this.chkState, // 当前的审核状态tag标签
        subjectID: this.subjectID, // 父传子,传过来课题id
        keyword: this.keyword // 传过来关键字
      },
      // 上下架参数
      upDownProps: {
        id: 1,
        publishState: ''
      },
      // 试题审核参数
      checkQuestions: {
        id: '',
        chkState: 1, // 弹出层激活态默认是通过单选框
        chkRemarks: '' // 审核意见
      },
      dialogFormVisible: false, // 审核弹出层默认关闭
      dialogVisible: false // 预览弹出成默认关闭
    }
  },
  // 侦听值变化
  watch: {
    // 根绝审核状态,筛选数据,传参
    chkState: function (newValue, oldValue) {
      this.requestParameters.chkState = newValue
      // this.loadUserMg()
    },
    // 根据课题,条件筛选,传参
    subjectID: function (newValue, oldValue) {
      this.requestParameters.subjectID = newValue
    },
    // 根据关键字,条件筛选,传参
    keyword: function (newValue, oldValue) {
      this.requestParameters.keyword = newValue
    },
    // 点击筛选按钮,实现筛选功能
    isSearch: function (newValue, oldValue) {
      this.requestParameters.page = 1
      this.loadUserMg()
    }
  },
  created () {
    this.loadUserMg()
    // console.log(123)
  },
  methods: {
    // // 时间加零
    // addZero (n) {
    //   return n < 10 ? '0' + n : n
    // },
    // 点击修改,跳转到试题目录
    hEdit (id) {
      this.$router.push({
        path: '/questions/new?',
        query: { id }
      })
    },
    // 点击预览弹出预览框,拿到预览框的信息
    async hPreview (id) {
      this.dialogVisible = true
      try {
        const { data: res } = await detail({ id })
        // console.log(res, '我是详情')
        this.results = res
        console.log(this.results)
      } catch (err) {
        console.log(err)
      }
    },
    // 点击弹出审核框,传入当前id
    hCheckBox (id) {
      this.dialogFormVisible = true
      this.checkQuestions.id = id
    },
    // 审核功能
    hCheck () {
      // 审核意见为空,提示信息
      if (this.checkQuestions.chkRemarks === '') {
        this.$message.warning('请输入审核意见')
      } else {
        this.doCheck()
        this.dialogFormVisible = false
      }
    },
    async doCheck () {
      try {
        const res = await choiceCheck(this.checkQuestions)
        this.$message.success('审核成功')
        this.loadUserMg() // 更新视图
        console.log(res)
      } catch (err) {
        console.log(err)
        this.$message.error('审核失败')
      }
    },
    // 上下架功能
    hUpDown (id, publishState) {
      // if (publishState === 0) {
      //   publishState = 1
      //   this.upDown = '上架'
      // } else {
      //   publishState = 0
      //   this.upDown = '下架'
      // }
      publishState = publishState ? 0 : 1
      this.upDown = publishState ? '下架' : '上架'
      this.$confirm(`确定要${this.upDown}吗?`, '提示', {
        type: 'warning'
      })
        .then(async () => {
          this.upDownProps.id = id
          this.upDownProps.publishState = publishState
          await choicePublish(this.upDownProps)
            .then(response => {
              this.$message.success(`${this.upDown}成功`)
              this.loadUserMg()
            })
            .catch(response => {
              this.$message.error(`${this.upDown}失败!`)
            })
        })
        .catch(() => {
          this.$message.info('已取消操作!')
        })
    },
    // 改变每页显示的数据条数
    hChangeSize (size) {
      // console.log(size)
      this.requestParameters.pagesize = size
      this.requestParameters.page = 1
      this.loadUserMg()
    },
    // 跳转分页
    hChangePage (curPage) {
      // alert(curPage)
      this.requestParameters.page = curPage
      this.loadUserMg()
    },
    // 删除功能
    hDelete (id) {
      // rows.splice(index, 1)
      // console.log(index)
      this.$confirm('确定要删除吗?', '提示', {
        type: 'warning'
      })
        .then(async () => {
          await remove({ id })
            .then(response => {
              this.$message.success('成功删除')
              this.loadUserMg()
            })
            .catch(response => {
              this.$message.error('删除失败!')
            })
        })
        .catch(() => {
          this.$message.info('已取消操作!')
        })
    },
    // 发请求,拿精选题库列表信息
    async loadUserMg () {
      this.isLoading = true
      try {
        const { data: res } = await choice(this.requestParameters)
        // console.log(res, '精选题库列表信息')
        this.dataList = res.items
        this.counts = res.counts
        // this.alertText = `共${this.counts}条数据`
        this.isLoading = false
      } catch (err) {
        console.log(err)
        this.isLoading = false
      }
    }
  },
  // 涉及到这种数据计算的用计算属性
  computed: {
    alertText () {
      return `共${this.counts}条数据`
    }
  },
  filters: {
    fFormatDifficulty (val) {
      const transformHard = {
        1: '简单',
        2: '一般',
        3: '困难'
      }
      return transformHard[val]
    },
    fFormatCheck (val) {
      const transformCheck = {
        0: '待审核',
        1: '已审核',
        2: '已拒绝'
      }
      return transformCheck[val]
    },
    fFormatQuestionType (val) {
      const transformType = {
        1: '单选',
        2: '多选',
        3: '简答'
      }
      return transformType[val]
    },
    fFormatPublishState (val) {
      const transformState = {
        0: '上架',
        1: '下架'
      }
      return transformState[val]
    }
  }
}
</script>

<style>
  .pagination {
    padding: 25px;
  }
  .alert {
    margin: 10px 0px;
  }
</style>
