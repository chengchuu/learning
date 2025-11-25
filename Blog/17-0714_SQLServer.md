# SQLServer 中 exists 和 except 用法

## 一、exists

### 1.1 说明

EXISTS（包括 NOT EXISTS）子句的返回值是一个 BOOL 值。EXISTS 内部有一个子查询语句（SELECT ... FROM...），我将其称为 EXIST 的内查询语句。其内查询语句返回一个结果集。EXISTS 子句根据其内查询语句的结果集空或者非空，返回一个布尔值。[Link](https://www.cnblogs.com/netserver/archive/2008/12/25/1362615.html)

exists：强调的是是否返回结果集，不要求知道返回什么，比如：`select name from student where sex = 'm' and mark exists(select 1 from grade where ...) `，只要 exists 引导的子句有结果集返回，那么 exists 这个条件就算成立了，大家注意返回的字段始终为 1，如果改成 `select 2 from grade where ...`，那么返回的字段就是 2，这个数字没有意义。所以 exists 子句不在乎返回什么，而是在乎是不是有结果集返回。EXISTS = IN，意思相同不过语法上有点点区别，好像使用 IN 效率要差点，应该是不会执行索引的原因。[Link](https://www.cnblogs.com/mytechblog/articles/2105785.html)

相对于 inner join，exists 性能要好一些，当它找到第一个符合条件的记录时，就会立即停止搜索返回 TRUE。

### 1.2 示例

```
--EXISTS
--SQL:
select name from family_member
where group_level > 0
and exists(select 1 from family_grade where family_member.name = family_grade.name
and grade > 90)

--result:
name
cherrie

--NOT EXISTS
--SQL:
select name from family_member
where group_level > 0
and not exists(select 1 from family_grade where family_member.name = family_grade.name
and grade > 90)

--result:
name
mazey
rabbit
```

### 1.3 intersect/2017-07-21

intersect 的作用与 exists 类似。

```
--intersect
--SQL:
select name from family_member where group_level > 0
intersect
select name from family_grade where grade > 90

--result:
name
cherrie
```

## 二、except

### 2.1 说明

查询结果上 EXCEPT = NOT EXISTS，INTERSECT = EXISTS，但是 EXCEPT/INTERSECT 的「查询开销」会比 NOT EXISTS/EXISTS 大很多。

except 自动去重复，not in/not exists不会。

![](https://blog.mazey.net/wp-content/uploads/2021/12/201707141150.jpg)

### 2.2 示例

```
--except
--SQL:
select name from family_member
where group_level > 0
except(select name from family_grade)

--result:
name
rabbit

--NOT EXISTS
--SQL:
select name from family_member
where group_level > 0
and not exists(select name from family_grade where family_member.name = family_grade.name)

--result:
name
rabbit
rabbit
```

## 三、测试数据

其中验证 except 去重复功能时在 family_member 中新增一个 rabbit。

```
-- ----------------------------
-- Table structure for family_grade
-- ----------------------------
DROP TABLE [mazeytop].[family_grade]
GO
CREATE TABLE [mazeytop].[family_grade] (
[id] int NOT NULL ,
[name] varchar(20) NULL ,
[grade] int NULL 
)


GO

-- ----------------------------
-- Records of family_grade
-- ----------------------------
INSERT INTO [mazeytop].[family_grade] ([id], [name], [grade]) VALUES (N'1', N'mazey', N'70')
GO
GO
INSERT INTO [mazeytop].[family_grade] ([id], [name], [grade]) VALUES (N'2', N'cherrie', N'93')
GO
GO

-- ----------------------------
-- Table structure for family_member
-- ----------------------------
DROP TABLE [mazeytop].[family_member]
GO
CREATE TABLE [mazeytop].[family_member] (
[id] int NOT NULL ,
[name] varchar(20) NULL ,
[sex] varchar(20) NULL ,
[age] int NULL ,
[group_level] int NULL 
)


GO

-- ----------------------------
-- Records of family_member
-- ----------------------------
INSERT INTO [mazeytop].[family_member] ([id], [name], [sex], [age], [group_level]) VALUES (N'1', N'mazey', N'male', N'23', N'1')
GO
GO
INSERT INTO [mazeytop].[family_member] ([id], [name], [sex], [age], [group_level]) VALUES (N'2', N'cherrie', N'female', N'22', N'2')
GO
GO
INSERT INTO [mazeytop].[family_member] ([id], [name], [sex], [age], [group_level]) VALUES (N'3', N'rabbit', N'female', N'15', N'3')
GO
GO
INSERT INTO [mazeytop].[family_member] ([id], [name], [sex], [age], [group_level]) VALUES (N'4', N'rabbit', N'female', N'15', N'3')
GO
GO

-- ----------------------------
-- Table structure for family_part
-- ----------------------------
DROP TABLE [mazeytop].[family_part]
GO
CREATE TABLE [mazeytop].[family_part] (
[id] int NOT NULL ,
[group] int NULL ,
[group_name] varchar(20) NULL 
)


GO

-- ----------------------------
-- Records of family_part
-- ----------------------------
INSERT INTO [mazeytop].[family_part] ([id], [group], [group_name]) VALUES (N'1', N'1', N'父亲')
GO
GO
INSERT INTO [mazeytop].[family_part] ([id], [group], [group_name]) VALUES (N'2', N'2', N'母亲')
GO
GO
INSERT INTO [mazeytop].[family_part] ([id], [group], [group_name]) VALUES (N'3', N'3', N'女儿')
GO
GO

-- ----------------------------
-- Indexes structure for table family_grade
-- ----------------------------

-- ----------------------------
-- Primary Key structure for table family_grade
-- ----------------------------
ALTER TABLE [mazeytop].[family_grade] ADD PRIMARY KEY ([id])
GO

-- ----------------------------
-- Indexes structure for table family_member
-- ----------------------------

-- ----------------------------
-- Primary Key structure for table family_member
-- ----------------------------
ALTER TABLE [mazeytop].[family_member] ADD PRIMARY KEY ([id])
GO

-- ----------------------------
-- Indexes structure for table family_part
-- ----------------------------

-- ----------------------------
-- Primary Key structure for table family_part
-- ----------------------------
ALTER TABLE [mazeytop].[family_part] ADD PRIMARY KEY ([id])
GO
```

**更新记录**

本文首次编辑于 2017-07-14，最近更新于 2025-11-25。

**版权声明**

本文为原创文章，作者保留版权。转载请保留本文完整内容，并以超链接形式注明作者及原文出处。

作者: [除除](https://github.com/chengchuu)
原文: <http://blog.mazey.net/553.html>

(完)