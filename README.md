（此仓库内容仅为学习使用）

注：目录charmingHui为XX惠网站相关文件
    该服务器脚本均为访问远程数据库，ip地址为104.194.93.138	

1、先启动服务器脚本index.js

2、在浏览器当中输入localhost:8080 + 项目文件路径即可访问相应页面

	如：localhost:8080/charmingHui/src/index.html
	（其余文件均可通过路径访问文件）

3、charming_account/account.js
	
	注册、登录页面表单数据与远程mongodb数据库的交互、以及有关session保存页面登录状态的脚本

4、charmingHui/src/server_node/crepper.js

	执行crepper可获取网站主页以及各个商品列表页的img、

	爬取下的图片资源存放路径：
		src/img/list下的图片为魅力惠主页各个类别模块的img
		src/img/commodity_list/pop_up1~5分别为女士、男士、美妆、家居、婴童下的商品分类页面的img

5、charmingHui/server_node/homepage_img_href.js
	
	执行此脚本可将src/img/list/homepage下的图片的请求路径添加到远程数据库104.194.93.138上