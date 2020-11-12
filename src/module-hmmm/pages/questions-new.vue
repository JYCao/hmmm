<template>
  <div class="container">
    <!-- 卡片 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 头部区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>{{
            $route.query.id ? "试题修改" : "试题录入"
          }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 内容区域 -->
      <!-- 表单区域 -->
      <el-form ref="refform" :rules="rules" :model="form" label-width="120px">
        <!-- 下拉框 -->
        <el-form-item label="学科：" prop="subjectID">
          <el-select
            v-model="form.subjectID"
            placeholder="请选择"
            @change="hsubchange(form.subjectID)"
          >
            <el-option
              v-for="sub in subject.subjectList"
              :key="sub.value"
              :label="sub.label"
              :value="sub.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目录：" prop="catalogID">
          <el-select v-model="form.catalogID" placeholder="请选择">
            <el-option
              v-for="cat in subject.catalogList"
              :key="cat.value"
              :label="cat.label"
              :value="cat.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业：" prop="enterpriseID">
          <el-select v-model="form.enterpriseID" placeholder="请选择">
            <el-option
              v-for="enter in enterpriseList"
              :key="enter.id"
              :label="enter.company"
              :value="enter.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="城市：" prop="province" class="inline">
          <el-select
            v-model="form.province"
            placeholder="请选择"
            @change="handleCity"
          >
            <el-option
              v-for="(item, index) in citySelect.province"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="city" class="inline err">
          <el-select
           style="margin-left:-100px"
            v-model="form.city"
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in citySelect.cityDate"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="方向：" prop="direction">
          <el-select v-model="form.direction" placeholder="请选择">
            <el-option
              v-for="(item, index) in directionList"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 单选框 -->
        <el-form-item label="题型：" prop="questionType">
          <el-radio-group v-model="form.questionType">
            <el-radio label="1">单选</el-radio>
            <el-radio label="2">多选</el-radio>
            <el-radio label="3">简答</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="难度：" prop="difficulty">
          <el-radio-group v-model="form.difficulty">
            <el-radio label="1">简单</el-radio>
            <el-radio label="2">一般</el-radio>
            <el-radio label="3">困难</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 题干   富文本编辑器 -->
        <el-form-item label="题干：" prop="question">
          <quill-editor
            v-model="form.question"
            :options="editorOption"
          ></quill-editor>
        </el-form-item>
        <!-- 单选框 -->
        <el-form-item label="选项：" v-if="form.questionType === '1'">
          <el-radio-group v-model="singleoptions">
            <div>
              <el-radio label="A" name="type">
                A： <el-input v-model="form.options[0].title"></el-input>
                <el-upload
                  class="avatar-uploader"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                >
                  <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                  <span>上传图片 </span>
                </el-upload>
                <i class="el-icon-circle-close" @click="handleRemove"></i>
              </el-radio>
            </div>
            <div>
              <el-radio label="B" name="type">
                B： <el-input v-model="form.options[1].title"></el-input>
                <el-upload
                  class="avatar-uploader"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                >
                  <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                  <span>上传图片 </span>
                </el-upload>
                <i class="el-icon-circle-close" @click="handleRemove"></i>
              </el-radio>
            </div>
            <div>
              <el-radio label="C" name="type">
                C： <el-input v-model="form.options[2].title"></el-input>
                <el-upload
                  class="avatar-uploader"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                >
                  <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                  <span>上传图片 </span>
                </el-upload>
                <i class="el-icon-circle-close" @click="handleRemove"></i>
              </el-radio>
            </div>
            <div>
              <el-radio label="D" name="type">
                D： <el-input v-model="form.options[3].title"></el-input>
                <el-upload
                  class="avatar-uploader"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                >
                  <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                  <span>上传图片 </span>
                </el-upload>
                <i class="el-icon-circle-close" @click="handleRemove"></i>
              </el-radio>
            </div>
          </el-radio-group>
          <!-- 注意点，所有的单选框都应该在一个el-radio-group里面 -->
          <el-row>
            <el-button disabled type="danger">+增加选项与答案</el-button>
          </el-row>
        </el-form-item>
        <!-- 多选框 使用循环遍历数组，来显示 -->
        <el-form-item label="选项：" v-if="form.questionType === '2'">
          <el-checkbox-group v-model="multipleoptions">
            <!-- 使用div包起来 -->
            <div v-for="option in form.options" :key="option.code">
              <el-checkbox :label="option.code" name="type1">
                {{ option.code }}： <el-input v-model="option.title"></el-input>
                <el-upload
                  class="avatar-uploader"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                >
                  <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                  <span>上传图片 </span>
                </el-upload>
                <i class="el-icon-circle-close" @click="handleRemove"></i>
              </el-checkbox>
            </div>
          </el-checkbox-group>
          <el-row>
            <!-- 点击添加的时候，给option数组加一条数据，因为前四个选项也是遍历option数组得到的 -->
            <el-button type="danger" @click="haddOption"
              >+增加选项与答案</el-button
            >
          </el-row>
        </el-form-item>
        <!-- 解析视频 -->
        <el-form-item label="解析视频：">
          <el-input v-model="form.videoURL"></el-input>
        </el-form-item>
        <!-- 答案解析   富文本编辑器 -->
        <el-form-item label="答案解析：" prop="answer">
          <quill-editor
            v-model="form.answer"
            :options="editorOption"
          ></quill-editor>
        </el-form-item>
        <!-- 题目备注 -->
        <el-form-item label="题目备注：" prop="remarks">
          <el-input type="textarea" v-model="form.remarks"></el-input>
        </el-form-item>
        <el-form-item label="试题标签：" prop="tags">
          <el-select v-model="form.tags" placeholder="请选择试题标签">
            <el-option
              v-for="tag in subject.tagList"
              :key="tag.value"
              :label="tag.label"
              :value="tag.label"
            ></el-option>
            <!-- 注意标签的：value值，是字符串 -->
          </el-select>
        </el-form-item>
        <!-- 确认提交 -->
        <el-form-item>
          <el-button v-if="!$route.query.id" type="primary" @click="hSubmit"
            >确认提交</el-button
          >
          <el-button type="primary" @click="hconfirm($route.query.id)" v-else
            >确认修改</el-button
          >
          <!-- <el-button>取消</el-button> -->
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
// 导入样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 导入组件
import { quillEditor } from 'vue-quill-editor'
// 引入
import { simple } from '@/api/hmmm/subjects.js'
import { simple as catalog } from '@/api/hmmm/directorys.js'
import { simple as tags } from '@/api/hmmm/tags.js'
import { list } from '@/api/hmmm/companys.js'
import { provinces, citys } from '@/api/hmmm/citys.js'
import { direction, questionType, difficulty } from '@/api/hmmm/constants.js'
import { add, update, detail } from '@/api/hmmm/questions.js'
export default {
  name: 'question-new',
  components: {
    quillEditor
  },
  data () {
    return {
      imageUrl: '',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      // 富文本配置对象
      editorOption: {
        // 占位配置
        placeholder: '',
        modules: {
          // 配置工具栏
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'], // 加粗，斜体，下划线
            ['blockquote', 'code-block'], // 块引用 代码块
            // [{ header: 1 }, { header: 2 }],
            [{ list: 'ordered' }, { list: 'bullet' }], // 有序列表，无序列表
            // [{ indent: '-1' }, { indent: '+1' }], // 缩进
            ['image']
            // [{ script: 'sub' }, { script: 'super' }]// 脚本上面，脚本下面，平方
          ]
        }
      },
      enterpriseList: [], // 企业列表
      directionList: [], // 方向列表
      questionTypeList: [], // 题型
      difficultyList: [], // 难度
      // 学科相关
      subject: {
        subjectList: [], // 学科列表
        catalogList: [], // 目录列表
        tagList: [] // 试题标签列表
      },
      citySelect: {
        province: [], // 省
        cityDate: [] // 市
      },
      singleoptions: '', // 如果是单选，选中的结果
      multipleoptions: [], // 如果是多选，选中的结果就是数组
      form: {
        id: null,
        number: '', // 试题编号 后台自动生成（忽略）
        subjectID: '', // 学科
        catalogID: '', // 目录
        enterpriseID: '', // 企业
        province: '', //  省市
        city: '', // 城市
        direction: '', // 方向
        questionType: '1', // 题型
        difficulty: '1', // 难度
        question: '', // 题干
        options: [
          // 选项是数组包对象的格式。选项是数组，要注意，这里先写假设有选项的所有情况
          {
            // 多选选项
            code: 'A', // 代码
            title: 'A的内容', // 标题
            img: '', // 图片URL
            isRight: false // 是否正确答案
          },
          {
            // 多选选项
            code: 'B', // 代码
            title: 'B的内容', // 标题
            img: '', // 图片URL
            isRight: false // 是否正确答案
          },
          {
            // 多选选项
            code: 'C', // 代码
            title: 'C的内容', // 标题
            img: '', // 图片URL
            isRight: false // 是否正确答案
          },
          {
            // 多选选项
            code: 'D', // 代码
            title: 'D的内容', // 标题
            img: '', // 图片URL
            isRight: false // 是否正确答案
          }
        ],
        videoURL: '', // 解析视频
        answer: '', // 答案解析
        remarks: '', // 题目备注
        tags: '', // 试题标签
        isPerfect: '' // 是否精选题 后台自动生成（忽略）
      },
      // 表单验证
      rules: {
        subjectID: [
          { required: true, message: '请选择学科', trigger: 'change' }
        ],
        catalogID: [
          { required: true, message: '请选择目录', trigger: 'change' }
        ],
        enterpriseID: [
          { required: true, message: '请选择企业', trigger: 'change' }
        ],
        province: [
          { required: true, message: '请选择省份', trigger: 'change' }
        ],
        city: [{ required: true, message: '请选择地区', trigger: 'change' }],
        direction: [
          { required: true, message: '请选择方向', trigger: 'change' }
        ],
        questionType: [
          { required: true, message: '请选择题型', trigger: 'change' }
        ],
        difficulty: [
          { required: true, message: '请选择难度', trigger: 'change' }
        ],
        answer: [
          { required: true, message: '请输入答案解析', trigger: 'blur' }
        ],
        question: [{ required: true, message: '请输入题干', trigger: 'blur' }],
        remarks: [
          { required: true, message: '请输入题目备注', trigger: 'blur' }
        ],
        tags: [{ required: true, message: '请选择标签', trigger: 'change' }]
      }
    }
  },
  created () {
    //  加载学科列表和企业列表和省份和方向和难度和题型，然后省份带动城市，然后改变学科的时候，带动目录和标签
    // 做完上面的获取数据之后，就要通过$route.query.id做判断，判断是编辑页还是添加页。编辑页的话，就要获取详情
    this.load()
    this.getProvinceData()
    this.directionList = direction
    this.questionTypeList = questionType
    this.difficultyList = difficulty
    // 编辑页还是添加页，是要做判断
    // 如果是编辑页，就要执行下面代码
    console.log('this.$route.query.id', this.$route.query.id)
    if (this.$route.query.id) {
      // alert(this.$route.query.id)
      // 发请求，获取详情
      this.getdetail(this.$route.query.id)
    }
  },
  methods: {
    // 修改试题之后，提交的时候，先做验证
    hconfirm (id) {
      // 先验证，然后发请求
      this.$refs.refform.validate((valid) => {
        console.log(valid)
        if (valid) {
          this.verify()
          this.onConfirm(id)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 试题修改验证成功之后，发送请求，修改试题
    async onConfirm (id) {
      console.log('id', id)
      //  因为要传递id过去，所以在数据项中添加id，初始值为null。因为null是不会在axios请求中展示的
      // this.form.id = id
      this.form.id = Number(id)
      // 注意这里的18是字符串，不是数字，所以要转换格式
      console.log(this.form.id)
      const res = await update(this.form)
      this.$message.success('修改试题成功')
      console.log(res)
      // 试题修改成功之后，跳转页面
      this.$router.push('list')
    },
    // 编辑页的时候，通过id获取详情
    async getdetail (id) {
      // 获取详情id之后，在获取到学科，传递学科id过来
      // 获取详情页
      const res = await detail({ id })
      console.log('获取试题详情成功')
      console.log(res)
      this.hsubchange(res.data.subjectID)
      // 注意：要测试使用什么id的时候，要看数据库中有什么id
      // 然后就可以请求成功，然后数据回填
      this.form = res.data
      // 获取数据成功之后，从后端获取回来的数据，要修改options数组，因为我们之前的options数组是假设的，所以获取到之后，要赋值回去
      // this.form.options=res.data.options数组
      // this.form.options = res.data.options
      // 修改options数组的顺序

      //  var arr = []
      var arr = res.data.options
      arr.forEach((item) => {
        item.code = item.code.charCodeAt()
      })
      console.log(arr)

      // 指定排序的比较函数
      function compare (property) {
        return function (obj1, obj2) {
          var value1 = obj1[property]
          var value2 = obj2[property]
          return value1 - value2 // 升序
        }
      }
      var sortObj = arr.sort(compare('code'))
      console.log(sortObj)

      arr.forEach((item) => {
        item.code = String.fromCharCode(item.code)
      })
      console.log(arr)
      this.form.options = arr

      // 然后更新选中的结果，要使用数组的遍历方法，来过滤,之后在map
      // 多选的时候
      if (this.form.questionType === '2') {
        console.log('this.multipleoptions', this.multipleoptions)
        this.multipleoptions = this.form.options
          .filter((item) => item.isRight)
          .map((item) => item.code)
        console.log('this.multipleoptions', this.multipleoptions)
      }
      // 单选的时候
      if (this.form.questionType === '1') {
        console.log('this.singleoptions', this.singleoptions)
        this.singleoptions = this.form.options
          .filter((item) => item.isRight)
          .map((item) => item.code)[0]
        // 这里注意，数据回填的时候，单选不是数组
        console.log('this.singleoptions', this.singleoptions)
      }
    },
    // 这样之后，就会把选中的结果显示在页面
    haddOption () {
      // 将字母转为ascii码的方法：
      // var str = 'A'
      // str.charCodeAt() // 65
      // 将ascii码转为对应字母的方法：
      // var num = 65
      // String.fromCharCode(num) // 'A'
      // 点击的时候，给options数组添加一条数据(这条数据是一个对象)
      // 使用数组的长度和转ascli码的方法
      this.form.options.push({
        code: String.fromCharCode(65 + this.form.options.length), // 代码 使用js获取ascll码   将ascii码转为对应字母的方法：
        title: '内容', // 标题
        img: '', // 图片URL
        isRight: false // 添加的默认是false
      })
    },
    // 获取省
    getProvinceData: function () {
      this.citySelect.province = provinces()
      console.log(this.citySelect.province)
    },
    // 选省获取到市,传递参数过来,不用传递参数过来，直接写参数即可
    handleCity: function (e) {
      console.log(e)
      this.form.city = ''
      this.citySelect.cityDate = citys(e)
      // this.form.city = this.citySelect.cityDate[0]
      console.log(this.citySelect.cityDate)
    },
    // 学科带动目录和标签
    async hsubchange (subjectID) {
      this.form.catalogID = ''
      this.form.tags = ''
      // 学科发生改变的时候，获取目录
      // 首先获取接口需要的参数
      console.log(subjectID)
      // 传递id过来，然后看接口，发请求
      const data = {
        subjectID
      }
      const res = await catalog(data)
      console.log('获取目录列表成功')
      console.log(res)
      this.subject.catalogList = res.data
      const result = await tags(data)
      console.log('获取标签名称列表成功')
      console.log(result)
      this.subject.tagList = result.data
    },
    // 加载学科列表和企业列表
    async load () {
      const res = await simple()
      console.log('获取学科列表成功')
      console.log(res)
      // 获取数据之后，赋值回到初始数据项中
      this.subject.subjectList = res.data
      // 获取企业列表
      const result = await list()
      console.log('获取企业列表成功')
      console.log(result)
      // 获取数据之后，赋值回到初始数据项中
      this.enterpriseList = result.data.items
    },
    // 发送请求提交，添加试题
    async onSubmit () {
      // console.log('submit!')
      // 提交的时候，首先获取参数，
      // 然后组装options数组里面的参数，因为要确定哪一个是正确答案，哪一个是错误答案
      // 如何看哪一个是正确答案，就是通过看选中的是哪一个，选中的就是正确答案
      // 是否是正确答案isright：true，就要取决于是否选中，是否选中在多选还是单选中，
      // 所以操作，就是遍历options数组
      console.log('this.form.options', this.form.options)
      console.log(this.form)
      // 发请求
      const res = await add(this.form)
      this.$message.success('试题录入成功')
      console.log(res)
      // 录入成功之后，跳转页面
      this.$router.push('list')
    },
    // 提交的时候，首先表单验证，然后发送请求提交
    hSubmit () {
      // 点击提交的时候，首先验证
      this.$refs.refform.validate(valid => {
        console.log(valid)
        if (valid) {
          // alert('submit!')
          // 当验证通过的时候，发请求，才添加试题
          this.verify()
          this.onSubmit()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 在添加和修改试题，提交的时候，都要做的验证
    verify () {
      if (this.form.questionType === '1') {
        // 如果是单选框，就要将数据用户选中的数据填回去
        this.form.options.forEach((item) => {
          // 看数组中的每一项中是否有这一项，如果有就是true，没有就是false。multipleoptions=['A','B','D']
          if (item.code === this.singleoptions) {
            item.isRight = true
          } else {
            item.isRight = false
          }
        })
      }
      // 注意的点，题型和难度都是字符串
      if (this.form.questionType === '2') {
        // 如果是多选框，就要
        this.form.options.forEach((item) => {
          // 看数组中的每一项中是否有这一项，如果有就是true，没有就是false。multipleoptions=['A','B','D']
          item.isRight = this.multipleoptions.includes(item.code)
        })
      }
      if (this.form.questionType === '3') {
        // 如果是多选框，就要
        this.form.options = []
      }
    },
    // 移除图片
    handleRemove (file, fileList) {
      // console.log(file, fileList)
      this.$confirm('确定删除图片吗?', '提示', {
        type: 'warning'
      })
        .then(() => {
          this.imageUrl = ''
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 图片上传成功之后
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    // 图片上传之前，要先验证
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
// 编辑的时候，首先获取id，然后数据回填，获取到的options数组中的每一项中的isright：true，然后将是true的放在multipleoption里面或者放在singleoption里面
</script>
<style scoped lang='less'>
.el-radio-button__inner,
.el-radio-group {
  display: block;
}
.text {
  font-size: 14px;
}
.item {
  margin-bottom: 18px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
// 在父组件中去设置子组件的样式，加上/deep/ 实现穿透功能
.container /deep/ .ql-editor {
  height: 200px;
}
// 如何修改第三方样式，给当前标签添加一个类名，然后第三方中自带属性，然后我们使用属性选择器，
.avatar-uploader[data-v-469553e3] {
  display: inline-block;
  vertical-align: middle;
  text-align: center;
  margin-left: 5px;
  border: 1px dashed #d9d9d9;
  height: 70px;
  line-height: 70px;
  width: 110px;
  border-radius: 6px;
  position: relative;
  overflow: hidden;
}
.el-icon-circle-close[data-v-469553e3] {
  position: absolute;
  font-size: 20px;
}
.el-upload img {
  width: 100%;
  height: 100%;
}
.avatar-uploader .el-upload {
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.inline,.el-form-item__content {
  display: inline-block;
}
.container /deep/ .err .el-form-item__error {
  margin-left: -100px;
}
</style>
