<template>
  <div class="container">
    <el-card class="box-card">
      <!-- 面包屑导航 -->
      <div slot="header" class="clearfix" v-if="isShow">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item @click.native="$router.push('/subjects/list')" style="cursor:pointer">学科管理</el-breadcrumb-item>
          <el-breadcrumb-item>{{$route.query.name}}</el-breadcrumb-item>
          <el-breadcrumb-item>目录管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-form :inline="true" :model="form" class="demo-form-inline" >
        <el-form-item label="目录名称">
          <el-input v-model="form.directoryName"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.state" placeholder="请选择">
            <el-option label="启动" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="small" @click="heliminate">清除</el-button>
          <el-button type="primary" @click="hSubmit" size="small" :loading="isloadings">搜索</el-button>
        </el-form-item>
        <el-form-item style="float: right">
         <el-button
          v-if="isShow"
            type="text"
            @click.native="$router.push('/subjects/list')"
          >
            <i class="el-icon-back"></i>返回学科</el-button>
          <el-button icon="el-icon-edit" type="success" @click="hAdd" size="small">新增目录</el-button>
        </el-form-item>
      </el-form>
      <div class="title">
        <i class="el-icon-warning tu"></i> <span>数据一共{{ total }}条</span>
      </div>
      <!-- 表格布局 -->
      <el-table :data="directorysData" style="width: 100%; margin-top: 1em" v-loading="isloading">
        <el-table-column label="序号" width="60" align="center">
          <template slot-scope="scope">
            <p>{{(requestParameters.page-1)* requestParameters.pagesize+(scope.$index + 1) }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="subjectName" label="所属学科" align="center">
        </el-table-column>
        <el-table-column prop="directoryName"  label="目录名称" align="center">
        </el-table-column>
        <el-table-column prop="username" label="创建者" align="center" >
        </el-table-column>
        <el-table-column prop="addDate" label="创建日期" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.addDate | fdate }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="totals"  label="面试题数量" align="center">
        </el-table-column>
        <el-table-column prop="state" label="状态" align="center">
          <template slot-scope="scope">
            <p v-if="scope.row.state == 0">已禁用</p>
            <p v-else>已启动</p>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.state === 0"
              type="text"
              @click="hswitch(scope.row)"
              >启动</el-button>
            <el-button v-else type="text" @click="hswitch(scope.row)"
              >禁用</el-button>
            <el-button
              type="text"
              :disabled="scope.row.state ? true : false"
              @click="hrevise(scope.row.id)"
              >修改</el-button>
            <el-button
              type="text"
              :disabled="scope.row.state ? true : false"
              @click="hDelete(scope.row.id)"
              >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @current-change="hpageChange"
        @size-change="hsizeChange"
        style="margin: 1em 0; float: right"
        background
        :current-page="requestParameters.page"
        :page-sizes="[5, 10, 20, 50]"
        layout="prev, pager, next,sizes, jumper"
        :total="total"
        :disabled ="isloading"
      >
      </el-pagination>
    </el-card>
    <!-- 添加目录弹窗弹窗 -->
    <el-dialog
      title="新增目录"
      :visible.sync="dialogVisible"
      width="30%"
      :append-to-body="true"
      :before-close="handleClose"
    >
      <el-form ref="Form" :model="Form" label-width="80px" :rules="rules">
        <el-form-item label="所属学科" v-if="isShows">
          <!-- 下拉框渲染 -->
          <el-select v-model="Form.subjectID" placeholder="请选择">
            <el-option
              v-for="subject in subjects"
              :key="subject.subjectID"
              :label="subject.subjectName"
              :value="subject.id"
              :before-close="handleClose"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目录名称" prop="directoryName">
          <el-input
            v-model="Form.directoryName"
            placeholder="请输入目录名称"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <div class="choise">
          <div class="sure">
            <el-button @click="hQuite" size="small"
              >取 消</el-button>
            <el-button type="primary" @click="hSure" size="small"
              >确 定</el-button>
          </div>
        </div>
      </span>
    </el-dialog>
    <!-- 修改目录弹窗弹窗 -->
    <el-dialog
      title="修改目录"
      :visible.sync="dialogVisibles"
      width="30%"
      :append-to-body="true"
      :before-close="handleCloses"
    >
      <el-form ref="refform" :model="refform" label-width="80px" :rules="rules">
        <el-form-item label="所属学科" v-if="isShows">
          <!-- 下拉框渲染 -->
          <el-select
            v-model="refform.subjectID"
            placeholder="请选择"
          >
            <el-option
              v-for="subject in subjects"
              :key="subject.subjectID"
              :label="subject.subjectName"
              :value="subject.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目录名称" prop="directoryName">
          <el-input
            v-model="refform.directoryName"
            placeholder="请输入目录名称"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <div class="choise">
          <div class="sure">
            <el-button size="small" @click="hQuite">取 消</el-button>
            <el-button type="primary" @click="hsend" size="small">确 定</el-button>
          </div>
        </div>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { list, changeState, add, remove, detail, update } from '@/api/hmmm/directorys'
