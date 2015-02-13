/**
 * Created by chensheng on 15/2/13.
 */
// 发布者
var Mom = function () {
    this.son = [];
};
// 发布方法
Mom.prototype.call = function (meal) {
    this.son.forEach(function (v) {
        v.receive(meal);
    });
};
// 订阅者
var Son = function (name) {
    this.name = name;
};
Son.prototype = {
    // 订阅方法
    subscribe: function (mom) {
        var _this = this;
        var isCall = mom.son.some(function (v) {
            return v === _this;
        });
        if(!isCall) {
            mom.son.push(_this);
        }
        return this;
    },
    // 退订方法
    unSubscribe: function (mom) {
        var _this = this;https://github.com/csonchen/mail.git
        mom.son = mom.son.filter(function (v) {
            return v !== _this;
        });
        return this;
    },
    // 接收方法
    receive: function (meal) {
        console.log('' + meal + '啦！');
    }
}
// 声明发布者
var mom = new Mom();
// 声明订阅者
var xiaoM = new Son('小明');
// 订阅
xiaoM.subscribe(mom);
// 发布
mom.call('早饭');
mom.call('中饭');
// 退订
xiaoM.unSubscribe(mom);
mom.call('晚饭');  // 吃不到晚饭啦！