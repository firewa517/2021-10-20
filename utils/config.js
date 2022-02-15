
//定义业务域名
let URL = '';

//通过环境判断的方式这是业务域名
if(process.env.NODE_ENV === 'development'){
	//开发环境
	URL = 'http:///localhost:3000'
	/* URL = 'https://api.aslegou.top' */
}else{
	//线上环境
	URL = 'https://api.aslegou.top'
}

export default URL