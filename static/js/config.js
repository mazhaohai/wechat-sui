
requirejs.config({
    baseUrl: '/static/js/app/',
    paths: {
        "angular": '//cdn.bootcss.com/angular.js/1.5.0/angular.min',
        'angular-sanitize': '//cdn.bootcss.com/angular-sanitize/1.5.0/angular-sanitize.min',
        'zepto': '//g.alicdn.com/sj/lib/zepto/zepto.min',
        'sm': '//g.alicdn.com/msui/sm/0.6.2/js/sm.min'
    },
    shim: {
        'zepto': {
            exports: '$'
        },
        'angular':{
            exports:'angular'
        },
        'angular-sanitize':{
            deps:['angular'],
            exports:'angular'
        },
        'sm': {
            deps: ['zepto']
        }
    },
    map: {
        '*': {
            'css': globalConfig.libPath + 'css.js',
            'text': '/static/js/libs/text.js'
        },
    }
    //urlArgs: "bust="+(new Date()).getTime()
});


