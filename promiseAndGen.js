function run(gen){
	var args = [].slice.call(arguments,1),
		it;

	//当前上下文初始化生成器
	it = gen.apply(this,args);

	//返回一个promise用于生成器完成
	return Promise.resolve()
		.then(function handleNext(value){
			//对下一个yield出的值运行
			var next = it.next(value);

			return (function handleResult(next){
				//判断生成器是否完毕
				if (next.done) {
					return next.value;
				}
				else{
					return Promise.resolve(next.value)
						//成功就恢复异步循环，把决议的值发回生成器
						//拒绝则把错误传回生成器进行错误处理
						.then(handleNext,function handleErr(err){
							return Promise.resolve(it.throw(err))
								.then(handleResult);
						})
				}
			})(next);
		})
}