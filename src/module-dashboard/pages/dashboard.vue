<template>
  <div class="dashboard-container">
    <el-row :gutter="20" >
      <el-col :xs="24" :sm="6" :span="6">
        <el-card class="box-card" :body-style="{ padding: '5px 20px' , minHeight: '230px' }">
          <div class="header">
            <span>总体重</span>
            <el-tooltip class="item" effect="dark" content="指标说明" placement="top">
              <i class="el-icon-warning"></i>
            </el-tooltip>
          </div>
          <div class="total">
            260,560kg
          </div>
          <div class="trends">
            <span>周同比 12% <i class="el-icon-caret-top"></i></span>
            <span>日环比 11% <i class="el-icon-caret-bottom"></i></span>
          </div>
          <div class="hr"></div>
          <div class="footer">
            <span>日体重数量</span> <span>12,423kg</span>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="6" :span="6">
        <el-card class="box-card" :body-style="{ padding: '5px 20px' , minHeight: '230px' }">
          <div class="header">
            <span>减肥方向</span>
            <el-tooltip class="item" effect="dark" content="指标说明" placement="top">
              <i class="el-icon-warning"></i>
            </el-tooltip>
          </div>
          <div class="chart">
            <raddar-chart></raddar-chart>
          </div>
          <div class="hr"></div>
          <div class="footer">
            <span>已减数量</span> <span>10,234kg</span>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="6" :span="6">
        <el-card class="box-card" :body-style="{ padding: '5px 20px' , minHeight: '230px' }">
          <div class="header">
            <span>小组每日饭量统计</span>
            <el-tooltip class="item" effect="dark" content="指标说明" placement="top">
              <i class="el-icon-warning"></i>
            </el-tooltip>
          </div>
          <div class="chart">
            <pie-chart></pie-chart>
          </div>
          <div class="hr"></div>
          <div class="footer">
            <span>每日饭量总数</span> <span>5,234</span>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="6" :span="6">
        <el-card class="box-card" :body-style="{ padding: '5px 20px' , minHeight: '230px' }">
          <div class="header">
            <span>小组每日体重统计</span>
            <el-tooltip class="item" effect="dark" content="指标说明" placement="top">
              <i class="el-icon-warning"></i>
            </el-tooltip>
          </div>
          <div class="chart">
            <bar-chart></bar-chart>
          </div>
          <div class="hr"></div>
          <div class="trends">
            <span>上周新增总量</span>
            <span>1,234</span>
            <!-- <span>日环比 11% <i class="el-icon-caret-bottom"></i></span> -->
          </div>
        </el-card>
      </el-col>
    </el-row>

    <br>
    <!-- 销售表 -->
    <el-card class="sales-card">
      <div class="header">
        <!-- <el-date-picker
          v-model="datePicker"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions2">
        </el-date-picker> -->
        前端与java学科试题走势图
      </div>
      <el-tabs v-model="activeName" @tab-click="handleSetLineChartData">
        <el-tab-pane label="每日体重统计" name="newVisitis"></el-tab-pane>
        <el-tab-pane label="明日体重预算" name="messages"></el-tab-pane>
        <el-row :gutter="20">
          <el-col :xs="24" :sm="16">
            <div class="chart">
              <line-chart :chartData="lineChartData"></line-chart>
            </div>
          </el-col>
          <el-col :xs="24" :sm="8">
            <div class="table">
              <h4>第九组金钱排行榜</h4>
              <ul>
                <li>
                  <el-row class="row" v-for="(item, index) in salesTable" :key="'sals-'+index">
                    <el-col :span="3"><div v-bind:class="[item.num > 3 ? 'light' : '', 'circular']" >{{item.num}}</div></el-col>
                    <el-col :span="16">{{item.title}}</el-col>
                    <el-col :span="5">{{item.val}}</el-col>
                  </el-row>
                </li>
              </ul>
            </div>
          </el-col>
        </el-row>
      </el-tabs>
    </el-card>
    <!-- 销售表 /-->

    <br>
    <!-- 搜索热度 -->
    <el-row :gutter="20" >
      <el-col :xs="24" :sm="12" >
        <el-card class="hots">
          <div slot="header" class="header">
            <span>小组成员信息</span>
            <el-dropdown trigger="click" class="ops">
              <span class="el-dropdown-link">
                ...<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>第一天</el-dropdown-item>
                <el-dropdown-item>第二天</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <el-table height="280" :data="hotsTableData" style="width: 100%" :default-sort = "{prop: 'users', order: 'descending'}">
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column prop="title" label="姓名"></el-table-column>
            <el-table-column prop="users" label="体重" sortable width="80"></el-table-column>
            <el-table-column prop="increase" label="身高" sortable width="100"></el-table-column>
          </el-table>
          <el-pagination class="pagination" background layout="prev, pager, next" :total="500"></el-pagination>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" >
        <el-card class="hots">
          <div slot="header" class="header">
            <span>小组各成员体重占比</span>
            <el-dropdown trigger="click" class="ops">
              <span class="el-dropdown-link">
                ...<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>第一天</el-dropdown-item>
                <el-dropdown-item>第二天</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div>
            <el-radio-group v-model="radioArea" size="mini">
              <el-radio-button label="阿珍"></el-radio-button>
              <el-radio-button label="阿翊"></el-radio-button>
              <el-radio-button label="阿勇"></el-radio-button>
              <el-radio-button label="阿智"></el-radio-button>
              <el-radio-button label="阿丽"></el-radio-button>
              <el-radio-button label="阿强"></el-radio-button>
              <el-radio-button label="阿娜"></el-radio-button>
            </el-radio-group>
          </div>
          <div class="chart">
            <area-chart></area-chart>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 搜索热度 /-->

    <br>
    <!-- 周搜索趋势 -->
    <el-card class="hots">
      <div slot="header" class="header">
        <span>小组每日体重统计</span>
        <el-dropdown trigger="click" class="ops">
          <span class="el-dropdown-link">
            ...<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>第一天</el-dropdown-item>
            <el-dropdown-item>第二天</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="chart">
        <bar-chart></bar-chart>
      </div>
    </el-card>
    <!-- 周搜索趋势 /-->

  </div>
