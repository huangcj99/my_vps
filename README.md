（此仓库内容仅为学习使用，可访问104.194.93.138，部分功能无法使用，如cookie相关功能）

	github:  git@github.com:smallcatcat-joe/my_vps.git

注：目录charmingHui为XX惠网站相关文件
    可进行注册、登录页面跳转以及session状态保存
    该服务器脚本均为访问远程数据库，ip地址为104.194.93.138
    	

1、先执行npm安装mongoose,后启动主服务器脚本index.js

	server.js为服务器监听并通过请求类型分流、分别进入到method.js中不同的函数，
	method.js则通过路径进行任务的细分(包括文件的返回与数据的请求)。

2、在浏览器当中输入localhost:8080 + 项目文件路径即可访问相应页面

	如：localhost:8080/charmingHui/src/index.html。
	（其余文件均可通过路径访问文件、主页可直接访问localhost:8080）

	主页图片路径通过ajax请求服务器，然后通过数据库返回的数据进行src插入

3、charming_account/account.js
	
	注册、登录页面表单数据与远程mongodb数据库的交互、以及有关session保存页面登录状态的脚本，
	可自行进入注册页面进行注册，密码在加入数据库前进行了单向加密，
	session_id设置了expires为1天、httpOnly，不可用document.cookie进行更改。

4、charmingHui/src/server_node/crepper.js

	执行crepper可获取网站主页以及各个商品列表页的img、

	爬取下的图片资源存放路径：
		src/img/list下的图片为魅力惠主页各个类别模块的img，
		src/img/commodity_list/pop_up1~5分别为女士、男士、美妆、家居、婴童下的商品分类页面的img。
	(上传了只留了相关图片，github上有)

5、charmingHui/server_node/homepage_img_href.js
	
	执行此脚本可将src/img/list/homepage下的图片的请求路径添加到远程数据库104.194.93.138上，
	后通过ajax请求数据库中主页的图片数据，进行初始插入(相关功能脚本在charming_get_img文件夹内)。

