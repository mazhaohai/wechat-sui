define('check.module', ['angular', 'angular-sanitize', 'sm'], function (angular) {
	"use strict"
	var _init = true;
	var module = angular.module('app.check', ['ngSanitize']);
	module.controller('CheckCtrl', ['$scope', '$sce', '$interval', '$timeout','$compile', function ($scope, $sce, $interval, $timeout, $compile) {
		$scope.vm = {
			tplcache:[]
		}
		$scope.goPage = _goPage;
		function _goPage(pageid,tplurl) {
			_compileHtml(pageid,tplurl,function(iscache){
				if(iscache){
					_loadData(pageid);
				}else{
					$scope.$apply(function(){
						_loadData(pageid);
					})
				}
			});
		}
		//根据pageid进行业务逻辑处理
		function _loadData(pageid){
			
			$.router.load(pageid);
			$timeout(function(){
				if(pageid=="#firstpage"){
					$scope.vm.title1="成功绑定第一页面";
				}else if(pageid=="#secondpage"){
					$scope.vm.title2="成功绑定第二页面";
				}else if(pageid=="#thirdpage"){
					$scope.vm.title3="成功绑定第三页面";
				}
			},2000)
		}
		//路由跳转前先加载模板，如果未加载过，手动进入脏检，并记录缓存，下次不进行模板加载
		//container动态加载模板的容器id
		//tplur模板的url地址
		//callback回调
		function _compileHtml(container,tplurl,callback){
			if($scope.vm.tplcache.indexOf(tplurl)>-1){
				callback(true);
			}else{
				require(['text!' + globalConfig.viewsPath + tplurl],function(html){
					$(container).append($(html));
					$compile($(container))($scope);
					$scope.vm.tplcache.push(tplurl);
					callback(false);
				})
			}
			
		}
		function init(){
			//必须先执行
			smInit();
			_goPage("#firstpage",'check/tpl1.html');
		}
		init();
		//拦截sm框架back和load函数
		function smInit(){
			//自定义控制参数
			var CONFIG={
				noAniPage:'blankpage',
				isBack:false//判断是否为back状态，采用不同的切换效果	
			};
			/*捕获返回按钮事件*/
			var DIRECTION = {
				leftToRight: 'from-left-to-right',
				rightToLeft: 'from-right-to-left'
			};
			var EVENTS = {
				pageLoadStart: 'pageLoadStart', // ajax 开始加载新页面前
				pageLoadCancel: 'pageLoadCancel', // 取消前一个 ajax 加载动作后
				pageLoadError: 'pageLoadError', // ajax 加载页面失败后
				pageLoadComplete: 'pageLoadComplete', // ajax 加载页面完成后（不论成功与否）
				pageAnimationStart: 'pageAnimationStart', // 动画切换 page 前
				pageAnimationEnd: 'pageAnimationEnd', // 动画切换 page 结束后
				beforePageRemove: 'beforePageRemove', // 移除旧 document 前（适用于非内联 page 切换）
				pageRemoved: 'pageRemoved', // 移除旧 document 后（适用于非内联 page 切换）
				beforePageSwitch: 'beforePageSwitch', // page 切换前，在 pageAnimationStart 前，beforePageSwitch 之后会做一些额外的处理才触发 pageAnimationStart
				pageInit: 'pageInitInternal' // 目前是定义为一个 page 加载完毕后（实际和 pageAnimationEnd 等同）
			};
			var routerConfig = {
				sectionGroupClass: 'page-group',
				// 表示是当前 page 的 class
				curPageClass: 'page-current',
				// 用来辅助切换时表示 page 是 visible 的,
				// 之所以不用 curPageClass，是因为 page-current 已被赋予了「当前 page」这一含义而不仅仅是 display: block
				// 并且，别的地方已经使用了，所以不方便做变更，故新增一个
				visiblePageClass: 'page-visible',
				// 表示是 page 的 class，注意，仅是标志 class，而不是所有的 class
				pageClass: 'page'
			};
			$.router._back = function (state, fromState) {
				//后退操作
				CONFIG.isBack = true;
				//跳转到第一个页面时，再后退，关闭页面
				if(state.pageId == "blankpage"||fromState.pageId == "firstpage"){
					wx.closeWindow();
					return;
				}
				//根据业务逻辑跳转到哪个页面
				if(state.pageId == "secondpage"&&fromState.pageId=="thirdpage"){
					_goPage("#firstpage",'check/tpl1.html');
					return;
				}
				if (this._isTheSameDocument(state.url.full, fromState.url.full)) {
					var $newPage = $('#' + state.pageId);
					if ($newPage.length) {
						var $currentPage = this._getCurrentSection();
						this._animateSection($currentPage, $newPage, DIRECTION.leftToRight);
						this._saveAsCurrentState(state);
					} else {
						location.href = state.url.full;
					}
				} else {
					this._saveDocumentIntoCache($(document), fromState.url.full);
					this._switchToDocument(state.url.full, false, false, DIRECTION.leftToRight);
					this._saveAsCurrentState(state);
				}
			};
			$.router._animateSection = function($from, $to, direction) {
				var toId = $to.attr('id');
				$from.trigger(EVENTS.beforePageSwitch, [$from.attr('id'), $from]);

				$from.removeClass(routerConfig.curPageClass);
				$to.addClass(routerConfig.curPageClass);
				//页面初始化不执行动画切换效果
				if($from.attr('id')!=CONFIG.noAniPage){
					$to.trigger(EVENTS.pageAnimationStart, [toId, $to]);
					if(CONFIG.isBack){
						direction=DIRECTION.leftToRight;
					}else{
						direction=DIRECTION.rightToLeft;
					}
					this._animateElement($from, $to, direction);
					$to.animationEnd(function() {
						$to.trigger(EVENTS.pageAnimationEnd, [toId, $to]);
						// 外层（init.js）中会绑定 pageInitInternal 事件，然后对页面进行初始化
						$to.trigger(EVENTS.pageInit, [toId, $to]);
						CONFIG.isBack=false;
					});
				}
			};
		}
	}]);
	module.directive('myDire',['$timeout',function($timeout){
		return {
			scope:{},
			replace:false,
			restrict:'AE',
			link:function(scope,elem,attrs){
				elem.html("我是指令哦~~");
			}
		}
	}])
	angular.bootstrap(document, ['app.check']);
});