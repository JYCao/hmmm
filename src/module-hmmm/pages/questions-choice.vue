<template>
  <div class='container'>
    <el-card class="box-card">
      <el-form  label-width="80px">
        <el-row style="margin-bottom: 15px">
          <el-col class="msg">
            说明:目前支持学科和关键字条件筛选
          </el-col>
          <el-col :offset="22">
            <el-button  type="success" icon="el-icon-edit" size="mini" @click="$router.push('new')">新增试题</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="学科">
              <el-select v-model="form.subjectID" placeholder="请选择" @change="hChangeSubjectID">
                <el-option
                 v-for="sub in subjectList"
                 :key="sub.value"
                 :label="sub.label"
                 :value="sub.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="二级目录">
              <el-select v-model="form.directory" placeholder="请选择">
                <el-option
                 v-for="dir in directoryList"
                 :key="dir.value"
                 :label="dir.label"
                 :value="dir.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="标签">
              <el-select v-model="form.tag" placeholder="请选择">
                <el-option
                 v-for="tag in tagList"
                 :key="tag.value"
                 :label="tag.label"
                 :value="tag.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="关键字">
              <el-input v-model="form.keyword" placeholder="根据题干搜索"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="6">
            <el-form-item label="试题类型">
                  <el-select v-model="form.select" placeholder="请选择">
                    <el-option label="单选" :value="1" ></el-option>
                    <el-option label="多选" :value="2" ></el-option>
                    <el-option label="简单" :value="3" ></el-option>
                  </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="难度">
              <el-select v-model="form.hard" placeholder="请选择">
                <el-option label="简单" :value="1" ></el-option>
                <el-option label="一般" :value="2" ></el-option>
                <el-option label="困难" :value="3" ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="方向">
              <el-select v-model="form.direct" placeholder="请选择">
                <el-option
                  v-for="dir in directionList"
                  :key="dir"
                  :label="dir"
                  :value="dir">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="录入人">
              <el-select v-model="form.superUser" placeholder="请选择">
                <el-option label="超级管理员" value="lalal"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="6">
            <el-form-item label="题目备注">
              <el-input v-model="form.remark"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="企业简称">
              <el-input v-model="form.company"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="城市">
              <el-row>
                <el-col :span="12" style="padding-right:5px">
                  <el-select v-model="form.citys" placeholder="请选择" @change="hChangeCity">
                    <el-option
                      v-for="city in cityList"
                      :key="city"
                      :label="city"
                      :value="city">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="12" style="padding-left:5px">
                  <el-select v-model="form.area" placeholder="请选择">
                    <el-option
                      v-for="area in areaList"
                      :key="area"
                      :label="area"
                      :value="area">
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item style="float: right">
                  <el-button size="mini" @click="hReset">重置</el-button>
                  <el-button type="primary" size="mini" @click="hSearch">搜索</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-tabs v-model="activeName" type="card" @tab-click="hChangeTab">
        <el-tab-pane label="全部" name="3">
          <my-table v-if="activeName==='3'" :isSearch="isSearch" :chkState="chkState" :subjectID="form.subjectID" :keyword="form.keyword"></my-table>
        </el-tab-pane>
        <el-tab-pane label="待审核" name="0">
          <my-table v-if="activeName==='0'" :isSearch="isSearch" :chkState="chkState" :subjectID="form.subjectID"></my-table>
        </el-tab-pane>
        <el-tab-pane label="已审核" name="1">
          <my-table v-if="activeName==='1'" :isSearch="isSearch" :chkState="chkState" :subjectID="form.subjectID"></my-table>
        </el-tab-pane>
        <el-tab-pane label="已拒绝" name="2">
          <my-table v-if="activeName==='2'" :isSearch="isSearch" :chkState="chkState" :subjectID="form.subjectID"></my-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
// 学科简单列表
import { simple } from '@/api/hmmm/subjects.js'
// 目录简单列表
import { simple as getDirectorys } from '@/api/hmmm/directorys.js'
// 标签简单列表
import { simple as getTags } from '@/api/hmmm/tags.js'
// 方向
import { direction } from '@/api/hmmm/constants.js'
// 城市
import { provinces, citys } from '@/api/hmmm/citys.js'
// 表格组件
import MyTable from '@/module-hmmm/pages/questions-choice-table/table.vue'
export default {
  name: 'Seclection',
  // 引入表格组件
  components: {
    MyTable
  },
  data () {
    return {
      form: {
        subjectID: null, // 学科id,用于给子组件传参
        keyword: '', // 关键字,用于给条件检索
        directory: '', // 目录列表的id
        tag: '', // 标签列表的id
        select: '', // 试题选择单多选
        hard: '', // 试题难度选择
        direct: '', // 方向
        superUser: '', // 录入人
        citys: '', // 城市
        area: '', // 地区
        remark: '', // 题目备注
        company: '' // 企业简称
      },
      chkState: null, // 标签切换,传入的参数
      activeName: '3', // 激活态在全部标签上
      isSearch: true, // 点击搜索,值改变,传给父组件监听,完成搜索
      subjectList: [], // 学科简单列表
      directoryList: [], // 目录简单列表
      tagList: [], // 标签简单列表
      directionList: direction, // 方向列表
      cityList: provinces(), // 城市列表
      areaList: [] // 地区列表
    }
  },
  created () {
    this.loadSubject()
  },
  methods: {
    // // 时间加零
    // addZero (n) {
    //   return n < 10 ? '0' + n : n
    // },
    // 城市选中值发生变化时候触发
    hChangeCity (e) {
      this.areaList = citys(e)
      // console.log(citys(e))
    },
    // 学科选中值变化时候触发
    hChangeSubjectID () {
      this.form.directory = null // 学科切换,清空二级目录
      this.form.tag = null // 学科切换,清空标签
      this.loadDirectory()
      this.loadTags()
    },
    // 根据关键字还有学科进行条件筛选
    hSearch () {
      this.form.keyword = this.form.keyword.replaceAll(' ', '')
      this.isSearch = !this.isSearch
    },
    // 清除表单内容,更新视图
    hReset () {
      for (const key in this.form) {
        // key = null
        this.form[key] = null
      }
      this.isSearch = !this.isSearch
      this.directoryList = []
      this.tagList = []
      this.areaList = []
    },
    // tab切换,传入状态参数,执行函数
    hChangeTab () {
      // console.log(Number(this.activeName))
      this.chkState = Number(this.activeName)
      if (this.chkState === 3) {
        this.chkState = null
      }
    },
    // 发请求,学科列表数据
    async loadSubject () {
      try {
        const { data: res } = await simple()
        // console.log(res, '学科简单列表')
        this.subjectList = res
      } catch (err) {
        console.log(err)
      }
    },
    // 发请求,目录列表数据
    async loadDirectory () {
      try {
        const { data: res } = await getDirectorys({ subjectID: this.form.subjectID })
        // console.log(res, '目录简单列表')
        this.directoryList = res
      } catch (err) {
        console.log(err)
      }
    },
    // 发请求,标签列表数据
    async loadTags () {
      try {
        const { data: res } = await getTags({ subjectID: this.form.subjectID })
        // console.log(res, '标签简单列表')
        this.tagList = res
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style scoped rel="stylesheet/scss" lang="scss">
  .msg {
    font-size: 12px;
    color: #ffc0cb;
  }
</style>