import { list as studylist } from '@/api/hmmm/subjects'
export default {
  data () {
    return {
      isloadings: false, // 控制搜索按钮是否产生loading效果
      isloading: false, // 控制页面是否产生loading效果
      isShows: true, // 控制弹窗是否显示学科
      isShow: false, // 是否显示面包屑导航等信息
      // 表单验证
      rules: {
        directoryName: [
          { required: true, message: '请输入目录名称', trigger: 'blur' }
        ],
        subjectName: [{ required: true, message: '', trigger: 'blur' }]
      },
      id: '', // 相应标签对应的id值
      dialogVisible: false, // 添加目录是否开启弹窗
      dialogVisibles: false, // 修改目录是否开启弹窗
      total: 0, // 页码总数
      subjects: [], // 学科
      // 修改弹窗
      refform: {
        directoryName: '', // 目录名称
        subjectID: '' // 所属学科
      },
      // 添加窗口
      Form: {
        directoryName: '', // 目录名称
        subjectID: '' // 所属学科
      },
      // 搜索表单数据
      form: {
        directoryName: '', // 目录名称
        state: null // 状态
      },
      // 请求参数数据
      requestParameters: {
        page: 1,
        pagesize: 10,
        subjectID: this.$route.query.id || null
      },
      // tabel表单接收的数据
      directorysData: []
    }
  },
  watch: {
    '$route' () {
      this.requestParameters.subjectID = null
      this.hload()
      this.loadDirectory()
    }
  },
  filters: {
    // 使用过滤器修改日期样式
    fdate (val) {
      const date = new Date(val)
      const y = date.getFullYear()
      const m = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      const d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      const h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
      const f = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
      const s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      return y + '-' + m + '-' + d + '  ' + h + ':' + f + ':' + s
    }
  },
  methods: {
    hQuite () {
      this.dialogVisible = false
      this.dialogVisibles = false
      // 清空数据
      this.refform.subjectID = null
      this.Form.subjectID = null
      this.$refs.Form.resetFields()
      this.$refs.refform.resetFields()
    },
    handleClose (done) {
      if (this.Form.directoryName !== '' || this.Form.subjectID !== '') {
        this.$confirm('有数据未提交，确定关闭吗').then(() => {
          this.$refs.Form.resetFields()
          this.Form.subjectID = null
          done()
        }).catch(() => {
          console.log('点击确定时触发')
        })
      } else {
        this.isloadings = false
      }
    },
    handleCloses (done) {
      if (this.refform.directoryName !== '' || this.refform.subjectID !== '') {
        this.$confirm('有数据未提交，确定关闭吗').then(() => {
          this.$refs.refform.resetFields()
          this.refform.subjectID = null
          done()
        }).catch(() => {
          console.log('点击确定时触发')
        })
      } else {
        this.isloading = false
      }
    },
    // 修改目录
    hrevise (id) {
      this.dialogVisibles = true
      // 获取相应id目录详情
      this.hpost(id)
      this.id = id
      console.log(id)
    },
    // 发送请求获取所属id对应的目录名称
    async hpost (id) {
      const res = await detail({ id })
      // 给目录赋值,数显数据回填
      this.refform.directoryName = res.data.directoryName
      this.refform.subjectID = res.data.subjectID
      // 获取学科列表
      this.hstudy()
    },
    // 发送请求获取学科列表
    async hstudy () {
      const res = await studylist()
      this.subjects = res.data.items
    },
    // 发送请求实现修改目录功能
    async hsend () {
      // 进行表单验证，判断表单验证是否成功
      this.$refs.refform.validate(valid => {
        if (valid) {
          // 发请求更新列表
          this.hupdate()
        }
      })
    },
    // 进行更新目录
    async hupdate () {
      const data = {
        id: this.id,
        subjectID: this.refform.subjectID,
        directoryName: this.refform.directoryName
      }
      try {
        const res = await update(data)
        console.log(res)
        // 加载页面
        this.loadDirectory()
        this.$message.success('操作成功')
        // 关闭弹窗
        this.dialogVisibles = false
      } catch (err) {
        this.$message.error('操作失败')
        this.dialogVisibles = true
      }
    },
    // 添加新目录
    hAdd () {
      this.dialogVisible = true
      this.hstudy()
      // 将页码修改成当前页
      this.requestParameters.page = 1
      // 重新渲染页面
      this.loadDirectory()
      // 判断是否为学科页面
      if (this.$route.name) {
        // 点击之后对数据进行清空
        this.Form.directoryName = null
      } else {
        this.Form.directoryName = null
        this.Form.subjectID = null
      }
    },
    // 弹框确认添加
    hSure () {
      // 确保表单验证成功
      this.$refs.Form.validate((valid) => {
        if (valid) {
          this.hSubdate()
          this.loadDirectory()
          // 清空表单数据
          this.Form.subjectID = null
        }
      })
    },
    // 发送请求添加目录
    async hSubdate () {
      console.log(this.Form.subjectID)
      const data = {
        subjectID: this.Form.subjectID,
        directoryName: this.Form.directoryName
      }
      try {
        const res = await add(data)
        console.log(res)
        this.dialogVisible = false
        this.$message.success('操作成功')
      } catch (err) {
        console.log(err)
        this.dialogVisible = true
      }
    },
    // 清除表单数据
    heliminate () {
      this.form.state = null
      this.form.directoryName = null
      this.requestParameters.state = this.form.state
      this.requestParameters.directoryName = this.form.directoryName
      // 重新发送请求
      this.loadDirectory()
    },
    // 实现删除效果
    hDelete (id) {
      // 1.询问是否要删除吗
      this.$confirm('此操作将永久删除该目录, 是否继续?', {
        type: 'warning'
      }).then(async () => {
        const res = await remove({ id })
        console.log(res)
        this.$message.success('删除成功')
        // 2.重新渲染页面
        this.loadDirectory()
      }).catch(() => {})
    },
    // 实现pagesize改变效果
    hsizeChange (pagesize) {
      // 将分页页数换成当前每页页数
      this.requestParameters.pagesize = pagesize
      // 重新发请求加载页面
      this.loadDirectory()
    },
    // 实现分页效果
    hpageChange (page) {
      // 将页码换成当前页
      this.requestParameters.page = page
      // 重新发请求加载页面
      this.loadDirectory()
    },
    // 实现状态切换
    async hswitch (row) {
      row.state = row.state === 0 ? 1 : 0
      try {
        const res = await changeState({ id: row.id, state: row.state })
        console.log(res)
        this.$message.success('操作成功')
      } catch (err) {
        console.log(err)
        this.$message.error('操作失败')
      }
      // 重新渲染页面
      this.loadDirectory()
    },
    async hSubmit () {
      // 实现请除空格
      if (this.form.directoryName) {
        this.form.directoryName = this.form.directoryName.replaceAll(' ', '')
      }
      this.isloading = true
      this.isloadings = true
      this.requestParameters.state = this.form.state
      console.log(1, this.requestParameters.state)
      this.requestParameters.directoryName = this.form.directoryName
      // 将页码修改成当前页
      this.requestParameters.page = 1
      try {
        console.log(this.requestParameters)
        const res = await list(this.requestParameters)
        console.log(res)
        // 将获取到的数据存入directorysData
        this.directorysData = res.data.items
        // 修改分页的总页数
        this.total = res.data.counts
      } catch (err) {
        console.log(err)
      }
      this.isloading = false
      this.isloadings = false
    },
    // 加载目录数据
    async loadDirectory () {
      this.isloading = true
      try {
        const res = await list(this.requestParameters)
        console.log(res)
        // 将获取到的数据存入directorysData
        this.directorysData = res.data.items
        // 修改分页的总页数
        this.total = res.data.counts
      } catch (err) {
        console.log(err)
      }
      this.isloading = false
    },
    hload () {
      if (this.$route.query.name) {
        this.isShow = true
        this.isShows = false
        this.Form.subjectID = Number(this.$route.query.id)
      } else {
        this.isShow = false
        this.isShows = true
      }
    }
  },
  // 钩子函数首先进行页面渲染
  created () {
    this.loadDirectory()
    this.hload()
  }
}
</script>
<style scoped >
.container {
  padding: 10px;
}
.first {
  color: #000;
}
.title {
  width: 100%;
  padding: 8px;
  background-color: rgb(244, 244, 245);
  font-size: 14px;
  color: rgb(144, 147, 153);
  border-radius: 5px;
}
.tu {
  margin-right: 5px;
}
.container /deep/ .demo-form-inline .el-input__inner {
  height: 33px;
  line-height: 33px;
}
.choise {
  position: relative;
}
.el-dialog__wrapper .el-form-item__content .el-select {
  width: 100%;
}
.choise .sure {
  position: absolute;
  right: 0;
  bottom: 5px;
}
.container /deep/.show {
  display: none;
}
</style>