</template>

<script>
import LineChart from './../components/dashboardLineChart'
import RaddarChart from './../components/dashboardRaddarChart'
import PieChart from './../components/dashboardPieChart'
import BarChart from './../components/dashboardBarChart'
import AreaChart from './../components/dashboardAreaChart'

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165, 100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 15, 120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  name: 'dashboard',
  components: {
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
    AreaChart
  },
  data () {
    return {
      lineChartData: lineChartData.newVisitis,
      activeName: 'newVisitis',
      datePicker: '',
      pickerOptions2: {
        shortcuts: [
          {
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      salesTable: [],
      hotsTableData: [],
      radioArea: '全渠道',
      Asen: ['阿翊', '阿勇', '阿丽', '阿智', '阿强', '阿娜', '阿珍']
    }
  },
  methods: {
    handleSetLineChartData (type) {
      this.lineChartData = lineChartData[type.name]
    }
  },
  computed: {},
  created () {
    for (let i = 1; i < this.Asen.length + 1; i++) {
      this.salesTable.push(
        {
          num: i,
          title: `${this.Asen[i - 1]} 有 ${i} 分钱`,
          val: this.Asen[i - 1]
        }
      )
      this.hotsTableData.push(
        {
          num: i,
          title: this.Asen[i - 1],
          users: Math.round(Math.random() * 500 + 300) + 'kg',
          increase: `${Math.round(Math.random() * 50 + 40)}cm`
        }
      )
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-container {
  margin: 10px;
}

.box-card {
  padding: 5px 10px;
  .header {
    height: 25px;
    span {
      color: #97a8be;
      font-size: 14px;
    }
    .item {
      color: #97a8be;
      float: right;
      padding: 3px 0;
    }
  }
  // 总销售额
  .total {
    font-size: 30px;
    height: 140px;
    line-height: 140px;
    padding-left: 20px;
  }
  .trends {
    height: 22px;
    font-size: 14px;
    span {
      display: inline;
      i {
        color: red;
      }
    }
    span:last-child {
      margin-left: 20px;
      display: inline;
      i {
        color: green;
      }
    }
  }
  .chart {
    height: 160px;
  }
  .hr {
    border-top: 1px solid #e8e8e8;
    margin: 0px 0px 10px 0px;
  }
  .footer {
    span {
      font-size: 14px;
      line-height: 22px;
    }
    span:last-child {
      margin-left: 8px;
      color: rgba(0, 0, 0, 0.85);
    }
  }
  // 总销售额 end
}

// 销售额
.sales-card {
  position: relative;
  .header {
    color: #999999;
    position: absolute;
    right: 20px;
    top: 15px;
    z-index: 1;
  }
  .chart {
    widows: 100%;
    height: 300px;
  }
  .table {
    color: rgba(0,0,0,.65);
    h4 {
      color: #000;
      font-weight: 500;
    }
    ul {
      list-style: none;
      margin: 0px;
      padding: 0px;
      .row {
        margin-bottom: 10px;
      }
    }
    .circular {
      width: 20px;
      height: 20px;
      background-color: #314659;
      color: #fff;
      text-align: center;
      font-size: 12px;
      line-height: 20px;
      font-weight: 600;
      border-radius:50%
    }
    .light {
      background-color: #f5f5f5;
      color: rgba(0,0,0,.65);
    }
  }
}

// 线上热门搜索
.hots {
  height: 400px;
  position: relative;
  .header {
    color: #97a8be;
    .ops {
      position: absolute;
      right: 20px;
    }
  }
  .pagination {
    position: absolute;
    right: 12px;
    bottom: 5px;
  }
  .chart {
    height: 300px;
  }
}

// 周搜索
.month-card {
  height: 400px;
  .chart {
    height: 300px;
  }
}
</style>
