# koa-mongoos-demo

使用koa+mongoos实现的一个简单blog示例，作为学习笔记的综合示例。主要实现了几个关联的处理，没有做数据的验证和一些函数的封装。

关联说明：
- 用户与用户，用户之间可以关注，一个用户可以关注多个用户，一个用户也可以被多个用户关注，是多对多的关系
- 用户与文章，一个用户可以有多篇文章，一篇文章属于一个用户，是一对多的关系
- 用户与文章，一个用户可以收藏多篇文章，一篇文章也可以被多个用户收藏，是多对多的关系
- 文章与标签，一篇文章可以有多个标签，一个标签也可以有多个文章，是多对多的关系（此处在示例中完全不用通过关联来处理，仅通过查询去重实现标签查询和标签对应的文章查询）
