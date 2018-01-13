# Vue-datepicker-freedom
基于[vuejs-datepicker](https://github.com/charliekassel/vuejs-datepicker)的一个简单的可配置，分组，多选的日期控件

## 简单demo

[vue-datepicker-freedom, fight for freedom ^_^](https://showjoy.github.io/vue-datepicker-freedom/#/markdown)

## 安装使用
```
  npm install vue-datepicker-freedom --save
```
```
  import DatePicker from 'vue-datepicker-freedom';

  Vue.component('your-component, {
    components: {
      DatePicker
    }
  });
```
```
  <date-picker inline v-model="date"
    :format="format"
    show-tool
    :defaultDayGroups="dayGroups"
    language="zh"
    :sidebarOptions="sidebarOptions"
    @changedGroup="changedGroup"
    :disabled="disabled"
    @selected="changeDate">
  </date-picker>
```

## 介绍
  你可以使用[vuejs-datepicker](https://github.com/charliekassel/vuejs-datepicker)里的所有特性，除此之外，添加了一些新的属性，方法和事件，如下

### 属性
| 属性名              | 类型       | 默 认   | 描述                       |
| ------------------ | --------- | ------  | ------------------------- | 
| show-tool          | Boolean   | false   | 是否显示工具条（清除，重置）   |
| default-day-groups | Array     |         | 默认展示分组的信息（具体值看下）|
| sidebar-options    | Object    |         | 分组栏选项信息               |
| height             | Number    | 35      | 控件高度                    |


#### default-day-groups
| 参数               | 类型              | 描述                                       |
| ----------------  | ----------------- | ----------------------------------------- | 
| type              | Number or String  |    分组类型，用于sidebar-options中对其进行操作 |
| class             | String            | 该日期分组设置的类名，可以对不同分组添加不同的样式 |
| dates             | Array<Date or timestamp>    |        分组的日期                  |

#### sidebar-options
| 参数               | 类型           | 描述                                       |
| ----------------  | -------------- | ----------------------------------------- | 
| position          | String         | 分组栏显示的位置，left(default),top,bottom,right |
| bars             | Array           | 分组栏中的每个bar的定义，具体可参看demo         |

### 方法
可以通过ref调用控件中的方法, cancel,confirm在多选模式下使用

| 方法名              | 描述                     |
| ------------------ | ----------------------- | 
| resetDayGroups     | 重置为默认分组             |
| clearCheckedDate   |  清除当前选择的日期         |
| setGroupOfCheckedDate | 参数是default-day-groups中定义的type, 把当前选中的分为一组 |
| cancel             |  取消选择                 |
| confirm             |  确认选择                 |

### 事件
| 事件名              | 描述                                    |
| ------------------ | -------------------------------------- | 
| changedGroup       | 设置分组后会触发改时间，参数为当前所有分组信息 |
